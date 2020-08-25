import { getAlbumsFromData, checkDataForAlbum, checkDataForMutations, getSongsFromData } from "../helpers/mutations";
import { makeReleaseString } from '../helpers/makeReleaseString';
import { Song, SongInterface } from "./Song";
import { AlbumCover, AlbumCoverInterface } from "./AlbumCover";
import { DEFAULT_HEADERS } from '../headers'
import path from 'path';
import fs from 'fs';
import nodeFetch from 'node-fetch';

interface AlbumInterface {
  title: string;
  artist: string;
  songs: SongInterface[];
  albumCovers: AlbumCoverInterface[];
  releaseYear: number;
  releaseMonth: number;
  releaseDay: number;
}

class Album {
  title: string
  artist: string
  songs: Song[]
  albumCovers: AlbumCover[]
  releaseYear: number
  releaseMonth: number
  releaseDay: number

  constructor({
    title,
    artist,
    songs,
    albumCovers,
    releaseYear,
    releaseMonth,
    releaseDay,
  }: AlbumInterface) {
    this.title = title;
    this.artist = artist;
    this.albumCovers = albumCovers.map(albumCover => new AlbumCover(albumCover))
    this.releaseYear = releaseYear;
    this.releaseMonth = releaseMonth;
    this.releaseDay = releaseDay;

    if (Array.isArray(songs)) {
      this.songs = songs.map(song => new Song(song));
    } else {
      this.songs = [];
    }
  }

  getSmallestAlbumCover() {
    return this.albumCovers.sort((a, b) => a.getPixelCount() - b.getPixelCount())[0]
  }

  getLargestAlbumCover() {
    return this.albumCovers.sort((a, b) => b.getPixelCount() - a.getPixelCount())[0]
  }

  getReleaseString() {
    return makeReleaseString(this.releaseYear, this.releaseMonth, this.releaseDay)
  }

  addSongsFromMutations(mutations: object): void {
    const songsData = getSongsFromData(mutations);

    this.songs.push(
      ...songsData.map(songData => Song.createFromMutation(this, songData))
    )
  }

  static createFromMutations(mutations: object): Album | void {
    if (!checkDataForMutations(mutations)) return;
    if (!checkDataForAlbum(mutations)) return;

    const albumData = getAlbumsFromData(mutations)[0];

    const albumInterfaceData = {
      title: albumData.title,
      artist: albumData.artistDisplayName,
      albumCovers: albumData.thumbnailDetails.thumbnails.map(mutation => new AlbumCover(mutation)),
      releaseYear: albumData.releaseDate.year,
      releaseMonth: albumData.releaseDate.month,
      releaseDay: albumData.releaseDate.day
    } as AlbumInterface

    const album = new Album(albumInterfaceData)

    album.addSongsFromMutations(mutations);

    return album
  }

  downloadAlbumCover({
    location,
    setStatus,
    index,
  }: {
    location: string;
    setStatus?: (newString: string, index?: number) => any;
    index?: number;
  }) {
    return new Promise((resolve, reject) => {
      const downloadPath = path.join(location, 'cover.jpg')

      if (setStatus) setStatus('Downloading album cover')
      nodeFetch(this.getLargestAlbumCover().url, {
        headers: DEFAULT_HEADERS
      })
        .then((res) => {
          const dest = fs.createWriteStream(downloadPath)
          res.body.pipe(dest)

          res.body.on('error', (e) => {
            console.log(e)
            reject(e);
          })

          let bytes = 0;
          res.body.on('data', (chunk) => {
            bytes += chunk.length;
            if (typeof setStatus === 'function' && typeof index === 'number') setStatus(`Downloaded ${Math.round(bytes / 1024)}KB of Album Cover`, index);
          })

          res.body.on('end', () => {
            if (typeof setStatus === 'function' && typeof index === 'number') setStatus(`Downloaded Album Cover`, index)
            resolve();
          })
        })
        .catch((err) => {
          if (setStatus) setStatus('Error downloading album cover.\n' + err.stack)
          reject(err);
        })
    })
  }

  download({
    location,
    additionalMetadata,
    setStatus,
  }: {
    location: string;
    additionalMetadata: { [key: string]: string | number };
    setStatus?: (newString: string, index?: number) => any;
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        const ffmpegInstances: Promise<any>[] = [] as Promise<any>[];

        await this.downloadAlbumCover({ location, setStatus, index: this.songs.length })

        for (let i = 0; i < this.songs.length; i += 1) {
          const song = this.songs[i];

          await song.download({ location, setStatus, index: i });
          ffmpegInstances.push(song.convert({ location, additionalMetadata, setStatus, index: i }));
        }

        await Promise.all(ffmpegInstances);

        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
}

export {
  Album,
  AlbumInterface
}

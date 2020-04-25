import { getAlbumsFromData, checkDataForAlbum, checkDataForMutations, getSongsFromData } from "../helpers/mutations";
import { makeReleaseString } from '../helpers/makeReleaseString';
import { Song } from "./Song";
import { AlbumCover } from "./AlbumCover";

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
    albumCovers,
    releaseYear,
    releaseMonth,
    releaseDay,
  }: {
    title: string,
    artist: string,
    albumCovers: AlbumCover[],
    releaseYear: number,
    releaseMonth: number,
    releaseDay: number,
  }) {
    this.title = title;
    this.artist = artist;
    this.songs = [];
    this.albumCovers = albumCovers;
    this.releaseYear = releaseYear;
    this.releaseMonth = releaseMonth;
    this.releaseDay = releaseDay;
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

    const album = new Album({
      title: albumData.title,
      artist: albumData.artistDisplayName,
      albumCovers: albumData.thumbnailDetails.thumbnails.map(mutation => new AlbumCover(mutation)),
      releaseYear: albumData.releaseDate.year,
      releaseMonth: albumData.releaseDate.month,
      releaseDay: albumData.releaseDate.day
    })

    album.addSongsFromMutations(mutations);

    return album
  }

  downloadAlbumCover({
    location,
    setStatus,
    index,
  }: {
    location: string,
    setStatus?: (newString: string, index?: number) => any,
    index?: number
  }) {
    const path = window.require('path');
    const fs = window.require('fs');
    const Buffer = window.require('buffer').Buffer;

    const downloadPath = path.join(location, 'cover.jpg')

    return new Promise((resolve, reject) => {
      if (setStatus) setStatus('Downloading album cover', index)
      fetch(this.getLargestAlbumCover().url)
        .then(res => res.arrayBuffer())
        .then(data => fs.writeFile(downloadPath, Buffer.from(data), (err) => {
          if (err) {
            if (setStatus) setStatus('Error downloading album cover.\n' + err.stack, index)
            reject(err);
          } else {
            if (setStatus) setStatus('Finished downloading album cover!', index)
            resolve()
          }
        }))
    })
  }

  download({
    location,
    additionalMetadata,
    setStatus,
  }: {
    location: string,
    additionalMetadata: { [key: string]: string | number },
    setStatus?: (newString: string, index?: number) => any,
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        const ffmpegInstances: Promise<any>[] = [] as Promise<any>[];

        for (let i = 0; i < this.songs.length; i += 1) {
          const song = this.songs[i];

          if (setStatus) setStatus(`${song.title} queued`)
        }

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
  Album
}

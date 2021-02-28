import { Album } from "./Album";
import { AlbumCover, AlbumCoverInterface } from './AlbumCover';
import sanitiseFilename from 'sanitize-filename';
import ytdl from 'ytdl-core';
import path from 'path';
import fs from 'fs';
import childProcess from 'child_process';

interface SongInterface {
  id: string;
  title: string;
  album: string;
  date: string;
  trackNumber: number;
  artist: string;
  videoID: string;
  audioID: string;
  albumCovers: AlbumCoverInterface[];
}

class Song implements SongInterface {
  id: string
  title: string
  album: string
  date: string
  trackNumber: number
  artist: string
  videoID: string
  audioID: string
  albumCovers: AlbumCover[]

  constructor({
    id,
    title,
    album,
    date,
    trackNumber,
    artist,
    videoID,
    audioID,
    albumCovers,
  }: SongInterface) {
    this.id = id;
    this.title = title;
    this.album = album;
    this.date = date;
    this.trackNumber = trackNumber;
    this.artist = artist;
    this.videoID = videoID;
    this.audioID = audioID;

    if (Array.isArray(albumCovers)) {
      this.albumCovers = albumCovers.map(albumCover => new AlbumCover(albumCover))
    } else {
      this.albumCovers = []
    }
  }

  getSmallestAlbumCover(): AlbumCover {
    return this.albumCovers.sort((a, b) => a.getPixelCount() - b.getPixelCount())[0]
  }

  getLargestAlbumCover(): AlbumCover {
    return this.albumCovers.sort((a, b) => b.getPixelCount() - a.getPixelCount())[0]
  }

  getSafeFileName(): string {
    return sanitiseFilename(this.title);
  }

  static createFromMutation(parent: Album, mutation: any): Song | void {
    const audioModeVersionDecoded = decodeURIComponent(mutation.audioModeVersion || mutation.videoModeVersion)
    const audioModeVersionString = atob(audioModeVersionDecoded)
    const [, videoID, audioID] = /([a-zA-Z0-9_-]{11})\|([a-zA-Z0-9_-]{11})/.exec(audioModeVersionString)

    return new Song({
      id: mutation.id,
      title: mutation.title,
      album: parent.title,
      date: parent.getReleaseString(),
      trackNumber: parseInt(mutation.albumTrackIndex, 10),
      artist: mutation.artistNames,
      videoID,
      audioID,
      albumCovers: mutation.thumbnailDetails.thumbnails.map(mutation => new AlbumCover(mutation))
    })
  }

  getFFMPEGMetadata(additionalMetadata: {
    [key: string]: string | number;
  }) {
    return Object.assign({}, {
      title: this.title,
      album: this.album,
      track: this.trackNumber,
      artist: this.artist,
      date: this.date,
    }, additionalMetadata)
  }

  download({
    location,
    setStatus,
    index
  }: {
    location: string;
    setStatus?: (newString: string, index?: number) => any;
    index?: number;
  }): Promise<void> {
    const downloadPath = path.join(location, 'temp_' + this.getSafeFileName())

    return new Promise((resolve, reject) => {
      try {
        const downloadStream = ytdl(this.audioID, { quality: 'highestaudio' })
        const writeStream = fs.createWriteStream(downloadPath)

        downloadStream.pipe(writeStream)

        downloadStream.on('error', (e) => {
          console.log(e)
          reject(e);
        })

        let bytes = 0;
        downloadStream.on('data', (chunk) => {
          bytes += chunk.length;
          if (typeof setStatus === 'function' && typeof index === 'number') setStatus(`Downloaded ${Math.round(bytes / 1024)}KB of ${this.title}`, index);
        })

        downloadStream.on('end', () => {
          if (typeof setStatus === 'function' && typeof index === 'number') setStatus(`Downloaded ${this.title}`, index)
          writeStream.end()
          resolve();
        })
      } catch(e) {
        reject(e)
      }
    })
  }

  convert({
    location,
    additionalMetadata,
    setStatus,
    index,
  }: {
    location: string;
    additionalMetadata: { [key: string]: string | number };
    setStatus?: (newString: string, index?: number) => any;
    index?: number;
  }): Promise<void> {
    const albumCoverPath = path.join(location, 'cover.jpg')
    const downloadPath = path.join(location, 'temp_' + this.getSafeFileName())
    const convertPath = path.join(location, this.getSafeFileName() + '.mp3')
    const metadata = this.getFFMPEGMetadata(additionalMetadata);

    return new Promise((resolve, reject) => {
      let log = '';

      if (typeof setStatus === 'function' && typeof index === 'number') setStatus(`Converting ${this.title}...`, index)

      const ffmpegPath = [
        path.resolve('node_modules', 'ffmpeg-static', 'ffmpeg'),
        path.resolve('resources', 'ffmpeg')
      ]
        // Add .exe to the end if we are on Microsoft Windows
        .map(path => process.platform === 'win32' ? path + '.exe' : path)
        .find(path => fs.existsSync(path))

      if (!ffmpegPath) return reject(new Error('Could not find FFMPEG!'))

      const args = [
        '-y',
        '-loglevel', 'verbose',
        '-i', downloadPath,
        '-i', albumCoverPath,
        '-map', '0:0',
        '-map', '1:0',
        // '-c', 'copy',
        '-id3v2_version', '3',
        '-metadata', 'comment="Cover (front)"',
        ...Object.entries(metadata).map(([key, value]) => ['-metadata', `${key}=${value}`]).flat(),
        convertPath,
      ]

      const ffmpeg = childProcess.spawn(ffmpegPath, args, {
        windowsVerbatimArguments: false
      })

      ffmpeg.stderr.on('data', (data) => {
        log += data;
      })

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          if (typeof setStatus === 'function' && typeof index === 'number') setStatus(`Converted ${this.title}`, index)
          resolve();
        } else {
          if (typeof setStatus === 'function' && typeof index === 'number') setStatus(`Error while converting: ${log}`, index)
          reject(new Error(`An FFMPEG error has occurred:\n${ffmpegPath} + ${JSON.stringify(args)}\n\n${log}`))
        }
      });
    })
  }
}

export {
  Song,
  SongInterface
}

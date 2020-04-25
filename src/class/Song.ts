import { Album } from "./Album";
import { AlbumCover } from './AlbumCover';
import sanitiseFilename from 'sanitize-filename';

class Song {
  album: Album
  id: string
  title: string
  trackNumber: number
  artist: string
  videoID: string
  audioID: string
  albumCovers: AlbumCover[]

  constructor({
    id,
    album,
    title,
    trackNumber,
    artist,
    videoID,
    audioID,
    albumCovers,
  }: {
    id: string,
    album: Album,
    title: string,
    trackNumber: number,
    artist: string,
    videoID: string,
    audioID: string,
    albumCovers: AlbumCover[],
  }) {
    this.id = id;
    this.title = title;
    this.album = album;
    this.trackNumber = trackNumber;
    this.artist = artist;
    this.videoID = videoID;
    this.audioID = audioID;
    this.albumCovers = albumCovers;
  }

  getSmallestAlbumCover() {
    return this.albumCovers.sort((a, b) => a.getPixelCount() - b.getPixelCount())[0]
  }

  getLargestAlbumCover() {
    return this.albumCovers.sort((a, b) => b.getPixelCount() - a.getPixelCount())[0]
  }

  getSafeFileName() {
    return sanitiseFilename(this.title);
  }

  static createFromMutation(parent: Album, mutation: any): Song | void {
    const [, videoID, audioID] = /([a-zA-Z0-9_-]{11})\|([a-zA-Z0-9_-]{11})/.exec(atob(decodeURIComponent(mutation.audioModeVersion)))

    return new Song({
      id: mutation.id,
      album: parent,
      title: mutation.title,
      trackNumber: parseInt(mutation.albumTrackIndex, 10),
      artist: mutation.artistNames,
      videoID,
      audioID,
      albumCovers: mutation.thumbnailDetails.thumbnails.map(mutation => new AlbumCover(mutation))
    })
  }

  getFFMPEGMetadata(additionalMetadata: {
    [key: string]: string | number
  }) {
    return Object.assign({}, {
      title: this.title,
      album: this.album.title,
      track: this.trackNumber,
      artist: this.artist,
      date: this.album.getReleaseString(),
    }, additionalMetadata)
  }

  download({
    location,
    setStatus,
    index
  }: {
    location: string,
    setStatus?: (newString: string, index?: number) => any,
    index?: number
  }) {
    const ytdl = window.require('ytdl-core');
    const path = window.require('path');
    const fs = window.require('fs');

    const downloadPath = path.join(location, this.getSafeFileName() + '.ogg')

    return new Promise((resolve, reject) => {
      const downloadStream = ytdl(this.audioID, { quality: 'highestaudio' })

      downloadStream.pipe(fs.createWriteStream(downloadPath))

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
        resolve();
      })
    })
  }

  convert({
    location,
    additionalMetadata,
    setStatus,
    index,
  }: {
    location: string,
    additionalMetadata: { [key: string]: string | number },
    setStatus?: (newString: string, index?: number) => any,
    index?: number,
  }) {
    const path = window.require('path');
    const ffmpegPath = window.require('ffmpeg-static');
    const childProcess = window.require('child_process');

    const albumCoverPath = path.join(location, 'cover.jpg')
    const downloadPath = path.join(location, this.getSafeFileName() + '.ogg')
    const convertPath = path.join(location, this.getSafeFileName() + '.mp3')
    const metadata = this.getFFMPEGMetadata(additionalMetadata);
    
    return new Promise((resolve, reject) => {
      let log = '';

      if (typeof setStatus === 'function' && typeof index === 'number') setStatus(`Converting ${this.title}...`, index)

      const ffmpeg = childProcess.spawn(ffmpegPath, [
        '-y',
        '-i', downloadPath,
        '-i', albumCoverPath,
        '-map', '0:0',
        '-map', '1:0',
        // '-c', 'copy',
        '-id3v2_version', '3',
        '-metadata', 'comment="Cover (front)"',
        ...Object.entries(metadata).map(([key, value]) => ['-metadata', `${key}=${value}`]).flat(),
        convertPath,
      ], {
        windowsVerbatimArguments: false,
        encoding: 'UTF-8'
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
          reject(new Error(`An FFMPEG error has occurred:\n${log}`))
        }
      });
    })
  }
}

export {
  Song
}

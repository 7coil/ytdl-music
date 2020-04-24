import { Album } from "./Album";

class Song {
  album: Album
  title: string
  trackNumber: number
  artist: string
  videoID: string
  audioID: string

  constructor({
    album,
    title,
    trackNumber,
    artist,
    videoID,
    audioID,
  }: {
    album: Album,
    title: string,
    trackNumber: number,
    artist: string,
    videoID: string,
    audioID: string,
  }) {
    this.title = title;
    this.album = album;
    this.trackNumber = trackNumber;
    this.artist = artist;
    this.videoID = videoID;
    this.audioID = audioID;
  }

  static createFromMutation(parent: Album, mutation: any): Song | void {
    const [, videoID, audioID] = /([a-zA-Z0-9_-]{11})\|([a-zA-Z0-9_-]{11})/.exec(atob(decodeURIComponent(mutation.audioModeVersion)))

    return new Song({
      album: parent,
      title: mutation.title,
      trackNumber: parseInt(mutation.albumTrackIndex, 10),
      artist: mutation.artistNames,
      videoID,
      audioID,
    })
  }
}

export {
  Song
}

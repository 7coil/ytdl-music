import { getAlbumsFromData, checkDataForAlbum, checkDataForMutations, getSongsFromData } from "../helpers/mutations";
import { Song } from "./Song";

class Album {
  title: string
  artist: string
  songs: Song[]

  constructor({
    title,
    artist,
  }: {
    title: string,
    artist: string,
  }) {
    this.title = title;
    this.artist = artist;
    this.songs = [];
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
      artist: albumData.artistDisplayName
    })

    album.addSongsFromMutations(mutations);

    return album
  }
}

export {
  Album
}

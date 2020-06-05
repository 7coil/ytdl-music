export const INSERT_ALBUM = 'INSERT_ALBUM';
export const CLEAR_ALBUMS = 'CLEAR_ALBUMS';

export const insertAlbums = (data) => {
  return {
    type: INSERT_ALBUM,
    data
  }
}

export const clearAlbums = () => {
  return {
    type: CLEAR_ALBUMS
  }
}

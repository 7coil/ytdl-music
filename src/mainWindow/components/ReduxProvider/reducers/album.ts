import { INSERT_ALBUM, CLEAR_ALBUMS } from '../actions/album';
import { Album, AlbumInterface } from '../../../class/Album'
import { testPayloads } from '../../../payloads'

const albumReducer = (state: {
  albums: AlbumInterface[]
} = {
  albums: [] as AlbumInterface[]
}, action) => {
  switch(action.type) {
    case INSERT_ALBUM:
      return Object.assign({}, state, {
        albums: [...state.albums, action.data]
      })
    case CLEAR_ALBUMS:
      return Object.assign({}, state, {
        albums: []
      })
    default:
      return state;
  }
}

export {
  albumReducer
}

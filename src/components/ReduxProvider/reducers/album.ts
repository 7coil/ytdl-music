import { INSERT_ALBUM, CLEAR_ALBUMS } from '../actions/album';
import { Album } from '../../../class/Album'

const albumReducer = (state: {
  albums: Album[]
} = {
  albums: []
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

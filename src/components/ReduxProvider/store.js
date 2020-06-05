import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

const stuffToCompose = [
  applyMiddleware(thunk),
  window?.__REDUX_DEVTOOLS_EXTENSION__()
]

const reducers = combineReducers({
  albums: null // TODO
})

const configureStore = () => {
  return createStore(
    reducers,
    compose(...stuffToCompose)
  )
}

export {
  configureStore
}

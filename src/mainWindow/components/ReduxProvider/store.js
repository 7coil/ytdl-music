import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";
import { albumReducer } from "./reducers/album";

const stuffToCompose = [
  applyMiddleware(thunk),
  typeof window !== "undefined" &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ === "function" &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
].filter((middleware) => !!middleware);

const reducers = combineReducers({
  albums: albumReducer, // TODO
});

const configureStore = () => {
  return createStore(reducers, compose(...stuffToCompose));
};

export { configureStore };

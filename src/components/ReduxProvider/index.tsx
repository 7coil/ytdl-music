import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from './store';
import { AlbumInterface } from '../../class/Album';

class ReduxProvider extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        {this.props.children}
      </Provider>
    )
  }
}

interface RootStateInterface {
  albums: {
    albums: AlbumInterface[]
  }
}

export { ReduxProvider, RootStateInterface };


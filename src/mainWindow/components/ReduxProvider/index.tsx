import React, { Component, ReactElement } from 'react';
import { Provider } from 'react-redux';
import { AlbumInterface } from '../../class/Album';
import { configureStore } from './store';

class ReduxProvider extends Component<{ children: ReactElement }> {
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
    albums: AlbumInterface[];
  };
}

export { ReduxProvider, RootStateInterface };


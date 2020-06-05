import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from './store';

class ReduxProvider extends Component {
  render() {
    return (
      <Provider store={createStore()}>
        {this.props.children}
      </Provider>
    )
  }
}

export { ReduxProvider };


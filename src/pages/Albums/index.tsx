import React, { Component } from 'react';
import { displayYouTube } from '../../helpers/displayYouTube';
import { PageContainer } from '../../components/PageContainer';

class AlbumsPage extends Component {
  componentDidMount() {
    displayYouTube(false);
  }
  render() {
    return (
      <PageContainer>
        <h1>Discovered Albums</h1>
        <p>This page does not exist.</p>
      </PageContainer>
    )
  }
}

export { AlbumsPage }

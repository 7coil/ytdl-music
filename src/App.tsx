import React, { Component } from 'react';
import { Album } from './class/Album';
import { AlbumButton } from './components/AlbumButton';
import styles from './index.module.scss';
import { testPayloads } from './payloads';
import './scss/index.scss';

class App extends Component<{}, { albums: Album[], selectedAlbum: Album }> {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      selectedAlbum: null
    }
    this.addTestPayload = this.addTestPayload.bind(this);
    this.addAlbumFromMutations = this.addAlbumFromMutations.bind(this);
  }
  addAlbumFromMutations(data) {
    return new Promise((resolve) => {
      const newAlbum = Album.createFromMutations(data);

      if (newAlbum) {
        this.setState({
          albums: [...this.state.albums, newAlbum]
        }, resolve)
      }
    })
  }
  componentDidMount() {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.on('http-request', (e, data) => {
        this.addAlbumFromMutations(JSON.parse(data))
      })
    }
  }
  async addTestPayload() {
    for (let i = 0; i < testPayloads.length; i += 1) {
      await this.addAlbumFromMutations(testPayloads[i])
    }
  }
  render() {
    return <div>
      <button onClick={this.addTestPayload}>Create Test Payload</button>
      <div className={styles.container}>
        <div className={styles.albumList}>
          {this.state.albums.map((album, index) => <AlbumButton key={index} title={album.title} artist={album.artist} selected={this.state.selectedAlbum === album} onClick={() => { this.setState({ selectedAlbum: album }) }} />)}
        </div>
        {
          this.state.selectedAlbum ?
          <div>
            <h1>{this.state.selectedAlbum.title}</h1>
            <h2>By {this.state.selectedAlbum.artist}</h2>
            <table>
              <thead>
                <tr>
                  <td>#</td>
                  <td>Title</td>
                  <td>Artist</td>
                  <td>Video ID</td>
                  <td>Audio ID</td>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.selectedAlbum.songs
                    .sort((songA, songB) => songA.trackNumber - songB.trackNumber)
                    .map((song, index) =>
                      <tr key={index}>
                        <td>{song.trackNumber}</td>
                        <td>{song.title}</td>
                        <td>{song.artist}</td>
                        <td>{song.videoID}</td>
                        <td>{song.audioID}</td>
                      </tr>
                    )
                }
              </tbody>
            </table>
          </div> :
          <div>
            <h1>Welcome to ytdl-music</h1>
            <p>Navigate to an album page in YouTube Music, and then return here to select the album on the left hand pane.</p>
          </div>
        }
      </div>
    </div>
  }
}

export { App };


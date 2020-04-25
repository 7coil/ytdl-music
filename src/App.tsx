import React, { Component } from 'react';
import { Album } from './class/Album';
import { AlbumButton } from './components/AlbumButton';
import styles from './index.module.scss';
import { testPayloads } from './payloads';
import './scss/index.scss';

enum DownloadState {
  READY, DOWNLOADING, DOWNLOADED, ERROR
}

class App extends Component<{}, { albums: Album[], selectedAlbum: Album, status: string[], downloadState: DownloadState, overwriteGenre: string, overwriteArtist: string }> {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      selectedAlbum: null,
      status: [],
      downloadState: DownloadState.READY,
      overwriteGenre: '',
      overwriteArtist: '',
    }
    this.addTestPayload = this.addTestPayload.bind(this);
    this.addAlbumFromMutations = this.addAlbumFromMutations.bind(this);
    this.downloadDialog = this.downloadDialog.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.handleArtistChange = this.handleArtistChange.bind(this);
    this.handleGenreChange = this.handleGenreChange.bind(this);
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
  setStatus(newString: string, index?: number) {
    if (typeof index === 'number') {
      this.setState((prevState) => {
        prevState.status[index] = newString;
        return {
          status: prevState.status
        }
      });
    } else {
      this.setState((prevState) => {
        prevState.status.push(newString);
        return {
          status: prevState.status
        }
      })
    }
  }
  downloadDialog() {
    const dialog = window.require('electron').remote.require('electron').dialog

    dialog.showOpenDialog({
      properties: ['openDirectory']
    })
      .then((result) => {
        if (result.canceled) return;
        this.setState({
          downloadState: DownloadState.DOWNLOADING
        })

        const additionalMetadata: {[key: string]: string | number} = {}

        if (this.state.overwriteArtist.length !== 0) additionalMetadata.artist = this.state.overwriteArtist
        if (this.state.overwriteGenre.length !== 0) additionalMetadata.genre = this.state.overwriteGenre

        const downloadDirectory = result.filePaths[0];
        this.state.selectedAlbum.download({
          location: downloadDirectory,
          setStatus: this.setStatus,
          additionalMetadata: additionalMetadata
        })
          .then(() => {
            this.setState({
              downloadState: DownloadState.DOWNLOADED
            })
          })
          .catch(() => {
            this.setState({
              downloadState: DownloadState.ERROR
            })
          })
      })
  }
  handleArtistChange(event) {
    this.setState({
      overwriteArtist: event.target.value
    })
  }
  handleGenreChange(event) {
    this.setState({
      overwriteGenre: event.target.value
    })
  }
  render() {
    return <div>
      <button onClick={this.addTestPayload}>Create Test Payload</button>
      <div className={styles.container}>
        {
          this.state.downloadState !== DownloadState.READY ?
            <div>
              <h2>Operating Status</h2>
              <ul>
                {this.state.status.map((status, index) => <li key={index}>{status}</li>)}
              </ul>
              <button onClick={() => this.setState({ downloadState: DownloadState.READY })} disabled={this.state.downloadState === DownloadState.DOWNLOADING}>Back to Downloader</button>
            </div> :
            <div>
              <h2>Albums</h2>
              {this.state.albums.length === 0 && <p>There are no albums to select from.</p>}
              {this.state.albums.map((album, index) => <AlbumButton key={index} album={album} selected={this.state.selectedAlbum === album} onClick={() => { this.setState({ selectedAlbum: album }) }} />)}
            </div>
        }
        {
          this.state.selectedAlbum ?
            <div>
              <h1>{this.state.selectedAlbum.title}</h1>
              <h2>By {this.state.selectedAlbum.artist}</h2>
              <h3>Overwrite Fields</h3>
              <p>By entering text into these fields, you overwrite the specific field on every single song.</p>
              <div>
                <p>
                  Artist<br />
                  <small>If left empty, author of each song will be used. Recommended for an album made by many people.</small>
                </p>
                <input value={this.state.overwriteArtist} onChange={this.handleArtistChange} disabled={this.state.downloadState !== DownloadState.READY}></input>
              </div>
              <div>
                <p>
                  Genre<br />
                  <small>If left empty, the resulting MP3 will also have no genre.</small>
                </p>
                <input value={this.state.overwriteGenre} onChange={this.handleGenreChange} disabled={this.state.downloadState !== DownloadState.READY}></input>
              </div>
              <h3>Songs</h3>
              <button onClick={this.downloadDialog} disabled={this.state.downloadState !== DownloadState.READY}>Download</button>
              <table>
                <thead>
                  <tr>
                    <td>Picture</td>
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
                      .map((song) =>
                        <tr key={song.id}>
                          <td><img src={song.getSmallestAlbumCover().url} /></td>
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


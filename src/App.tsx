import React, { Component } from 'react';
import { Album } from './class/Album';
import { AlbumButton } from './components/AlbumButton';
import styles from './index.module.scss';
import { testPayloads } from './payloads';
import './scss/index.scss';
import { combineStyles } from './helpers/combineStyles';

enum DownloadState {
  READY, DOWNLOADING, DOWNLOADED, ERROR
}

class App extends Component<{}, { albums: Album[], selectedAlbum: Album, testPayloadButton: boolean, status: string[], downloadState: DownloadState, overwriteGenre: string, overwriteArtist: string }> {
  private youtubeWebView: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      selectedAlbum: null,
      testPayloadButton: false,
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
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.setYouTubeVisibility = this.setYouTubeVisibility.bind(this);
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
    this.setYouTubeVisibility(true);

    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.on('http-request', (e, data) => {
        this.addAlbumFromMutations(JSON.parse(data))
      })

      requestAnimationFrame(this.handleWindowResize)
    }

    if (window.location) {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('development') === 'true') {
        this.setState({
          testPayloadButton: true
        })
      }
    }
  }
  setYouTubeVisibility(visibility: boolean) {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('show-youtube', visibility)
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
          downloadState: DownloadState.DOWNLOADING,
          status: []
        })

        const additionalMetadata: { [key: string]: string | number } = {}

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
  handleWindowResize() {
    const youtubeView = window.require('electron').remote.getCurrentWindow().getBrowserView();

    if (youtubeView && this.youtubeWebView.current) {
      youtubeView.setBounds({
        x: this.youtubeWebView.current.offsetLeft,
        y: this.youtubeWebView.current.offsetTop,
        width: this.youtubeWebView.current.offsetWidth,
        height: this.youtubeWebView.current.offsetHeight
      })
    }

    requestAnimationFrame(this.handleWindowResize)
  }
  render() {
    return (
      <div className={styles.container}>
        {
          this.state.downloadState !== DownloadState.READY ?
            <div className={styles.column}>
              <h2>Download Status</h2>
              <ul>
                {this.state.status.map((status, index) => <li key={index}>{status}</li>)}
              </ul>
              <button onClick={() => this.setState({ downloadState: DownloadState.READY })} disabled={this.state.downloadState === DownloadState.DOWNLOADING}>Back to Downloader</button>
            </div> :
            <div className={styles.column}>
              <h2>Actions</h2>
              <button onClick={this.addTestPayload} className={!this.state.testPayloadButton && styles.hidden}>
                Inject test payload
              </button>
              <button onClick={this.downloadDialog} disabled={this.state.downloadState !== DownloadState.READY || this.state.selectedAlbum === null}>
                Download currently selected album
              </button>
              <h2>Viewer</h2>
              <AlbumButton title="YouTube Music" artist="Search for Albums" selected={this.state.selectedAlbum === null} onClick={() => { this.setState({ selectedAlbum: null }); this.setYouTubeVisibility(true) }} />
              <h2>Albums</h2>
              {this.state.albums.length === 0 && <p>There are no albums to select from.</p>}
              {this.state.albums.map((album, index) => <AlbumButton key={index} album={album} selected={this.state.selectedAlbum === album} onClick={() => { this.setState({ selectedAlbum: album }); this.setYouTubeVisibility(false) }} />)}
            </div>
        }
        {
          this.state.selectedAlbum ?
            <div className={combineStyles([styles.column, styles.selectedAlbumColumn])}>
              <h1>{this.state.selectedAlbum.title}</h1>
              <h2>By {this.state.selectedAlbum.artist}</h2>
              <h3>Optional Fields</h3>
              <p>These fields are not automatically filled out by the software (because YouTube does not provide them)</p>
              <div>
                <p>
                  Genre<br />
                  <small>Inserts the genre</small>
                </p>
                <input value={this.state.overwriteGenre} onChange={this.handleGenreChange} disabled={this.state.downloadState !== DownloadState.READY}></input>
              </div>
              <h3>Override Fields</h3>
              <p>By entering text into these fields, you override the specific field on every single song.</p>
              <div>
                <p>
                  Artist<br />
                  <small>Replaces artist for all songs in album. Not recommended for albums with varying artists.</small>
                </p>
                <input value={this.state.overwriteArtist} onChange={this.handleArtistChange} disabled={this.state.downloadState !== DownloadState.READY}></input>
              </div>
              <h3>Album</h3>
              <h4>Album Cover</h4>
              <img className={styles.albumCover} src={this.state.selectedAlbum.getLargestAlbumCover().url}></img>
              <h3>Songs</h3>
              <table className={styles.albumSongsTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Artist</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.selectedAlbum.songs
                      .sort((songA, songB) => songA.trackNumber - songB.trackNumber)
                      .map((song) =>
                        <tr key={song.id}>
                          <td>{song.trackNumber}</td>
                          <td>{song.title}</td>
                          <td>{song.artist}</td>
                        </tr>
                      )
                  }
                </tbody>
              </table>
            </div> :
            <div className={styles.column} ref={this.youtubeWebView}>
              <h1>YouTube should be here</h1>
              <p>
                Please wait for the Electon webview to overlay YouTube on top of this area.
                This should be done within seconds.<br />
                If this is not the case, please create an issue on GitHub.
              </p>
            </div>
        }
      </div>
    )
  }
}

export { App };


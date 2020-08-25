import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button } from 'react-uwp/Button';
import { ContentDialog } from 'react-uwp/ContentDialog';
import { DropDownMenu } from 'react-uwp/DropDownMenu';
import { ListView } from 'react-uwp/ListView';
import { TextBox } from 'react-uwp/TextBox';
import { AlbumInterface, Album } from '../../class/Album';
import { PageContainer } from '../../components/PageContainer';
import { RootStateInterface } from '../../components/ReduxProvider';
import { displayYouTube } from '../../helpers/displayYouTube';
import { defaultGenres } from '../../helpers/genres';
import { remote, ipcMain, ipcRenderer } from 'electron';

const PLEASE_SELECT = '';

const mapStateToProps = (state: RootStateInterface): { albums: { albums: AlbumInterface[] } } => {
  const { albums } = state;
  return { albums };
}
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

enum DOWNLOAD_STATUS {
  ready, downloading, downloaded
}

class AlbumsPage extends Component<PropsFromRedux, { selectedAlbum: AlbumInterface; overwriteArtist: string; overwriteAlbumTitle: string; genre: string; downloadStatus: DOWNLOAD_STATUS; downloadStatusText: string }> {
  private overwriteAlbumTitleRef = React.createRef<TextBox>();
  private overwriteArtistRef = React.createRef<TextBox>();

  constructor(props: PropsFromRedux) {
    super(props);

    this.handleArtistOverrideChange = this.handleArtistOverrideChange.bind(this);
    this.handleAlbumTitleOverrideChange = this.handleAlbumTitleOverrideChange.bind(this);
    this.handleGenreChange = this.handleGenreChange.bind(this);
    this.handleDownloadButton = this.handleDownloadButton.bind(this);
    this.handleDownloadMessage = this.handleDownloadMessage.bind(this);

    this.state = {
      selectedAlbum: null,
      overwriteArtist: '',
      overwriteAlbumTitle: '',
      genre: '',
      downloadStatus: DOWNLOAD_STATUS.ready,
      downloadStatusText: 'Downloading...',
    }
  }
  componentDidMount() {
    displayYouTube(false);
  }
  handleArtistOverrideChange(value: string) {
    this.setState({
      overwriteArtist: value
    })
  }
  handleAlbumTitleOverrideChange(value: string) {
    this.setState({
      overwriteAlbumTitle: value
    })
  }
  handleGenreChange(value: string) {
    this.setState({
      genre: value
    })
  }
  handleDownloadButton(): void {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    })
      .then((result) => {
        if (result.canceled) return;
        
        const downloadDirectory = result.filePaths[0];
        
        const additionalMetadata: { [key: string]: string | number } = {};
        if (this.state.overwriteAlbumTitle) additionalMetadata.album = this.state.overwriteAlbumTitle;
        if (this.state.overwriteArtist) additionalMetadata.artist = this.state.overwriteArtist;
        if (this.state.genre) additionalMetadata.genre = this.state.genre;

        this.setState({
          downloadStatus: DOWNLOAD_STATUS.downloading
        })
        
        ipcRenderer.send('download-album', downloadDirectory, additionalMetadata, this.state.selectedAlbum)
        ipcRenderer.on('set-status', this.handleDownloadMessage)
        ipcRenderer.once('downloaded-album', () => {
          this.setState({
            downloadStatusText: 'Complete!',
            downloadStatus: DOWNLOAD_STATUS.downloaded
          })

          ipcRenderer.removeListener('set-status', this.handleDownloadMessage)
        })
      })
  }
  handleDownloadMessage(e, text: string, number?: number): void {
    console.log(text, number)
    let statusText = text
    if (number) statusText += ` (${number} of ${this.state.selectedAlbum.songs.length})`
    this.setState({
      downloadStatusText: statusText
    })
  }
  render() {
    const { albums } = this.props.albums;
    const { selectedAlbum } = this.state

    let extraGenres = [] as string[];

    try {
      if (window.localStorage.getItem('genres')) {
        extraGenres = JSON.parse(window.localStorage.getItem('genres')) as string[]
      }
    } catch (e) {
      window.localStorage.setItem('genres', '[]')
    }

    return (
      <PageContainer>
        <h1>Discovered Albums</h1>
        {
          albums.length === 0 &&
          <p>
            There are no albums to view
          </p>
        }
        {
          albums.length > 0 &&
          <ListView
            listSource={
              albums.map((album, index) => <p key={index}>{album.title}<br />{album.artist}</p>)
            }
            onChooseItem={(index) => {
              const newAlbum = albums[index];

              const isBySingleArtist = newAlbum.songs.every(song => song.artist === newAlbum.songs[0].artist);
              const overwriteArtist = isBySingleArtist ? newAlbum.artist : '';

              this.setState({
                selectedAlbum: newAlbum,
                overwriteArtist,
              })
              this.overwriteAlbumTitleRef?.current?.setValue(newAlbum.title)
              this.overwriteArtistRef?.current?.setValue(overwriteArtist)
            }}
          />
        }
        <h2>Selected Album</h2>
        {selectedAlbum === null ?
          <p>There is no album selected</p> :
          <>
            <p>{selectedAlbum.title}</p>
            <p>{selectedAlbum.artist}</p>
            <h3>Actions</h3>
            <Button
              onClick={this.handleDownloadButton}
            >
              Download
            </Button>
            <h3>Metadata</h3>
            <p>
              Album Title
            </p>
            <TextBox
              placeholder="Album Title"
              defaultValue={selectedAlbum.title}
              onChangeValue={this.handleAlbumTitleOverrideChange}
              ref={this.overwriteAlbumTitleRef}
            />
            <p>
              Artist
            </p>
            <TextBox
              placeholder="(Use Artist from Each Song)"
              onChangeValue={this.handleArtistOverrideChange}
              ref={this.overwriteArtistRef}
            />
            <p>Genre</p>
            <DropDownMenu
              onChangeValue={this.handleGenreChange}
              values={[PLEASE_SELECT, ...extraGenres, ...[...defaultGenres].sort()]}
            />
            <h3>Songs</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Artist</th>
                </tr>
              </thead>
              <tbody>
                {
                  selectedAlbum.songs
                    .sort((songA, songB) => songA.trackNumber - songB.trackNumber)
                    .map((song) =>
                      <tr key={song.id}>
                        <td>{song.trackNumber}</td>
                        <td>{song.title}</td>
                        <td>{this.state.overwriteArtist || song.artist}</td>
                      </tr>
                    )
                }
              </tbody>
            </table>
          </>
        }

        <ContentDialog
          title="Downloading..."
          content={this.state.downloadStatusText}
          defaultShow={this.state.downloadStatus !== DOWNLOAD_STATUS.ready}
          primaryButtonText="Close"
          onCloseDialog={() => {
            if (this.state.downloadStatus === DOWNLOAD_STATUS.downloaded) this.setState({ downloadStatus: DOWNLOAD_STATUS.ready })
          }}
          secondaryButtonText={null}
        />
      </PageContainer>
    )
  }
}

const VisibleAlbumsPage = connector(AlbumsPage);
export { VisibleAlbumsPage as AlbumsPage };


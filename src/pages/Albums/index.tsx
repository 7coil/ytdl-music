import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ListView } from 'react-uwp/ListView';
import { PageContainer } from '../../components/PageContainer';
import { RootStateInterface } from '../../components/ReduxProvider';
import { displayYouTube } from '../../helpers/displayYouTube';

const mapStateToProps = (state: RootStateInterface) => {
  const { albums } = state;
  return { albums };
}
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

class AlbumsPage extends Component<PropsFromRedux> {
  componentDidMount() {
    displayYouTube(false);
  }
  render() {
    const { albums } = this.props.albums;
    return (
      <PageContainer>
        <h1>Discovered Albums</h1>
        {
          albums.length === 0 &&
          <p>
            There are no albums to view.
          </p>
        }
        {
          albums.length > 0 &&
          <ListView
            listSource={
              albums.map((album, index) => <p key={index}>{album.title}<br />{album.artist}</p>)
            }
          />
        }
      </PageContainer>
    )
  }
}

const VisibleAlbumsPage = connector(AlbumsPage);
export { VisibleAlbumsPage as AlbumsPage };


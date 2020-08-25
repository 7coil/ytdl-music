import React, { Component } from 'react';
import styles from './index.module.scss';
import { ConnectedProps, connect } from 'react-redux';
import { RootStateInterface } from '../ReduxProvider';
import { AlbumInterface } from 'src/mainWindow/class/Album';

const mapStateToProps = (state: RootStateInterface): { albums: { albums: AlbumInterface[] } } => {
  const { albums } = state;
  return { albums };
}
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

class Footer extends Component<PropsFromRedux> {
  render() {
    const { albums } = this.props.albums;

    return (
      <div className={styles.footerContainer}>
        <span>Discovered {albums.length} album{albums.length !== 1 && 's'}.</span>
      </div>
    )
  }
}

const VisibleFooter = connector(Footer);
export { VisibleFooter as Footer }

import React, { Component } from 'react';
import styles from './index.module.scss';

class AlbumButton extends Component {
  render() {
    return (
      <div className={`${styles.button} ${this.props.selected ? styles.selected: ''}`} {...this.props}>
        <span className={styles.title}>{this.props.title}</span>
        <span className={styles.artist}>{this.props.artist}</span>
      </div>
    )
  }
}

export {
  AlbumButton
}

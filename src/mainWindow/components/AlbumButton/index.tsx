import React, { Component } from "react";
import { AlbumInterface } from "../../class/Album";
import styles from "./index.module.scss";

class AlbumButton extends Component<{
  album?: AlbumInterface;
  title?: string;
  artist?: string;
  selected?: boolean;
  [key: string]: any;
}> {
  render() {
    return (
      <div
        className={`${styles.button} ${
          this.props.selected ? styles.selected : ""
        }`}
        {...this.props}
      >
        <span className={styles.title}>
          {this.props.title || this.props.album.title}
        </span>
        <span className={styles.artist}>
          {this.props.artist || this.props.album.artist}
        </span>
      </div>
    );
  }
}

export { AlbumButton };

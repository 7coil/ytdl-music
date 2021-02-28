import React, { Component } from "react";
import styles from "./index.module.scss";
import IconButton from "react-uwp/IconButton";
import { combineStyles } from "../../helpers/combineStyles";
import { remote } from "electron";

class TitleBar extends Component<{}, { maximised: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      maximised: remote.getCurrentWindow().isMaximized(),
    };
    this.onMaximise = this.onMaximise.bind(this);
    this.onRestore = this.onRestore.bind(this);
  }
  componentDidMount() {
    remote.getCurrentWindow().addListener("maximize", this.onMaximise);
    remote.getCurrentWindow().addListener("unmaximize", this.onRestore);
  }
  componentWillUnmount() {
    remote.getCurrentWindow().removeListener("maximize", this.onMaximise);
    remote.getCurrentWindow().removeListener("unmaximize", this.onRestore);
  }
  onMaximise() {
    this.setState({
      maximised: true,
    });
  }
  onRestore() {
    this.setState({
      maximised: false,
    });
  }
  render() {
    return (
      <div className={styles.titleBarContainer}>
        <div className={styles.titleBarDragRegion}>
          <span>ytdl-music</span>
        </div>
        <IconButton
          className={combineStyles([
            styles.titleBarMinimise,
            styles.titleBarButton,
          ])}
          size={32}
          onClick={() => remote.getCurrentWindow().minimize()}
        >
          {"\uE921"}
        </IconButton>
        {this.state.maximised ? (
          <IconButton
            className={combineStyles([
              styles.titleBarRestore,
              styles.titleBarButton,
            ])}
            size={32}
            onClick={() => remote.getCurrentWindow().restore()}
          >
            {"\uE923"}
          </IconButton>
        ) : (
          <IconButton
            className={combineStyles([
              styles.titleBarMaximise,
              styles.titleBarButton,
            ])}
            size={32}
            onClick={() => remote.getCurrentWindow().maximize()}
          >
            {"\uE922"}
          </IconButton>
        )}
        <IconButton
          className={combineStyles([
            styles.titleBarClose,
            styles.titleBarButton,
          ])}
          size={32}
          onClick={() => remote.getCurrentWindow().close()}
        >
          {"\uE8BB"}
        </IconButton>
      </div>
    );
  }
}

export { TitleBar };

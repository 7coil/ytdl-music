import React, { Component } from 'react';
import styles from './index.module.scss';
import { displayYouTube } from '../../helpers/displayYouTube';
import { ProgressCircle } from 'react-desktop/windows';
import { remote } from 'electron';

class YouTubePage extends Component {
  private youtubeWebView: React.RefObject<HTMLDivElement> = React.createRef();
  private currentFrame = 0;

  constructor(props) {
    super(props)

    this.handleWindowResize = this.handleWindowResize.bind(this);
  }
  componentDidMount() {
    displayYouTube(true);
    this.currentFrame = requestAnimationFrame(this.handleWindowResize);
  }
  componentWillUnmount() {
    displayYouTube(false);
    cancelAnimationFrame(this.currentFrame);
  }
  handleWindowResize() {
    const youtubeView = remote.getCurrentWindow().getBrowserView();

    if (youtubeView && this.youtubeWebView.current) {
      const rect = this.youtubeWebView.current.getBoundingClientRect();

      youtubeView.setBounds({
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      })

      this.currentFrame = requestAnimationFrame(this.handleWindowResize);
    }
  }
  render() {
    return (
      <div ref={this.youtubeWebView} className={styles.youtube}>
        <ProgressCircle size={100} />
      </div>
    )
  }
}

export { YouTubePage }

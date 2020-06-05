import React, { Component } from 'react';
import styles from './index.module.scss';
import { displayYouTube } from '../../helpers/displayYouTube';
import { ProgressCircle } from 'react-desktop/windows';

class YouTubePage extends Component {
  private youtubeWebView: React.RefObject<HTMLDivElement> = React.createRef();
  private currentFrame: number = 0;

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
    if (typeof window.require === 'undefined') return;

    const youtubeView = window.require('electron').remote.getCurrentWindow().getBrowserView();

    if (youtubeView && this.youtubeWebView.current) {
      youtubeView.setBounds({
        x: this.youtubeWebView.current.offsetLeft,
        y: this.youtubeWebView.current.offsetTop,
        width: this.youtubeWebView.current.offsetWidth,
        height: this.youtubeWebView.current.offsetHeight
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

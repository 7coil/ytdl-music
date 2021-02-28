import React, { Component } from "react";
import { displayYouTube } from "../../helpers/displayYouTube";
import { PageContainer } from "../../components/PageContainer";

class LandingPage extends Component {
  componentDidMount() {
    displayYouTube(false);
  }
  render() {
    return (
      <PageContainer>
        <h1>Welcome to ytdl-music!</h1>
        <p>
          To get started, browse to an album page in the "YouTube Music" tab.
        </p>
        <p>
          You can then open the "Albums" tab and select an album to download.
        </p>
      </PageContainer>
    );
  }
}

export { LandingPage };

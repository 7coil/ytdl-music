import React, { Component } from "react";
import { displayYouTube } from "../../helpers/displayYouTube";
import { PageContainer } from "../../components/PageContainer";
import { Icon } from "react-uwp";

class LandingPage extends Component {
  componentDidMount() {
    displayYouTube(false);
  }
  render() {
    return (
      <PageContainer>
        <h1>Welcome to ytdl-music!</h1>
        <p>
          To get started, browse to an album page in the YouTube Music (<Icon>PlayLegacy</Icon>) tab.
        </p>
        <p>
          When the album counter in the footer increases, use the Albums (<Icon>BulletedList</Icon>) tab and select an album to download.
        </p>
      </PageContainer>
    );
  }
}

export { LandingPage };

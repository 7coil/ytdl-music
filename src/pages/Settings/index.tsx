import { readFileSync } from 'fs';
import React, { Component } from 'react';
import { PageContainer } from '../../components/PageContainer';
import { displayYouTube } from '../../helpers/displayYouTube';
import styles from './index.module.scss';

const licenceText = readFileSync('LICENCE', 'utf-8')

class SettingsPage extends Component {
  componentDidMount() {
    displayYouTube(false);
  }
  render() {
    const licence = licenceText
      .split('\n\n')
      .map((text, index) => <p key={index} className={styles.licence}>{text}</p>)

    return (
      <PageContainer>
        <h1>Settings</h1>
        <h2>Licence</h2>
        {licence}
      </PageContainer>
    )
  }
}

export { SettingsPage };


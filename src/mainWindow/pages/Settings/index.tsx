import { readFileSync } from 'fs';
import React, { Component, ReactElement } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Button } from 'react-uwp/Button';
import { TextBox } from 'react-uwp/TextBox';
import { Album } from '../../class/Album';
import { PageContainer } from '../../components/PageContainer';
import { insertAlbum } from '../../components/ReduxProvider/actions/album';
import { displayYouTube } from '../../helpers/displayYouTube';
import { testPayloads } from '../../payloads';
import styles from './index.module.scss';

const licenceText = readFileSync('LICENCE', 'utf-8')

class SettingsPage extends Component<DispatchProp> {
  constructor(props: DispatchProp) {
    super(props);
    this.injectExamplePayload = this.injectExamplePayload.bind(this);
  }
  injectExamplePayload(): void {
    const { dispatch } = this.props;
    testPayloads
      .map(mutation => Album.createFromMutations(mutation))
      .map(album => dispatch(insertAlbum(album)))
  }
  handleEditExtraGenres(string: string): void {
    localStorage.setItem('genres', JSON.stringify(
      string
        .split(',')
        .filter(genre => genre.length !== 0)
    ))
  }
  getExtraGenres(): string {
    try {
      const text = localStorage.getItem('genres')
      return JSON.parse(text).join(',')
    } catch {
      return '';
    }
  }
  componentDidMount(): void {
    displayYouTube(false);
  }
  render(): ReactElement {
    const licence = licenceText
      .split('\n\n')
      .map((text, index) => <p key={index} className={styles.licence}>{text}</p>)

    return (
      <PageContainer>
        <h1>Settings</h1>
        <h2>Custom Genres</h2>
        <p>
          Add a comma separated list of genres.
          Genres can then be applied to albums when downloading.
        </p>
        <TextBox
          defaultValue={this.getExtraGenres()}
          onChangeValue={this.handleEditExtraGenres}
        />
        <h2>Developer Actions</h2>
        <Button onClick={this.injectExamplePayload}>Insert Example Payload</Button>
        <h2>Licence</h2>
        <pre>{licence}</pre>
      </PageContainer>
    )
  }
}

const VisibleSettingsPage = connect()(SettingsPage);
export { VisibleSettingsPage as SettingsPage };


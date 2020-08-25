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

class SettingsPage extends Component<DispatchProp> {
  constructor(props: DispatchProp) {
    super(props);
    this.injectExamplePayload = this.injectExamplePayload.bind(this);
  }
  injectExamplePayload(): void {
    const { dispatch } = this.props
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
        <pre>
{`
MIT License

Copyright (c) 2020 Leondro Lio <github@leondrolio.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`}
        </pre>
      </PageContainer>
    )
  }
}

const VisibleSettingsPage = connect()(SettingsPage);
export { VisibleSettingsPage as SettingsPage };


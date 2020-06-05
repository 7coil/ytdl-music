import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import NavigationView from 'react-uwp/NavigationView';
import { getTheme, Theme as UWPThemeProvider } from 'react-uwp/Theme';
import { Album } from './class/Album';
import { insertAlbum } from './components/ReduxProvider/actions/album';
import { SplitViewCommandLink } from './components/SplitViewCommandLink';
import { AlbumsPage } from './pages/Albums';
import { LandingPage } from './pages/Landing';
import { NotFoundPage } from './pages/NotFound';
import { SettingsPage } from './pages/Settings';
import { YouTubePage } from './pages/YouTube';

class App extends Component<DispatchProp, { page: string }> {
  constructor(props) {
    super(props);

    this.state = {
      page: null
    }
  }
  componentDidMount() {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      const { dispatch } = this.props
      ipcRenderer.on('http-request', (e, data) => {
        try {
          const album = Album.createFromMutations(JSON.parse(data))
          dispatch(insertAlbum(album))
        } catch(e) {
          console.log(e)
        }
      })
    }
  }
  render() {
    const topNodes = [
      <SplitViewCommandLink to="/" label="Landing" icon={"\uE80F"} />,
      <SplitViewCommandLink to="/youtube" label="YouTube Music" icon={"\uE721"} />,
      <SplitViewCommandLink to="/albums" label="Discovered Albums" icon={"\uE90B"} />,
    ]

    const bottomNodes = [
      <SplitViewCommandLink to="/settings" label="Settings" icon={"\uE713"} />,
    ]

    return (
      <HashRouter>
        <UWPThemeProvider
          theme={getTheme({
            themeName: 'dark',
            useFluentDesign: false
          })}
        >
          <NavigationView
            pageTitle="ytdl-music"
            focusNavigationNodeIndex={0}
            navigationTopNodes={topNodes}
            navigationBottomNodes={bottomNodes}
            displayMode="compact"
            autoResize={false}
            style={{height: '100vh'}}
          >
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route exact path="/youtube" component={YouTubePage} />
              <Route exact path="/albums" component={AlbumsPage} />
              <Route exact path="/settings" component={SettingsPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </NavigationView>
        </UWPThemeProvider>
      </HashRouter>
    )
  }
}

const VisibleApp = connect()(App);
export { VisibleApp as App };


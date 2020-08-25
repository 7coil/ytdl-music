import React, { Component, ReactElement } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { IconButton } from 'react-uwp/IconButton';
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
import { Footer } from './components/Footer';
import styles from './index.module.scss';
import { TitleBar } from './components/TitleBar';

class App extends Component<DispatchProp, { page: string }> {
  navigationView = React.createRef<NavigationView>();

  constructor(props: DispatchProp) {
    super(props);

    this.state = {
      page: null
    }

  }
  componentDidMount(): void {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      const { dispatch } = this.props
      ipcRenderer.on('http-request', (e, data) => {
        try {
          const album = Album.createFromMutations(JSON.parse(data))
          if (album) dispatch(insertAlbum(album))
        } catch(e) {
          console.log(e)
        }
      })

      ipcRenderer.on('youtube-clicked', () => {
        // TODO: Remove when `react-uwp` has been updated
        if (this.navigationView.current.state.expanded) {
          this.navigationView.current.toggleExpanded(false)
        }
      })
    }
  }
  render(): ReactElement {
    const topIcon = (
      <IconButton>
        {'\uE700'}
      </IconButton>
    )

    const topNodes = [
      <SplitViewCommandLink key="/" to="/" label="Landing" icon={'\uE80F'} />,
      <SplitViewCommandLink key="/youtube" to="/youtube" label="YouTube Music" icon={'\uE768'} />,
      <SplitViewCommandLink key="/albums" to="/albums" label="Discovered Albums" icon={'\uE8FD'} />,
    ]

    const bottomNodes = [
      <SplitViewCommandLink key="/settings" to="/settings" label="Settings" icon={'\uE713'} />,
    ]

    const theme = getTheme({
      themeName: 'dark',
      useFluentDesign: false,
    })

    return (
      <HashRouter>
        <UWPThemeProvider
          theme={theme}
        >
          <div className={styles.page}>
            <TitleBar />
            <NavigationView
              focusNavigationNodeIndex={0}
              topIcon={topIcon}
              navigationTopNodes={topNodes}
              navigationBottomNodes={bottomNodes}
              displayMode="compact"
              autoResize={false}
              className={styles.navigationViewRoot}
              ref={this.navigationView}
            >
              <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/youtube" component={YouTubePage} />
                <Route exact path="/albums" component={AlbumsPage} />
                <Route exact path="/settings" component={SettingsPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </NavigationView>
            <Footer />
          </div>
        </UWPThemeProvider>
      </HashRouter>
    )
  }
}

const VisibleApp = connect()(App);
export { VisibleApp as App };


import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import NavigationView from 'react-uwp/NavigationView';
// import styles from './index.module.scss';
import { getTheme, Theme as UWPThemeProvider } from 'react-uwp/Theme';
import { SplitViewCommandLink } from './components/SplitViewCommandLink';
import { LandingPage } from './pages/Landing';
import { NotFoundPage } from './pages/NotFound';
import { YouTubePage } from './pages/YouTube';
import { AlbumsPage } from './pages/Albums';
import { SettingsPage } from './pages/Settings';
import { ReduxProvider } from './components/ReduxProvider';

class App extends Component<{}, { page: string }> {
  constructor(props) {
    super(props);

    this.state = {
      page: null
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
      <ReduxProvider>
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
      </ReduxProvider>
    )
  }
}

export { App };


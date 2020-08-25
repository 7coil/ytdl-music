import { app, BrowserWindow, BrowserView, ipcMain } from 'electron';
import { AlbumInterface, Album } from './mainWindow/class/Album';
import electronSquirrelStartup from 'electron-squirrel-startup';

declare const YOUTUBE_MUSIC_PRELOAD_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

const createWindow = () => {
  // Create the browser window.
  const youtubeMusic = new BrowserView({
    webPreferences: {
      nodeIntegration: true,
      preload: YOUTUBE_MUSIC_PRELOAD_WEBPACK_ENTRY,
    },
  });

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  youtubeMusic.webContents.loadURL('https://music.youtube.com/');
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  ipcMain.on('http-request', (e, data) => {
    mainWindow.webContents.send('http-request', data)
  });

  ipcMain.on('show-youtube', (e, show) => {
    if (show) {
      mainWindow.addBrowserView(youtubeMusic);
    } else {
      mainWindow.removeBrowserView(youtubeMusic);
    }
  });

  ipcMain.on('youtube-clicked', () => {
    mainWindow.webContents.send('youtube-clicked');
  });

  ipcMain.on('download-album', (e, location: string, additionalMetadata: { [key: string]: string | number }, album: AlbumInterface) => {
    const realAlbum = new Album(album);

    realAlbum.download({
      location,
      additionalMetadata,
      setStatus: (str, index) => mainWindow.webContents.send('set-status', str, index)
    })
      .then(() => {
        mainWindow.webContents.send('downloaded-album')
      })
  })
}

if (electronSquirrelStartup) {
  app.quit();
} else {
  app.whenReady().then(createWindow)
}

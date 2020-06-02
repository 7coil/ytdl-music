const { app, BrowserWindow, BrowserView, ipcMain } = require('electron')
const path = require('path');

const createWindow = () => {
  // Create the browser window.
  let youtubeView = new BrowserView({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  let ytdlMusicWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  ytdlMusicWindow.addBrowserView(youtubeView);

  // and load the index.html of the app.
  youtubeView.webContents.loadURL('https://music.youtube.com/')

  if (process.env.NODE_ENV === 'development') {
    ytdlMusicWindow.loadURL('http://127.0.0.1:1234?development=true')
  } else {
    ytdlMusicWindow.loadFile('dist/index.html')
  }

  ipcMain.on('http-request', (e, data) => {
    ytdlMusicWindow.webContents.send('http-request', data)
  })

  ipcMain.on('show-youtube', (e, show) => {
    if (show) {
      ytdlMusicWindow.addBrowserView(youtubeView);
    } else {
      ytdlMusicWindow.removeBrowserView(youtubeView);
    }
  })
}

app.whenReady().then(createWindow)

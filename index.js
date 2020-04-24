const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');

const createWindow = () => {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  let page = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadURL('https://music.youtube.com/')
  page.loadFile('src/index.html')

  ipcMain.on('http-request', (e, data) => {
    page.webContents.send('http-request', data)
  })
}

app.whenReady().then(createWindow)

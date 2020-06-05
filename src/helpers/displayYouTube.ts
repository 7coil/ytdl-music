const displayYouTube = (visibility: boolean): void => {
  if (window.require) {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.send('show-youtube', visibility)
  }
}

export { displayYouTube }

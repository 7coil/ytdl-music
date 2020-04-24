(() => {
  // https://medium.com/@gilfink/quick-tip-creating-an-xmlhttprequest-interceptor-1da23cf90b76
  const { ipcRenderer } = require('electron');
  let XMLHttpRequestTemp = window.XMLHttpRequest.prototype.open;

  window.XMLHttpRequest.prototype.open = function(method, url) {
    if (url.startsWith('/youtubei/v1/browse')) {
      this.addEventListener('load', function() {
        // console.log('url: ' + url, 'load: ' + this.responseText);
        ipcRenderer.send('http-request', this.responseText)
      });
    }

    return XMLHttpRequestTemp.apply(this, arguments);
  }

  delete XMLHttpRequestTemp
})()

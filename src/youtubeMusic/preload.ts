// https://medium.com/@gilfink/quick-tip-creating-an-xmlhttprequest-interceptor-1da23cf90b76
import { ipcRenderer } from "electron";

console.log("hello world!");

(() => {
  const XMLHttpRequestTemp = window.XMLHttpRequest.prototype.open;

  window.XMLHttpRequest.prototype.open = function (method, url) {
    if (url.startsWith("/youtubei/v1/browse")) {
      this.addEventListener("load", function () {
        ipcRenderer.send("http-request", this.responseText);
      });
    }

    return XMLHttpRequestTemp.apply(this, arguments);
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", () => {
      ipcRenderer.send("youtube-clicked");
    });
  });
})();

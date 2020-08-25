const fs = require('fs')
const path = require('path')

module.exports = {
  "packagerConfig": {
    afterExtract: [
      (extractPath, electronVersion, platform, arch, done) => {
        fs.copyFileSync(
          path.resolve(require.resolve('ffmpeg-static'), '..', 'ffmpeg.exe'),
          path.resolve(extractPath, 'resources', 'ffmpeg.exe')
        )
        done()
      }
    ]
  },
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "ytdl_music"
      }
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin"
      ]
    },
    {
      "name": "@electron-forge/maker-deb",
      "config": {}
    },
    {
      "name": "@electron-forge/maker-rpm",
      "config": {}
    }
  ],
  "plugins": [
    [
      "@electron-forge/plugin-webpack",
      {
        "mainConfig": "./webpack.main.config.js",
        "renderer": {
          "config": "./webpack.renderer.config.js",
          "entryPoints": [
            {
              "html": "./src/mainWindow/index.html",
              "js": "./src/mainWindow/renderer.tsx",
              "name": "main_window"
            },
            {
              "js": "./src/youtubeMusic/renderer.tsx",
              "preload": {
                "js": "./src/youtubeMusic/preload.ts"
              },
              "name": "youtube_music"
            }
          ]
        }
      }
    ]
  ]
}

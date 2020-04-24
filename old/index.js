const { ipcRenderer, remote } = require('electron');
const sanitiseFilename = require('sanitize-filename');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const childProcess = require('child_process');

const testButton = document.getElementById('test-button');
const sidebar = document.getElementById('sidebar');
const sidebarButtonTemplate = document.getElementById('sidebar-button-template');
const welcome = document.getElementById('welcome');
const editor = document.getElementById('editor');
const selectedAlbumCover = document.getElementById('selected-album-cover');
const selectedAlbumTitle = document.getElementById('selected-album-title');
const selectedAlbumArtist = document.getElementById('selected-album-artist');
const downloadButton = document.getElementById('download-button');
const genreField = document.getElementById('genre-field');
const artistField = document.getElementById('artist-field');
const downloadStatus = document.getElementById('download-status');

const zeroPad = (num, places) => String(num).padStart(places, '0')

const checkDataForMutations = (data) => {
  return data && data.frameworkUpdates && data.frameworkUpdates.entityBatchUpdate && data.frameworkUpdates.entityBatchUpdate.mutations
}

const getAlbumsFromData = (data) => {
  const mutations = data.frameworkUpdates.entityBatchUpdate.mutations;
  return mutations.filter(mutation => mutation.payload.musicAlbumRelease).map(mutation => mutation.payload.musicAlbumRelease)
}

const getSongsFromData = (data) => {
  const mutations = data.frameworkUpdates.entityBatchUpdate.mutations;
  return mutations.filter(mutation => mutation.payload.musicTrack).map(mutation => mutation.payload.musicTrack)
}

const checkDataForAlbum = (data) => {
  return getAlbumsFromData(data).length === 1 && getSongsFromData.length > 0
}

const getReleaseDateFromAlbum = (album) => {
  return `${zeroPad(album.releaseDate.year, 4)}-${zeroPad(album.releaseDate.month, 2)}-${zeroPad(album.releaseDate.day, 2)}`
}

const selectData = (data) => {
  welcome.classList.add('hidden');
  editor.classList.remove('hidden');

  const album = getAlbumsFromData(data)[0];
  const songs = getSongsFromData(data);
  const albumCover = songs[0].thumbnailDetails.thumbnails[songs[0].thumbnailDetails.thumbnails.length - 1].url

  selectedAlbumCover.setAttribute('src', albumCover)
  selectedAlbumTitle.innerText = album.title
  selectedAlbumArtist.innerText = album.artistDisplayName
  downloadButton.dataset.info = JSON.stringify(data)

  console.log(album, songs);
}

const addData = (textData) => {
  let payload = textData;

  if (typeof payload === 'string') payload = JSON.parse(payload);

  if (checkDataForMutations(payload) && checkDataForAlbum(payload)) {
    const sidebarButton = sidebarButtonTemplate.content.cloneNode(true);

    const album = getAlbumsFromData(payload)[0];

    const titleField = sidebarButton.getElementById('title');
    const artistField = sidebarButton.getElementById('artist');
    const button = sidebarButton.getElementById('button');

    titleField.innerText = album.title;
    artistField.innerText = album.artistDisplayName;
    button.dataset.info = JSON.stringify(payload);

    sidebar.appendChild(sidebarButton);
  }
}

ipcRenderer.on('http-request', (e, data) => {
  addData(data)
})

testButton.addEventListener('click', () => {
  fetch('test-payload.json')
    .then(res => res.text())
    .then(data => addData(data))
})

sidebar.addEventListener('click', (e) => {
  for (let i = 0; i < e.path.length; i += 1) {
    const currentElement = e.path[i]
    if (currentElement.classList && currentElement.classList.contains('sidebar-button')) {
      selectData(JSON.parse(currentElement.dataset.info))
      break
    }
  }
})

downloadButton.addEventListener('click', (e) => {
  const dialog = remote.require('electron').dialog
  dialog.showOpenDialog({
    properties: ['openDirectory']
  })
    .then((downloadLocationInfo) => {
      // Electron has this spelling error on purpose for legacy reasons.
      if (downloadLocationInfo.canceled) return;
      const downloadDirectory = downloadLocationInfo.filePaths[0];

      const data = JSON.parse(downloadButton.dataset.info);
      const album = getAlbumsFromData(data)[0];
      const songs = getSongsFromData(data);

      const albumCover = songs[0].thumbnailDetails.thumbnails[songs[0].thumbnailDetails.thumbnails.length - 1].url

      const additionalMetadata = {};
      if (genreField.value) additionalMetadata.genre = genreField.value
      if (artistField.value) additionalMetadata.artistField = artistField.value

      const downloadSong = (index) => {
        const song = songs[index];
        
        const [, musicVideoID, audioID] = /([a-zA-Z0-9_-]{11})\|([a-zA-Z0-9_-]{11})/.exec(atob(decodeURIComponent(song.audioModeVersion)))
        const songInformation = {
          artist: song.artistNames.replace(', ', '/'),
          track: song.albumTrackIndex,
          title: song.title,
          mv: musicVideoID,
          audioID: audioID,
          release: getReleaseDateFromAlbum(album),
          album: album.title,
          image: albumCover
        }
        const metadata = Object.assign({}, {
          title: songInformation.title,
          album: songInformation.album,
          track: songInformation.track,
          artist: songInformation.artist,
          date: songInformation.release
        }, additionalMetadata)

        const oggFileName = path.join(downloadDirectory, `${sanitiseFilename(songInformation.title)}.ogg`)
        const mp3FileName = path.join(downloadDirectory, `${sanitiseFilename(songInformation.title)}.mp3`)

        const convertSong = () => {
          const out = childProcess.spawnSync(ffmpegPath, [
            '-i', oggFileName,
            '-id3v2_version', '3',
            ...Object.entries(metadata).map(([key, value]) => ['-metadata', `${key}=${value}`]).flat(),
            mp3FileName,
          ], {
            windowsVerbatimArguments: false,
            encoding: 'UTF-8'
          })
          console.log(out)
        }

        const youtube = ytdl(audioID, { quality: 'highestaudio' })
        let bytes = 0;
        youtube.pipe(fs.createWriteStream(oggFileName))
        youtube.on('error', (e) => {
          console.log(e)
          downloadStatus.innerText = `An error occured!\n${e.stack}`
        })
        youtube.on('data', (chunk) => {
          bytes += chunk.length;
          downloadStatus.innerText = `Downloaded ${Math.floor(bytes / 1024)}KB of ${songInformation.title}`
        })
        youtube.on('end', () => {
          const nextSongIndex = index + 1;
          convertSong()
          if (songs.length !== nextSongIndex) downloadSong(nextSongIndex)
        })
      }

      downloadSong(0)

      console.log(songs);
    })
})

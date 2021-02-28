const checkDataForMutations = (data) => {
  return (
    data &&
    data.frameworkUpdates &&
    data.frameworkUpdates.entityBatchUpdate &&
    data.frameworkUpdates.entityBatchUpdate.mutations
  );
};

const getAlbumsFromData = (data) => {
  const mutations = data.frameworkUpdates.entityBatchUpdate.mutations;
  return mutations
    .filter((mutation) => mutation.payload.musicAlbumRelease)
    .map((mutation) => mutation.payload.musicAlbumRelease);
};

const getSongsFromData = (data) => {
  const mutations = data.frameworkUpdates.entityBatchUpdate.mutations;
  return mutations
    .filter((mutation) => mutation.payload.musicTrack)
    .map((mutation) => mutation.payload.musicTrack);
};

const checkDataForAlbum = (data) => {
  return (
    getAlbumsFromData(data).length === 1 && getSongsFromData(data).length > 0
  );
};

export {
  checkDataForAlbum,
  checkDataForMutations,
  getAlbumsFromData,
  getSongsFromData,
};

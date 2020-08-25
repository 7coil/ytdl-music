interface AlbumCoverInterface {
  url: string;
  width: number;
  height: number;
}

class AlbumCover implements AlbumCoverInterface {
  url: string
  width: number
  height: number

  constructor({
    url,
    width,
    height
  }: AlbumCoverInterface) {
    this.url = url;
    this.width = width;
    this.height = height;
  }

  getPixelCount() {
    return this.width * this.height;
  }
}

export {
  AlbumCover,
  AlbumCoverInterface
}

class AlbumCover {
  url: string
  width: number
  height: number

  constructor({
    url,
    width,
    height
  }: {
    url: string,
    width: number,
    height: number
  }) {
    this.url = url;
    this.width = width;
    this.height = height;
  }

  getPixelCount() {
    return this.width * this.height;
  }
}

export {
  AlbumCover
}

declare module "browser-id3-writer" {
  export default class ID3Writer {
    constructor(arrayBuffer: ArrayBuffer)
    setFrame(frameName: string, frameValue: string | string[]): this
    addTag(): void
    arrayBuffer: ArrayBuffer
  }
}


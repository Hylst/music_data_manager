import * as musicMetadata from "music-metadata-browser"

export interface ID3Tags {
  title: string
  artist: string
  album: string
  year: string
  genre: string
  comment: string
  duration?: number
}

export async function readID3Tags(file: File): Promise<ID3Tags> {
  try {
    const metadata = await musicMetadata.parseBlob(file)
    const common = metadata.common

    return {
      title: common.title || file.name.replace(/\.[^/.]+$/, ""),
      artist: common.artist || "Unknown Artist",
      album: common.album || "Unknown Album",
      year: common.year?.toString() || "",
      genre: common.genre?.join(", ") || "",
      comment: common.comment?.join(", ") || "",
      duration: metadata.format.duration,
    }
  } catch (error) {
    console.warn("Error reading metadata:", error)
    return {
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Unknown Artist",
      album: "Unknown Album",
      year: "",
      genre: "",
      comment: "",
    }
  }
}

export async function writeID3Tags(file: File, tags: ID3Tags): Promise<File> {
  // Note: This is a placeholder function. In a browser environment,
  // we can't directly modify files. In a real application, this would
  // need to be handled server-side or using a more complex solution.
  console.log("Writing tags:", tags, "to file:", file.name)
  return file
}


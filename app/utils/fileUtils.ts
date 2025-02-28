import * as musicMetadata from "music-metadata-browser"

export interface ProcessResult {
  success: boolean
  message?: string
}

export interface ID3Tags {
  title: string
  artist: string
  album: string
  year: string
  genre: string
  comment: string
}

export async function processFile(file: File, cleanedName: string, keywords: string[]): Promise<ProcessResult> {
  try {
    // Simuler un traitement de fichier
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: `Traitement réussi pour ${cleanedName}`,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
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

export async function writeID3Tags(file: File, tags: ID3Tags): Promise<boolean> {
  // Note: Browser APIs don't allow direct writing of ID3 tags
  // This would need to be handled by a server-side implementation
  console.log("Writing tags:", tags, "to file:", file.name)
  return true
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"]
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}


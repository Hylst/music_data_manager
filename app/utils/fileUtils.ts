import * as musicMetadata from "music-metadata-browser"
import * as ID3Writer from "browser-id3-writer"

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

export async function processFile(
  file: File,
  cleanedName: string,
  apiKeys: Record<string, string>,
): Promise<ProcessResult> {
  try {
    // Simuler un traitement de fichier avec l'utilisation des clés API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Ici, vous pouvez ajouter la logique pour utiliser les clés API pour générer l'image
    console.log("Traitement du fichier avec les clés API:", apiKeys)

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

export async function associateImageWithMP3(file: File, imageUrl: string): Promise<File> {
  try {
    // Télécharger l'image
    const imageResponse = await fetch(imageUrl)
    const imageBlob = await imageResponse.blob()
    const imageBuffer = await imageBlob.arrayBuffer()

    // Lire les métadonnées existantes
    const metadata = await musicMetadata.parseBlob(file)

    // Créer un nouveau fichier avec les métadonnées mises à jour
    const writer = new ID3Writer.Writer(await file.arrayBuffer())
    writer
      .setFrame("TIT2", metadata.common.title || "")
      .setFrame("TPE1", [metadata.common.artist || ""])
      .setFrame("TALB", metadata.common.album || "")
      .setFrame("TYER", metadata.common.year ? metadata.common.year.toString() : "")
      .setFrame("APIC", {
        type: 3,
        data: imageBuffer,
        description: "Cover",
        mimeType: imageBlob.type,
      })

    writer.addTag()

    const taggedArrayBuffer = writer.arrayBuffer
    const newFile = new File([taggedArrayBuffer], file.name, { type: file.type })

    return newFile
  } catch (error) {
    console.error("Erreur lors de l'association de l'image au fichier MP3:", error)
    throw error
  }
}

export function downloadFile(file: File) {
  const blob = new Blob([file], { type: file.type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}


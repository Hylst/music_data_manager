import JSZip from "jszip"

export async function extractCoverArt(file: File): Promise<{ blob: Blob | null; format: string | null }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer
        const view = new DataView(buffer)
        let offset = 0

        // Function to safely check if we can read bytes at current offset
        const canReadBytes = (numBytes: number) => offset + numBytes <= view.byteLength

        // Function to safely read uint32 with boundary check
        const safeReadUint32 = (pos: number): number | null => {
          if (pos + 4 <= view.byteLength) {
            return view.getUint32(pos)
          }
          return null
        }

        // Function to safely read uint16 with boundary check
        const safeReadUint16 = (pos: number): number | null => {
          if (pos + 2 <= view.byteLength) {
            return view.getUint16(pos)
          }
          return null
        }

        // Check for ID3v2 tag
        if (canReadBytes(10) && view.getUint32(0) === 0x49443303) {
          // "ID3"
          const id3v2Size = view.getUint32(6) & 0x7fffffff
          if (canReadBytes(10 + id3v2Size)) {
            offset = 10 + id3v2Size
          }
        }

        // Search for APIC frame in ID3v2 tag
        while (canReadBytes(10)) {
          // Look for "APIC" frame
          if (view.getUint32(offset) === 0x41504943) {
            // "APIC"
            const frameSize = safeReadUint32(offset + 4)
            if (frameSize && frameSize > 0) {
              offset += 10 // Skip frame header

              // Skip text encoding byte and MIME type
              while (canReadBytes(1) && view.getUint8(offset) !== 0) offset++
              offset++ // Skip null terminator

              // Skip picture type
              if (canReadBytes(1)) offset++

              // Skip description
              while (canReadBytes(1) && view.getUint8(offset) !== 0) offset++
              offset++ // Skip null terminator

              // Now we're at the picture data
              if (canReadBytes(8)) {
                const isPNG = view.getUint32(offset) === 0x89504e47
                const isJPEG = view.getUint16(offset) === 0xffd8

                if (isPNG || isJPEG) {
                  let end = offset
                  if (isPNG) {
                    // Find PNG IEND chunk
                    while (canReadBytes(12) && safeReadUint32(end) !== 0x49454e44) {
                      end++
                    }
                    if (canReadBytes(12)) {
                      end += 8
                      const blob = new Blob([new Uint8Array(buffer, offset, end - offset)], { type: "image/png" })
                      resolve({ blob, format: "png" })
                      return
                    }
                  } else {
                    // Find JPEG end marker
                    while (canReadBytes(2) && safeReadUint16(end) !== 0xffd9) {
                      end++
                    }
                    if (canReadBytes(2)) {
                      end += 2
                      const blob = new Blob([new Uint8Array(buffer, offset, end - offset)], { type: "image/jpeg" })
                      resolve({ blob, format: "jpeg" })
                      return
                    }
                  }
                }
              }
            }
          }
          offset++
        }
        resolve({ blob: null, format: null })
      } catch (error) {
        console.error(`Error extracting cover art from ${file.name}:`, error)
        resolve({ blob: null, format: null })
      }
    }
    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file)
  })
}

export async function processDirectory(
  files: File[],
  progressCallback: (processed: number, total: number) => void,
): Promise<Map<string, { file: File; coverArt: Blob | null; format: string | null; error?: string }>> {
  const results = new Map<string, { file: File; coverArt: Blob | null; format: string | null; error?: string }>()
  let processed = 0

  for (const file of files) {
    if (file.name.toLowerCase().endsWith(".mp3")) {
      try {
        const { blob: coverArt, format } = await extractCoverArt(file)
        results.set(file.name, { file, coverArt, format })
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
        results.set(file.name, {
          file,
          coverArt: null,
          format: null,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
      processed++
      progressCallback(processed, files.length)
    }
  }

  return results
}

export function prepareCoverArtForDownload(coverArt: Blob, format: string): Blob {
  const jpegHeader = new Uint8Array([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
    0x00,
  ])

  const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

  const headerBytes = format === "jpeg" ? jpegHeader : pngHeader
  return new Blob([headerBytes, coverArt], { type: `image/${format}` })
}

export async function generateZipFile(files: { name: string; content: Blob }[]): Promise<Blob> {
  const zip = new JSZip()

  files.forEach((file) => {
    zip.file(file.name, file.content)
  })

  return await zip.generateAsync({ type: "blob" })
}

export function downloadCoverArt(fileName: string, coverArt: Blob, format: string) {
  const preparedBlob = prepareCoverArtForDownload(coverArt, format)
  const link = document.createElement("a")
  link.href = URL.createObjectURL(preparedBlob)
  link.download = `${fileName.replace(/\.mp3$/, "")}_cover.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}


export async function saveGeneratedImage(imageUrl: string, fileName: string): Promise<string> {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${fileName}_cover.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return url
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'image:", error)
    throw error
  }
}


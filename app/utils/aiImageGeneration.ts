import { getApiKeys } from "./apiKeyStorage"

interface ImageGenerationResult {
  success: boolean
  imageUrl?: string
  error?: string
}

async function generateImageWithGemini(prompt: string): Promise<ImageGenerationResult> {
  const apiKeys = getApiKeys()
  const apiKey = apiKeys.gemini

  if (!apiKey) {
    return { success: false, error: "Clé API Gemini manquante" }
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Erreur API Gemini: ${response.statusText}`)
    }

    const data = await response.json()
    // Note: This is a placeholder. You'll need to parse the actual response to get the image URL
    const imageUrl = data.candidates[0].content.parts[0].text
    return { success: true, imageUrl }
  } catch (error) {
    console.error("Erreur lors de la génération d'image avec Gemini:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" }
  }
}

async function generateImageWithDeepSeek(prompt: string): Promise<ImageGenerationResult> {
  const apiKeys = getApiKeys()
  const apiKey = apiKeys.deepseek

  if (!apiKey) {
    return { success: false, error: "Clé API DeepSeek manquante" }
  }

  try {
    const response = await fetch("https://api.deepseek.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur API DeepSeek: ${response.statusText}`)
    }

    const data = await response.json()
    const imageUrl = data.data[0].url
    return { success: true, imageUrl }
  } catch (error) {
    console.error("Erreur lors de la génération d'image avec DeepSeek:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" }
  }
}

export async function generateImage(prompt: string, selectedAPI: string): Promise<ImageGenerationResult> {
  if (selectedAPI === "gemini") {
    return generateImageWithGemini(prompt)
  } else if (selectedAPI === "deepseek") {
    return generateImageWithDeepSeek(prompt)
  } else {
    return { success: false, error: "API non supportée" }
  }
}


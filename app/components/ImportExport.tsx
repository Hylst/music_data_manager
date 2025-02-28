import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserPreferences {
  apiKeys: {
    starryAI?: string
    openAI?: string
    stabilityAI?: string
    midjourney?: string
  }
  keywords: string[]
  displayMode: "light" | "dark" | "system"
  cleaningOptions: {
    removeExtension: boolean
    removeVersion: boolean
    removeCommonWords: boolean
    customWords: string[]
  }
}

interface ImportExportProps {
  processedFiles: string[]
  setProcessedFiles: (files: string[]) => void
}

const presetKeywords = [
  "abstract",
  "acoustic",
  "ambient",
  "analog",
  "artistic",
  "atmospheric",
  "avant-garde",
  "baroque",
  "black and white",
  "blues",
  "cinematic",
  "classical",
  "colorful",
  "contemporary",
  "cosmic",
  "dark",
  "digital",
  "dramatic",
  "dreamy",
  "electronic",
  "energetic",
  "experimental",
  "fantasy",
  "folk",
  "futuristic",
  "geometric",
  "glitch",
  "gothic",
  "grunge",
  "hip-hop",
  "industrial",
  "jazz",
  "landscape",
  "light",
  "liquid",
  "magical",
  "medieval",
  "melancholic",
  "metallic",
  "minimal",
  "modern",
  "moody",
  "mystical",
  "natural",
  "neon",
  "nostalgic",
  "organic",
  "oriental",
  "painterly",
  "pastel",
  "photographic",
  "pop",
  "portrait",
  "psychedelic",
  "punk",
  "raw",
  "realistic",
  "retro",

  "rock",
  "romantic",
  "rustic",
  "sci-fi",
  "simple",
  "smooth",
  "space",
  "spiritual",
  "street",
  "surreal",
  "synthetic",
  "technical",
  "textured",
  "traditional",
  "tribal",
  "tropical",
  "urban",
  "vintage",
  "vivid",
  "warm",
  "watercolor",
  "wild",
  "zen",
]

export default function ImportExport({ processedFiles, setProcessedFiles }: ImportExportProps) {
  const [importData, setImportData] = useState("")
  const [error, setError] = useState<string | null>(null)

  const loadPreferences = (): UserPreferences => {
    const stored = localStorage.getItem("userPreferences")
    return stored
      ? JSON.parse(stored)
      : {
          apiKeys: {},
          keywords: [],
          displayMode: "system",
          cleaningOptions: {
            removeExtension: true,
            removeVersion: true,
            removeCommonWords: true,
            customWords: [],
          },
        }
  }

  const savePreferences = (prefs: UserPreferences) => {
    localStorage.setItem("userPreferences", JSON.stringify(prefs))
  }

  const handleExport = () => {
    try {
      const prefs = loadPreferences()
      const exportData = {
        preferences: prefs,
        processedFiles,
        presetKeywords,
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "ai-album-art-preferences.json"
      a.click()
      URL.revokeObjectURL(url)
      setError(null)
    } catch (err) {
      setError("Erreur lors de l'export")
    }
  }

  const handleImport = () => {
    try {
      const importedData = JSON.parse(importData)
      if (importedData.preferences) {
        savePreferences(importedData.preferences)
      }
      if (Array.isArray(importedData.processedFiles)) {
        setProcessedFiles(importedData.processedFiles)
      }
      setError(null)
      setImportData("")
      alert("Import réussi!")
    } catch (err) {
      setError("Erreur lors de l'import. Vérifiez le format du fichier.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import / Export des préférences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={handleExport} className="w-full">
            Exporter les préférences
          </Button>
          <p className="text-sm text-muted-foreground">
            Exporte vos clés API, mots-clés personnalisés, et autres préférences
          </p>
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Collez ici les données à importer"
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            className="min-h-[200px]"
          />
          <Button onClick={handleImport} className="w-full">
            Importer
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}


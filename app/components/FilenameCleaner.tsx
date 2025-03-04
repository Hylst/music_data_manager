"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface FilenameCleanerProps {
  files: File[]
  onCleanedNamesChange: (cleanedNames: string[]) => void
}

export default function FilenameCleaner({ files, onCleanedNamesChange }: FilenameCleanerProps) {
  const [removeExtension, setRemoveExtension] = useState(true)
  const [removeVersion, setRemoveVersion] = useState(true)
  const [removeCommonWords, setRemoveCommonWords] = useState(true)
  const [customWords, setCustomWords] = useState("")
  const [autoClean, setAutoClean] = useState(false)

  useEffect(() => {
    // Charger les paramètres depuis le localStorage
    const savedSettings = localStorage.getItem("filenameCleanerSettings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setRemoveExtension(settings.removeExtension)
      setRemoveVersion(settings.removeVersion)
      setRemoveCommonWords(settings.removeCommonWords)
      setCustomWords(settings.customWords)
      setAutoClean(settings.autoClean)
    }
  }, [])

  useEffect(() => {
    // Sauvegarder les paramètres dans le localStorage
    const settings = {
      removeExtension,
      removeVersion,
      removeCommonWords,
      customWords,
      autoClean,
    }
    localStorage.setItem("filenameCleanerSettings", JSON.stringify(settings))
  }, [removeExtension, removeVersion, removeCommonWords, customWords, autoClean])

  const cleanFilename = useCallback(
    (filename: string) => {
      let cleaned = filename

      if (removeExtension) {
        cleaned = cleaned.replace(/\.mp3$/i, "")
      }

      if (removeVersion) {
        cleaned = cleaned.replace(/$$[^)]*$$/g, "") // Remove parentheses and content
        cleaned = cleaned.replace(/\[[^\]]*\]/g, "") // Remove brackets and content
      }

      if (removeCommonWords) {
        const commonWords = ["official", "video", "audio", "lyrics", "hd", "4k", "remix"]
        commonWords.forEach((word) => {
          const regex = new RegExp(`\\b${word}\\b`, "gi")
          cleaned = cleaned.replace(regex, "")
        })
      }

      if (customWords) {
        const words = customWords.split(",").map((w) => w.trim())
        words.forEach((word) => {
          if (word) {
            const regex = new RegExp(`\\b${word}\\b`, "gi")
            cleaned = cleaned.replace(regex, "")
          }
        })
      }

      // Clean up extra spaces and dashes
      cleaned = cleaned.replace(/\s+/g, " ").trim()
      cleaned = cleaned.replace(/\s*-\s*/g, " - ")

      return cleaned + (removeExtension ? ".mp3" : "")
    },
    [removeExtension, removeVersion, removeCommonWords, customWords],
  )

  useEffect(() => {
    if (autoClean) {
      const cleanedNames = files.map((file) => cleanFilename(file.name))
      onCleanedNamesChange(cleanedNames)
    }
  }, [files, autoClean, cleanFilename, onCleanedNamesChange])

  const handleOptionChange = useCallback(() => {
    if (autoClean) {
      const cleanedNames = files.map((file) => cleanFilename(file.name))
      onCleanedNamesChange(cleanedNames)
    }
  }, [files, autoClean, cleanFilename, onCleanedNamesChange])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nettoyage des noms de fichiers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-clean"
            checked={autoClean}
            onCheckedChange={(checked) => {
              setAutoClean(checked)
              handleOptionChange()
            }}
          />
          <Label htmlFor="auto-clean">Nettoyage automatique</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="remove-extension"
            checked={removeExtension}
            onCheckedChange={(checked) => {
              setRemoveExtension(checked)
              handleOptionChange()
            }}
          />
          <Label htmlFor="remove-extension">Retirer l'extension pendant le nettoyage</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="remove-version"
            checked={removeVersion}
            onCheckedChange={(checked) => {
              setRemoveVersion(checked)
              handleOptionChange()
            }}
          />
          <Label htmlFor="remove-version">Retirer les versions (contenu entre parenthèses)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="remove-common"
            checked={removeCommonWords}
            onCheckedChange={(checked) => {
              setRemoveCommonWords(checked)
              handleOptionChange()
            }}
          />
          <Label htmlFor="remove-common">Retirer les mots communs (official, video, etc.)</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-words">Mots personnalisés à retirer (séparés par des virgules)</Label>
          <Input
            id="custom-words"
            value={customWords}
            onChange={(e) => {
              setCustomWords(e.target.value)
              handleOptionChange()
            }}
            placeholder="remix, live, acoustic..."
          />
        </div>
      </CardContent>
    </Card>
  )
}


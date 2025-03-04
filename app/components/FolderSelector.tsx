"use client"

import type React from "react"

import { useState, useRef } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FolderSelectorProps {
  onFilesSelected: (files: File[]) => void
}

export default function FolderSelector({ onFilesSelected }: FolderSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const directoryInputRef = useRef<HTMLInputElement>(null)

  const handleDirectorySelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const files = event.target.files

    if (!files || files.length === 0) {
      setError("Aucun fichier sélectionné")
      return
    }

    const mp3Files = Array.from(files).filter((file) => file.name.toLowerCase().endsWith(".mp3"))

    if (mp3Files.length === 0) {
      setError("Aucun fichier MP3 trouvé dans la sélection")
      return
    }

    onFilesSelected(mp3Files)
    setIsSelecting(false)
  }

  const handleSelectClick = () => {
    setIsSelecting(true)
    setError(null)
    directoryInputRef.current?.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélection du dossier musical</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          ref={directoryInputRef}
          onChange={handleDirectorySelect}
          webkitdirectory=""
          directory=""
          multiple
          className="hidden"
        />

        <Button onClick={handleSelectClick} disabled={isSelecting} className="w-full">
          {isSelecting ? "Sélection en cours..." : "Sélectionner un dossier"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}


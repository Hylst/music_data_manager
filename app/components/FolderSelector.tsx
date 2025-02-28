"use client"

import { useState, useRef } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface FolderSelectorProps {
  onFilesSelected: (files: File[]) => void
}

type SelectionMode = "files" | "folder" | "folder-recursive"

export default function FolderSelector({ onFilesSelected }: FolderSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("files")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
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
    setError(null)
  }

  const handleSelectClick = () => {
    setIsSelecting(true)
    setError(null)

    if (selectionMode === "files") {
      fileInputRef.current?.click()
    } else {
      folderInputRef.current?.click()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélection des fichiers MP3</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectionMode} onValueChange={(value: SelectionMode) => setSelectionMode(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="files" id="files" />
            <Label htmlFor="files">Sélectionner une liste de fichiers MP3</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="folder" id="folder" />
            <Label htmlFor="folder">Tous les fichiers MP3 d'un répertoire</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="folder-recursive" id="folder-recursive" />
            <Label htmlFor="folder-recursive">Tous les fichiers MP3 d'un répertoire et ses sous-répertoires</Label>
          </div>
        </RadioGroup>

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          accept=".mp3"
          multiple
          className="hidden"
        />

        <input
          type="file"
          ref={folderInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          {...(selectionMode === "folder-recursive" ? { webkitdirectory: "", directory: "" } : { directory: "" })}
          className="hidden"
        />

        <Button onClick={handleSelectClick} disabled={isSelecting} className="w-full">
          {isSelecting ? "Sélection en cours..." : "Sélectionner les fichiers MP3"}
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


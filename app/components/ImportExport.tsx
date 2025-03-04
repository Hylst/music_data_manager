"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload } from "lucide-react"

interface ImportExportProps {
  processedFiles: string[]
  setProcessedFiles: (files: string[]) => void
}

export default function ImportExport({ processedFiles, setProcessedFiles }: ImportExportProps) {
  const [importData, setImportData] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleExport = () => {
    try {
      const exportData = {
        processedFiles,
        timestamp: new Date().toISOString(),
        version: "1.0", // You can update this version number as needed
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "musicmaster-export.json"
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
      if (Array.isArray(importedData.processedFiles)) {
        setProcessedFiles(importedData.processedFiles)
        setError(null)
        setImportData("")
        alert("Import réussi!")
      } else {
        throw new Error("Format de données invalide")
      }
    } catch (err) {
      setError("Erreur lors de l'import. Vérifiez le format du fichier.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import / Export</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={handleExport} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Exporter les données
          </Button>
          <p className="text-sm text-muted-foreground">
            Exporte la liste des fichiers traités et autres données pertinentes
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
            <Upload className="mr-2 h-4 w-4" />
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


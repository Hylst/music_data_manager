"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { processDirectory, prepareCoverArtForDownload, generateZipFile, downloadCoverArt } from "../utils/coverArtUtils"
import FolderSelector from "./FolderSelector"
import { useLanguage } from "../contexts/LanguageContext"

interface ProcessedFile {
  file: File
  coverArt: Blob | null
  format: string | null
  error?: string
}

const translations = {
  en: {
    title: "Cover Art Manager",
    processing: "Processing",
    completed: "completed",
    error: "An error occurred while processing the files.",
    noCoverArt: "No cover art to extract.",
    zipError: "Error creating ZIP file.",
    coverArtsFound: "Cover arts found:",
    extractAllZip: "Extract all cover arts (ZIP)",
    processedFiles: "Processed files:",
    coverArtFound: "Cover art found",
    extract: "Extract",
    noCoverArtFound: "No cover art",
  },
  fr: {
    title: "Gestionnaire de pochettes d'albums",
    processing: "Traitement en cours",
    completed: "complété",
    error: "Une erreur est survenue lors du traitement des fichiers.",
    noCoverArt: "Aucune pochette à extraire.",
    zipError: "Erreur lors de la création du fichier ZIP.",
    coverArtsFound: "Pochettes trouvées :",
    extractAllZip: "Extraire toutes les pochettes (ZIP)",
    processedFiles: "Fichiers traités :",
    coverArtFound: "Pochette trouvée",
    extract: "Extraire",
    noCoverArtFound: "Pas de pochette",
  },
}

export default function CoverArtManager() {
  const [files, setFiles] = useState<File[]>([])
  const [processedFiles, setProcessedFiles] = useState<Map<string, ProcessedFile>>(new Map())
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { language } = useLanguage()
  const t = translations[language]

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    setProcessedFiles(new Map())
    setProgress(0)
    setError(null)
  }

  useEffect(() => {
    const processFiles = async () => {
      if (files.length === 0) return

      setIsProcessing(true)
      setError(null)

      try {
        const results = await processDirectory(files, (processed, total) => {
          setProgress((processed / total) * 100)
        })
        setProcessedFiles(results)
      } catch (err) {
        setError(t.error)
        console.error(err)
      } finally {
        setIsProcessing(false)
      }
    }

    processFiles()
  }, [files, t.error])

  const handleExtractAll = async () => {
    const filesToZip = Array.from(processedFiles.entries())
      .filter(([_, data]) => data.coverArt && data.format)
      .map(([fileName, data]) => ({
        name: `${fileName.replace(/\.mp3$/, "")}_cover.${data.format}`,
        content: prepareCoverArtForDownload(data.coverArt!, data.format!),
      }))

    if (filesToZip.length === 0) {
      setError(t.noCoverArt)
      return
    }

    try {
      const zipBlob = await generateZipFile(filesToZip)
      const link = document.createElement("a")
      link.href = URL.createObjectURL(zipBlob)
      link.download = "cover_arts.zip"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (err) {
      setError(t.zipError)
      console.error(err)
    }
  }

  const handleExtractSingle = (fileName: string, coverArt: Blob, format: string) => {
    downloadCoverArt(fileName, coverArt, format)
  }

  const coverArtCount = Array.from(processedFiles.values()).filter((data) => data.coverArt).length

  return (
    <div className="space-y-6">
      <FolderSelector onFilesSelected={handleFilesSelected} />

      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500">
                {progress.toFixed(0)}% {t.completed}
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {processedFiles.size > 0 && (
            <>
              <div className="flex justify-between items-center">
                <p>
                  {t.coverArtsFound} {coverArtCount} / {processedFiles.size}
                </p>
                <Button onClick={handleExtractAll} disabled={coverArtCount === 0}>
                  {t.extractAllZip}
                </Button>
              </div>

              <div className="mt-4 max-h-96 overflow-y-auto">
                <h3 className="font-semibold mb-2">{t.processedFiles}</h3>
                <ul className="divide-y">
                  {Array.from(processedFiles.entries()).map(([fileName, data]) => (
                    <li key={fileName} className="py-2 flex items-center justify-between">
                      <span className="truncate mr-2">{fileName}</span>
                      {data.coverArt && data.format ? (
                        <div>
                          <span className="text-sm text-green-500 mr-2">
                            {t.coverArtFound} ({data.format.toUpperCase()})
                          </span>
                          <Button size="sm" onClick={() => handleExtractSingle(fileName, data.coverArt!, data.format!)}>
                            {t.extract}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-red-500">{data.error || t.noCoverArtFound}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


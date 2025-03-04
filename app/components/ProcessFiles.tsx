"use client"

import { useState, useCallback, useEffect } from "react"
import { processFile, associateImageWithMP3, downloadFile } from "../utils/fileUtils"
import { getApiKeys } from "../utils/apiKeyStorage"
import { generateImage } from "../utils/aiImageGeneration"
import { saveGeneratedImage } from "../utils/imageUtils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePreview } from "./ImagePreview"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ErrorDisplay } from "./ErrorDisplay"

interface ProcessFilesProps {
  files: File[]
  cleanedNames: string[]
  onFilesProcessed: (processedFiles: string[]) => void
}

interface ProcessingStatus {
  file: string
  status: "pending" | "processing" | "success" | "error"
  message?: string
  imageUrl?: string
}

export default function ProcessFiles({ files, cleanedNames, onFilesProcessed }: ProcessFilesProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statuses, setStatuses] = useState<ProcessingStatus[]>([])
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [selectedAPI, setSelectedAPI] = useState<string>("gemini")
  const [customPrompt, setCustomPrompt] = useState("")
  const [previewImage, setPreviewImage] = useState<{ url: string; fileName: string } | null>(null)
  const [associateImages, setAssociateImages] = useState(false)
  const [error, setError] = useState<{ title: string; message: string } | null>(null)

  useEffect(() => {
    setApiKeys(getApiKeys())
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setCustomPrompt(settings.customPrompt || "")
    }
  }, [])

  const updateStatus = useCallback(
    (fileName: string, status: ProcessingStatus["status"], message?: string, imageUrl?: string) => {
      setStatuses((prev) => {
        const existing = prev.findIndex((s) => s.file === fileName)
        const newStatus = { file: fileName, status, message, imageUrl }

        if (existing >= 0) {
          const newStatuses = [...prev]
          newStatuses[existing] = newStatus
          return newStatuses
        }

        return [...prev, newStatus]
      })
    },
    [],
  )

  const generatePrompt = useCallback(
    (tags: any) => {
      if (customPrompt) {
        return customPrompt
          .replace("{title}", tags.title)
          .replace("{artist}", tags.artist)
          .replace("{album}", tags.album)
          .replace("{genre}", tags.genre || "unknown")
          .replace("{year}", tags.year || "unknown")
      }
      return `Generate an album cover for a song titled "${tags.title}" by ${tags.artist}. The genre is ${tags.genre || "unknown"}. The album is called "${tags.album}". Year: ${tags.year || "unknown"}.`
    },
    [customPrompt],
  )

  const handleProcess = useCallback(async () => {
    if (isProcessing) return

    setIsProcessing(true)
    setProgress(0)
    setStatuses([])
    setError(null)

    const processedFiles: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const cleanedName = cleanedNames[i] || file.name

      updateStatus(file.name, "processing")

      try {
        const tags = await processFile(file, cleanedName, apiKeys)
        const prompt = generatePrompt(tags)

        const imageResult = await generateImage(prompt, selectedAPI)

        if (imageResult.success && imageResult.imageUrl) {
          setPreviewImage({ url: imageResult.imageUrl, fileName: cleanedName })
          // Attendre que l'utilisateur confirme ou annule la sauvegarde
          await new Promise<void>((resolve) => {
            const handleSave = async () => {
              try {
                const savedImageUrl = await saveGeneratedImage(imageResult.imageUrl, cleanedName)

                if (associateImages) {
                  const taggedFile = await associateImageWithMP3(file, savedImageUrl)
                  downloadFile(taggedFile)
                  updateStatus(
                    file.name,
                    "success",
                    `Image générée, associée et fichier MP3 mis à jour pour ${cleanedName}`,
                    savedImageUrl,
                  )
                } else {
                  updateStatus(file.name, "success", `Image générée et sauvegardée pour ${cleanedName}`, savedImageUrl)
                }

                processedFiles.push(file.name)
              } catch (error) {
                updateStatus(
                  file.name,
                  "error",
                  `Erreur lors du traitement de ${cleanedName}: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
                )
                setError({
                  title: "Erreur de traitement",
                  message: `Une erreur est survenue lors du traitement de ${cleanedName}. Veuillez réessayer.`,
                })
              } finally {
                setPreviewImage(null)
                resolve()
              }
            }

            const handleCancel = () => {
              updateStatus(file.name, "error", "Génération d'image annulée par l'utilisateur")
              setPreviewImage(null)
              resolve()
            }

            // Ces gestionnaires seront utilisés dans le composant ImagePreview
            window.handleImagePreviewSave = handleSave
            window.handleImagePreviewCancel = handleCancel
          })
        } else {
          updateStatus(file.name, "error", imageResult.error || "Erreur lors de la génération de l'image")
          setError({
            title: "Erreur de génération d'image",
            message: `Impossible de générer l'image pour ${cleanedName}. Veuillez vérifier vos paramètres et réessayer.`,
          })
        }
      } catch (error) {
        updateStatus(file.name, "error", `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`)
        setError({
          title: "Erreur inattendue",
          message: `Une erreur inattendue est survenue lors du traitement de ${cleanedName}. Veuillez réessayer ou contacter le support.`,
        })
      }

      setProgress(Math.round(((i + 1) / files.length) * 100))
    }

    setIsProcessing(false)
    onFilesProcessed(processedFiles)
  }, [
    files,
    cleanedNames,
    onFilesProcessed,
    isProcessing,
    updateStatus,
    apiKeys,
    selectedAPI,
    generatePrompt,
    associateImages,
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traitement des fichiers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="api-select" className="text-sm font-medium">
            Sélectionner l'API pour la génération d'images
          </label>
          <Select onValueChange={setSelectedAPI} value={selectedAPI}>
            <SelectTrigger id="api-select">
              <SelectValue placeholder="Choisir une API" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini">Google Gemini</SelectItem>
              <SelectItem value="deepseek">DeepSeek</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="associate-images" checked={associateImages} onCheckedChange={setAssociateImages} />
          <Label htmlFor="associate-images">Associer automatiquement les images aux fichiers MP3</Label>
        </div>

        <Button onClick={handleProcess} disabled={isProcessing || files.length === 0} className="w-full">
          {isProcessing ? "Traitement en cours..." : "Traiter les fichiers"}
        </Button>

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500">{progress}% complété</p>
          </div>
        )}

        <div className="space-y-2">
          {statuses.map(({ file, status, message, imageUrl }) => (
            <Alert key={file} variant={status === "error" ? "destructive" : "default"}>
              {status === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertDescription>
                {status === "processing" ? `Traitement de ${file} en cours...` : message || `${file}: ${status}`}
              </AlertDescription>
              {imageUrl && (
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={`Generated cover for ${file}`}
                  className="mt-2 w-full max-w-xs rounded-md"
                />
              )}
            </Alert>
          ))}
        </div>
        {previewImage && (
          <ImagePreview
            imageUrl={previewImage.url}
            fileName={previewImage.fileName}
            onSave={() => window.handleImagePreviewSave()}
            onCancel={() => window.handleImagePreviewCancel()}
            isOpen={!!previewImage}
          />
        )}
        {error && <ErrorDisplay title={error.title} message={error.message} />}
      </CardContent>
    </Card>
  )
}


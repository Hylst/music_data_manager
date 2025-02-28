"use client"

import { useState, useMemo } from "react"
import { processFile } from "../utils/fileUtils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import KeywordManager from "./KeywordManager"

interface ProcessFilesProps {
  files: File[]
  cleanedNames: string[]
  onFilesProcessed: (processedFiles: string[]) => void
}

interface ProcessingStatus {
  file: string
  status: "pending" | "processing" | "success" | "error"
  message?: string
}

export default function ProcessFiles({ files, cleanedNames, onFilesProcessed }: ProcessFilesProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statuses, setStatuses] = useState<ProcessingStatus[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [useRandomKeywords, setUseRandomKeywords] = useState(false)

  const filesToProcess = useMemo(() => {
    return files.map((file, index) => ({
      file,
      cleanedName: cleanedNames[index] || file.name,
    }))
  }, [files, cleanedNames])

  const updateStatus = (fileName: string, status: ProcessingStatus["status"], message?: string) => {
    setStatuses((prev) => {
      const existing = prev.findIndex((s) => s.file === fileName)
      const newStatus = { file: fileName, status, message }

      if (existing >= 0) {
        const newStatuses = [...prev]
        newStatuses[existing] = newStatus
        return newStatuses
      }

      return [...prev, newStatus]
    })
  }

  const handleProcess = async () => {
    console.log("Début du processus de génération et d'application des pochettes")
    setIsProcessing(true)
    setProgress(0)
    setStatuses([])

    const processedFiles: string[] = []

    for (let i = 0; i < filesToProcess.length; i++) {
      const { file, cleanedName } = filesToProcess[i]
      console.log(`Traitement du fichier ${i + 1}/${filesToProcess.length}: ${file.name}`)
      updateStatus(file.name, "processing")

      try {
        const fileKeywords = useRandomKeywords ? getRandomKeywords() : keywords
        console.log("Mots-clés utilisés:", fileKeywords)
        const result = await processFile(file, cleanedName, fileKeywords)
        console.log("Résultat du traitement:", result)
        updateStatus(file.name, result.success ? "success" : "error", result.message)
        if (result.success) {
          processedFiles.push(file.name)
        }
      } catch (error) {
        console.error("Erreur lors du traitement:", error)
        updateStatus(file.name, "error", `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`)
      }

      setProgress(Math.round(((i + 1) / filesToProcess.length) * 100))
    }

    console.log("Fin du processus de génération et d'application des pochettes")
    setIsProcessing(false)
    onFilesProcessed(processedFiles)
  }

  const getRandomKeywords = () => {
    const allKeywords = ["vibrant", "abstract", "minimalist", "surreal", "retro", "futuristic", "nature", "urban"]
    const numKeywords = Math.floor(Math.random() * 3) + 1 // 1 to 3 random keywords
    const shuffled = allKeywords.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numKeywords)
  }

  return (
    <div className="space-y-4">
      <KeywordManager
        keywords={keywords}
        setKeywords={setKeywords}
        useRandomKeywords={useRandomKeywords}
        setUseRandomKeywords={setUseRandomKeywords}
      />

      <Button
        onClick={handleProcess}
        disabled={isProcessing || files.length === 0}
        className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
      >
        {isProcessing ? "Traitement en cours..." : "Générer et appliquer les pochettes"}
      </Button>

      {isProcessing && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500">{progress}% complété</p>
        </div>
      )}

      <div className="space-y-2">
        {statuses.map(({ file, status, message }) => (
          <Alert key={file} variant={status === "error" ? "destructive" : "default"}>
            {status === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertDescription className="text-xs sm:text-sm">
              {status === "processing" ? `Traitement de ${file} en cours...` : message || `${file}: ${status}`}
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  )
}


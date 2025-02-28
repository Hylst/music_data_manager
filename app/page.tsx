"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from "./components/mode-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import components to reduce initial bundle size
const FolderSelector = dynamic(() => import("./components/FolderSelector"))
const FileList = dynamic(() => import("./components/FileList"))
const ProcessFiles = dynamic(() => import("./components/ProcessFiles"))
const Statistics = dynamic(() => import("./components/Statistics"))
const Settings = dynamic(() => import("./components/Settings"))
const ImportExport = dynamic(() => import("./components/ImportExport"))
const About = dynamic(() => import("./components/About"))
const FileListExport = dynamic(() => import("./components/FileListExport"))
const FilenameCleaner = dynamic(() => import("./components/FilenameCleaner"))
const Musicotheque = dynamic(() => import("./components/Musicotheque"))

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [processedFiles, setProcessedFiles] = useState<string[]>([])
  const [cleanedNames, setCleanedNames] = useState<string[]>([])

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    setFiles(selectedFiles)
    setCleanedNames([])
  }, [])

  const handleCleanedNamesChange = useCallback((newCleanedNames: string[]) => {
    setCleanedNames(newCleanedNames)
  }, [])

  const handleFilesProcessed = useCallback((processedFileNames: string[]) => {
    setProcessedFiles((prev) => [...new Set([...prev, ...processedFileNames])])
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold gradient-text">MusicMaster Pro</h1>
          <ModeToggle />
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>EN CONSTRUCTION - Version bêta</AlertDescription>
        </Alert>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="generate">Générer</TabsTrigger>
            <TabsTrigger value="musicotheque">Musicothèque</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
            <TabsTrigger value="import-export">Import/Export</TabsTrigger>
            <TabsTrigger value="about">À propos</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid gap-6">
              <FolderSelector onFilesSelected={handleFilesSelected} />
              <FilenameCleaner files={files} onCleanedNamesChange={handleCleanedNamesChange} />
              <FileList files={files} processedFiles={processedFiles} />
              <ProcessFiles files={files} cleanedNames={cleanedNames} onFilesProcessed={handleFilesProcessed} />
              <FileListExport files={files} cleanedNames={cleanedNames} />
            </div>
          </TabsContent>

          <TabsContent value="musicotheque">
            <Musicotheque />
          </TabsContent>

          <TabsContent value="statistics">
            <Statistics processedFiles={processedFiles} />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>

          <TabsContent value="import-export">
            <ImportExport processedFiles={processedFiles} setProcessedFiles={(files) => setProcessedFiles(files)} />
          </TabsContent>

          <TabsContent value="about">
            <About />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2024 MusicMaster Pro. Développé par Geoffroy Streit.
        </div>
      </footer>
    </div>
  )
}


"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from "./components/mode-toggle"
import { LanguageToggle } from "./components/language-toggle"
import { useLanguage } from "./contexts/LanguageContext"
import dynamic from "next/dynamic"

const FolderSelector = dynamic(() => import("./components/FolderSelector"))
const FileList = dynamic(() => import("./components/FileList"))
const FilenameCleaner = dynamic(() => import("./components/FilenameCleaner"))
const ProcessFiles = dynamic(() => import("./components/ProcessFiles"))
const Statistics = dynamic(() => import("./components/Statistics"))
const Settings = dynamic(() => import("./components/Settings"))
const ImportExport = dynamic(() => import("./components/ImportExport"))
const About = dynamic(() => import("./components/About"))
const CoverArtManager = dynamic(() => import("./components/CoverArtManager"))

const translations = {
  en: {
    generate: "Generate",
    statistics: "Statistics",
    settings: "Settings",
    importExport: "Import/Export",
    coverArt: "Cover Art",
    about: "About",
    footer: "© 2024 Hylst MP3 Tools. Developed by Geoffroy Streit.",
    underConstruction: "🚧 Under Construction 🚧",
  },
  fr: {
    generate: "Générer",
    statistics: "Statistiques",
    settings: "Paramètres",
    importExport: "Import/Export",
    coverArt: "Pochettes",
    about: "À propos",
    footer: "© 2024 Hylst MP3 Tools. Développé par Geoffroy Streit.",
    underConstruction: "🚧 En Construction 🚧",
  },
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [processedFiles, setProcessedFiles] = useState<string[]>([])
  const [cleanedNames, setCleanedNames] = useState<string[]>([])
  const { language } = useLanguage()
  const t = translations[language]

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
          <h1 className="text-4xl font-bold gradient-text">Hylst MP3 Tools</h1>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="bg-yellow-200 text-yellow-800 py-2 text-center">
        <p>{t.underConstruction}</p>
      </div>

      <main className="container mx-auto p-4">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="generate">{t.generate}</TabsTrigger>
            <TabsTrigger value="statistics">{t.statistics}</TabsTrigger>
            <TabsTrigger value="settings">{t.settings}</TabsTrigger>
            <TabsTrigger value="import-export">{t.importExport}</TabsTrigger>
            <TabsTrigger value="cover-art">{t.coverArt}</TabsTrigger>
            <TabsTrigger value="about">{t.about}</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid gap-6">
              <FolderSelector onFilesSelected={handleFilesSelected} />
              <FileList files={files} processedFiles={processedFiles} />
              <FilenameCleaner files={files} onCleanedNamesChange={handleCleanedNamesChange} />
              <ProcessFiles files={files} cleanedNames={cleanedNames} onFilesProcessed={handleFilesProcessed} />
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <Statistics processedFiles={processedFiles} />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>

          <TabsContent value="import-export">
            <ImportExport processedFiles={processedFiles} setProcessedFiles={setProcessedFiles} />
          </TabsContent>

          <TabsContent value="cover-art">
            <CoverArtManager />
          </TabsContent>

          <TabsContent value="about">
            <About />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">{t.footer}</div>
      </footer>
    </div>
  )
}


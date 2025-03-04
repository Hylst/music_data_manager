"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { readID3Tags } from "../utils/mp3Utils"

interface FileRenamerProps {
  files: File[]
}

export default function FileRenamer({ files }: FileRenamerProps) {
  const [pattern, setPattern] = useState("{artist} - {title}")
  const [renamedFiles, setRenamedFiles] = useState<{ original: string; renamed: string }[]>([])

  const handleRename = async () => {
    const renamed = await Promise.all(
      files.map(async (file) => {
        const tags = await readID3Tags(file)
        let newName = pattern
          .replace("{artist}", tags.artist || "Unknown Artist")
          .replace("{title}", tags.title || "Unknown Title")
          .replace("{album}", tags.album || "Unknown Album")
          .replace("{year}", tags.year || "Unknown Year")
        newName = newName.replace(/[<>:"/\\|?*]+/g, "_") + ".mp3"
        return { original: file.name, renamed: newName }
      }),
    )
    setRenamedFiles(renamed)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Renamer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Rename Pattern</label>
          <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="e.g. {artist} - {title}" />
        </div>
        <Button onClick={handleRename}>Rename Files</Button>
        {renamedFiles.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Renamed Files:</h3>
            <ul className="space-y-1">
              {renamedFiles.map((file, index) => (
                <li key={index}>
                  {file.original} → {file.renamed}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


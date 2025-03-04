"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { readID3Tags, writeID3Tags } from "../utils/mp3Utils"

interface MetadataViewerProps {
  file: File | null
}

export default function MetadataViewer({ file }: MetadataViewerProps) {
  const [metadata, setMetadata] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (file) {
      readID3Tags(file).then(setMetadata)
    }
  }, [file])

  const handleSave = async () => {
    if (file && metadata) {
      await writeID3Tags(file, metadata)
      setIsEditing(false)
    }
  }

  if (!file) {
    return <p>Please select a file to view metadata.</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata for {file.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {metadata ? (
          <div className="space-y-4">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key}>
                <label className="text-sm font-medium">{key}</label>
                {isEditing ? (
                  <Input
                    value={value as string}
                    onChange={(e) => setMetadata({ ...metadata, [key]: e.target.value })}
                  />
                ) : (
                  <p>{value as string}</p>
                )}
              </div>
            ))}
            {isEditing ? (
              <Button onClick={handleSave}>Save</Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
        ) : (
          <p>Loading metadata...</p>
        )}
      </CardContent>
    </Card>
  )
}


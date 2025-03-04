"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/input"
import { readID3Tags } from "../utils/mp3Utils"

interface PlaylistGeneratorProps {
  files: File[]
}

export default function PlaylistGenerator({ files }: PlaylistGeneratorProps) {
  const [playlist, setPlaylist] = useState<string>("")

  const generatePlaylist = async () => {
    let m3uContent = "#EXTM3U\n"
    for (const file of files) {
      const tags = await readID3Tags(file)
      m3uContent += `#EXTINF:${Math.round(tags.duration || 0)},${tags.artist} - ${tags.title}\n`
      m3uContent += file.name + "\n"
    }
    setPlaylist(m3uContent)
  }

  const downloadPlaylist = () => {
    const blob = new Blob([playlist], { type: "audio/x-mpegurl" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "playlist.m3u"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Playlist Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={generatePlaylist}>Generate Playlist</Button>
        {playlist && (
          <>
            <pre className="bg-muted p-4 rounded-md overflow-auto max-h-60">{playlist}</pre>
            <Button onClick={downloadPlaylist}>Download Playlist</Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}


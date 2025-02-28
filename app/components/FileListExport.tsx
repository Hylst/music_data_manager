import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface FileListExportProps {
  files: File[]
  cleanedNames: string[]
}

export default function FileListExport({ files, cleanedNames }: FileListExportProps) {
  const handleExport = () => {
    const fileList = files.map((file, index) => ({
      originalName: file.name,
      cleanedName: cleanedNames[index] || file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }))

    const blob = new Blob([JSON.stringify(fileList, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "file-list.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exporter la liste des fichiers</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleExport} disabled={files.length === 0} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Exporter en JSON
        </Button>
      </CardContent>
    </Card>
  )
}


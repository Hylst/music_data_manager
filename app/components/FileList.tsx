import { Check } from "lucide-react"

interface FileListProps {
  files: File[]
  processedFiles: string[]
}

export default function FileList({ files, processedFiles }: FileListProps) {
  if (files.length === 0) {
    return <p>Aucun fichier MP3 sélectionné.</p>
  }

  return (
    <ul className="list-disc pl-5 mb-4 space-y-2">
      {files.map((file, index) => (
        <li key={index} className="flex items-center justify-between">
          <span>{file.name}</span>
          {processedFiles.includes(file.name) && <Check className="text-green-500" size={20} />}
        </li>
      ))}
    </ul>
  )
}


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ImagePreviewProps {
  imageUrl: string
  fileName: string
  onSave: () => void
  onCancel: () => void
  isOpen: boolean
}

export function ImagePreview({ imageUrl, fileName, onSave, onCancel, isOpen }: ImagePreviewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Prévisualisation de l'image pour {fileName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={`Prévisualisation pour ${fileName}`}
            className="w-full rounded-md"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={onSave}>Sauvegarder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


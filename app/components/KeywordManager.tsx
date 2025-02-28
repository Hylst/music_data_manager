import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import type React from "react" // Added import for React

interface KeywordManagerProps {
  keywords: string[]
  setKeywords: (keywords: string[]) => void
  useRandomKeywords: boolean
  setUseRandomKeywords: (use: boolean) => void
}

export default function KeywordManager({
  keywords,
  setKeywords,
  useRandomKeywords,
  setUseRandomKeywords,
}: KeywordManagerProps) {
  const handleAddKeyword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem("keyword") as HTMLInputElement
    const keyword = input.value.trim()

    if (keyword && !keywords.includes(keyword)) {
      setKeywords([...keywords, keyword])
      input.value = ""
    }
  }

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== keywordToRemove))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des mots-clés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="random-keywords" checked={useRandomKeywords} onCheckedChange={setUseRandomKeywords} />
          <Label htmlFor="random-keywords">Utiliser des mots-clés aléatoires</Label>
        </div>

        {!useRandomKeywords && (
          <>
            <form onSubmit={handleAddKeyword} className="flex space-x-2">
              <Input name="keyword" placeholder="Ajouter un mot-clé..." className="flex-1" />
              <Button type="submit">Ajouter</Button>
            </form>

            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <button onClick={() => handleRemoveKeyword(keyword)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}


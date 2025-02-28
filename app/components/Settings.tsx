import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveApiKeys, getApiKeys } from "../utils/apiKeyStorage"

export default function Settings() {
  const [apiKey, setApiKey] = useState("")
  const [selectedAPI, setSelectedAPI] = useState("starryai")
  const [apiKeys, setApiKeys] = useState(getApiKeys())

  const handleSaveSettings = () => {
    saveApiKeys({
      AUDD_API_TOKEN: apiKey,
      STARRY_AI_API_TOKEN: process.env.NEXT_PUBLIC_STARRY_AI_API_TOKEN,
    })
    console.log("Paramètres sauvegardés:", { apiKey, selectedAPI })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-select">Sélectionner l'API d'IA</Label>
          <Select onValueChange={setSelectedAPI} defaultValue={selectedAPI}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une API" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="starryai">Starry AI</SelectItem>
              <SelectItem value="openai">OpenAI DALL-E</SelectItem>
              <SelectItem value="stabilityai">Stability AI</SelectItem>
              <SelectItem value="midjourney">Midjourney</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-key">Clé API {selectedAPI}</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Entrez votre clé API"
          />
        </div>
        <Button onClick={handleSaveSettings}>Sauvegarder les paramètres</Button>
      </CardContent>
    </Card>
  )
}


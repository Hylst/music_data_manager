"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { saveApiKeys, getApiKeys } from "../utils/apiKeyStorage"

export default function Settings() {
  const [apiKey, setApiKey] = useState("")
  const [selectedAPI, setSelectedAPI] = useState("gemini")
  const [apiKeys, setApiKeys] = useState(getApiKeys())
  const [autoClean, setAutoClean] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")

  useEffect(() => {
    const keys = getApiKeys()
    if (keys[selectedAPI]) {
      setApiKey(keys[selectedAPI])
    } else {
      setApiKey("")
    }

    // Charger les paramètres sauvegardés
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setAutoClean(settings.autoClean)
      setCustomPrompt(settings.customPrompt || "")
    }
  }, [selectedAPI])

  const handleSaveSettings = () => {
    const updatedKeys = {
      ...apiKeys,
      [selectedAPI]: apiKey,
    }
    saveApiKeys(updatedKeys)
    setApiKeys(updatedKeys)

    // Sauvegarder les autres paramètres
    const settings = {
      autoClean,
      customPrompt,
    }
    localStorage.setItem("appSettings", JSON.stringify(settings))

    alert("Paramètres sauvegardés avec succès!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="api-select">Sélectionner l'API d'IA</Label>
          <Select onValueChange={setSelectedAPI} defaultValue={selectedAPI}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une API" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini">Google Gemini</SelectItem>
              <SelectItem value="deepseek">DeepSeek</SelectItem>
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
        <div className="flex items-center space-x-2">
          <Switch id="auto-clean" checked={autoClean} onCheckedChange={setAutoClean} />
          <Label htmlFor="auto-clean">Nettoyage automatique des noms de fichiers</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="custom-prompt">Prompt personnalisé pour la génération d'images</Label>
          <Textarea
            id="custom-prompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Entrez votre prompt personnalisé. Utilisez {title}, {artist}, {album}, {genre}, et {year} comme placeholders."
          />
        </div>
        <Button onClick={handleSaveSettings}>Sauvegarder les paramètres</Button>
      </CardContent>
    </Card>
  )
}


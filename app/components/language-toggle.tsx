"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "../contexts/LanguageContext"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button variant="outline" size="icon" onClick={() => setLanguage(language === "en" ? "fr" : "en")}>
      {language === "en" ? "FR" : "EN"}
    </Button>
  )
}


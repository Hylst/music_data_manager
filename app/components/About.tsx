import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "../contexts/LanguageContext"

const translations = {
  en: {
    title: "About Hylst MP3 Tools",
    description:
      "Hylst MP3 Tools is a web application designed to manage and enhance your MP3 file collection. It provides various tools to work with MP3 files efficiently.",
    features: "Main features:",
    featureList: [
      "MP3 metadata viewer and editor",
      "Basic audio player",
      "File renaming based on metadata",
      "Playlist generator",
      "Cover art extraction and management",
    ],
    status: "Project Status:",
    statusList: [
      "Current version: 1.0.0 (Beta)",
      "Last update: Implementation of bilingual support and new features",
      "Next steps: Performance optimization, unit testing, and additional MP3 management features",
    ],
    technologies: "Technologies used:",
    developedBy: "Developed by Geoffroy Streit | Last updated:",
  },
  fr: {
    title: "À propos de Hylst MP3 Tools",
    description:
      "Hylst MP3 Tools est une application web conçue pour gérer et améliorer votre collection de fichiers MP3. Elle fournit divers outils pour travailler efficacement avec les fichiers MP3.",
    features: "Fonctionnalités principales :",
    featureList: [
      "Visualiseur et éditeur de métadonnées MP3",
      "Lecteur audio basique",
      "Renommage de fichiers basé sur les métadonnées",
      "Générateur de playlist",
      "Extraction et gestion des pochettes d'album",
    ],
    status: "État du projet :",
    statusList: [
      "Version actuelle : 1.0.0 (Beta)",
      "Dernière mise à jour : Implémentation du support bilingue et nouvelles fonctionnalités",
      "Prochaines étapes : Optimisation des performances, tests unitaires et fonctionnalités supplémentaires de gestion MP3",
    ],
    technologies: "Technologies utilisées :",
    developedBy: "Développé par Geoffroy Streit | Dernière mise à jour :",
  },
}

export default function About() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{t.description}</p>

        <div>
          <h3 className="font-semibold mb-2">{t.features}</h3>
          <ul className="list-disc pl-5 space-y-1">
            {t.featureList.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">{t.status}</h3>
          <ul className="list-disc pl-5 space-y-1">
            {t.statusList.map((status, index) => (
              <li key={index}>{status}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">{t.technologies}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>Next.js</Badge>
            <Badge>React</Badge>
            <Badge>TypeScript</Badge>
            <Badge>Tailwind CSS</Badge>
            <Badge>Shadcn UI</Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {t.developedBy} {new Date().toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}


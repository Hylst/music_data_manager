import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function About() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">À propos de MusicMaster Pro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-muted-foreground">
            MusicMaster Pro est une application web complète qui utilise l'intelligence artificielle pour créer des
            pochettes d'album uniques et personnalisées pour vos fichiers MP3, tout en offrant des fonctionnalités
            avancées de gestion de bibliothèque musicale.
          </p>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Fonctionnalités principales</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Génération de pochettes d'album par IA</li>
              <li>Scan de répertoires locaux pour fichiers MP3 (récursif ou non)</li>
              <li>Extraction et affichage des métadonnées des fichiers MP3</li>
              <li>Édition in-place des métadonnées (titre, artiste, album, année, genre, commentaire)</li>
              <li>Lecture des fichiers MP3 avec contrôles de lecture (play, pause, stop)</li>
              <li>Affichage de la progression de lecture pour chaque fichier</li>
              <li>Tri et filtrage des fichiers par différents critères</li>
              <li>Import/Export de catalogues au format JSON</li>
              <li>Synchronisation des métadonnées entre la bibliothèque et les fichiers locaux</li>
              <li>Nettoyage automatique des noms de fichiers</li>
              <li>Gestion de mots-clés pour la génération de pochettes</li>
              <li>Affichage de statistiques sur la bibliothèque</li>
              <li>Mode sombre/clair</li>
              <li>Interface responsive</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">APIs d'IA supportées</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Starry AI</Badge>
              <Badge>DALL-E</Badge>
              <Badge>Stability AI</Badge>
              <Badge>Midjourney</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Utilisation de l'application</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Sélectionnez un répertoire contenant vos fichiers MP3</li>
              <li>Scannez le répertoire pour importer les fichiers dans la bibliothèque</li>
              <li>Utilisez les options de tri et de filtrage pour organiser votre bibliothèque</li>
              <li>Éditez les métadonnées directement dans l'interface</li>
              <li>Générez des pochettes d'album en utilisant l'IA</li>
              <li>Écoutez vos fichiers MP3 directement dans l'application</li>
              <li>Exportez votre bibliothèque au format JSON pour la sauvegarde</li>
              <li>Synchronisez les modifications avec vos fichiers locaux</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Configuration requise</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Navigateur web moderne (Chrome, Firefox, Safari, Edge)</li>
              <li>Connexion internet stable pour les fonctionnalités d'IA</li>
              <li>Compte et clé API pour le service de génération d'images choisi</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">Version 1.3.0 | Développé par Geoffroy Streit</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


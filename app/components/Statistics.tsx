import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface StatisticsProps {
  processedFiles: string[]
}

export default function Statistics({ processedFiles }: StatisticsProps) {
  const totalFiles = processedFiles.length
  const uniqueArtists = new Set(processedFiles.map((file) => file.split(" - ")[0])).size

  const data = [
    { name: "Fichiers traités", value: totalFiles },
    { name: "Artistes uniques", value: uniqueArtists },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fichiers traités</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalFiles}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Artistes uniques</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{uniqueArtists}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}


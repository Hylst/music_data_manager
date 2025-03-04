"use client"

import { useMemo } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface StatisticsProps {
  processedFiles: string[]
}

export default function Statistics({ processedFiles }: StatisticsProps) {
  const { resolvedTheme } = useTheme()

  const stats = useMemo(() => {
    const totalFiles = processedFiles.length
    const uniqueArtists = new Set(processedFiles.map((file) => file.split(" - ")[0])).size

    return [
      { name: "Fichiers traités", value: totalFiles },
      { name: "Artistes uniques", value: uniqueArtists },
    ]
  }, [processedFiles])

  const chartColors = useMemo(() => {
    const isDark = resolvedTheme === "dark"
    return {
      text: isDark ? "#e5e7eb" : "#374151",
      grid: isDark ? "#374151" : "#e5e7eb",
      background: isDark ? "#1f2937" : "#ffffff",
      bars: isDark ? "#8b5cf6" : "#6366f1",
    }
  }, [resolvedTheme])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fichiers traités</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats[0].value}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Artistes uniques</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats[1].value}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="name" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
              <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: chartColors.background,
                  border: `1px solid ${chartColors.grid}`,
                  borderRadius: "6px",
                }}
                labelStyle={{ color: chartColors.text }}
                itemStyle={{ color: chartColors.text }}
              />
              <Legend wrapperStyle={{ color: chartColors.text }} />
              <Bar dataKey="value" fill={chartColors.bars} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}


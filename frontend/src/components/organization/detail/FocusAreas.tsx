"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target } from "lucide-react"

interface FocusAreasProps {
  topics?: string[] | null
}

export default function FocusAreas({ topics }: FocusAreasProps) {
  if (!topics || topics.length === 0) return null

  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <Target className="w-6 h-6 text-slate-600" />
          Focus Areas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {topics.map((topic) => (
            <Badge
              key={topic}
              variant="outline"
              className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 px-4 py-2 text-sm font-medium"
            >
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code } from "lucide-react"

interface TechStackProps {
  techStack?: string[] | null
}

export default function TechStack({ techStack }: TechStackProps) {
  if (!techStack || techStack.length === 0) return null

  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <Code className="w-6 h-6 text-slate-600" />
          Technologies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {techStack.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 text-sm font-medium border border-slate-200"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

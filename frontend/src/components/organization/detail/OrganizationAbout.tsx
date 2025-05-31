"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface OrganizationAboutProps {
  description?: string | null
}

export default function OrganizationAbout({ description }: OrganizationAboutProps) {
  if (!description) return null

  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-slate-600" />
          About
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">{description}</p>
      </CardContent>
    </Card>
  )
}

"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface Organization {
  name: string
  imageUrl?: string | null
  category?: string | null
}

interface SimilarOrganizationsProps {
  organizations: Organization[]
}

export default function SimilarOrganizations({ organizations }: SimilarOrganizationsProps) {
  if (organizations.length === 0) return null

  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-800">Similar Organizations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {organizations.map((org) => (
            <Link key={org.name} href={`/organization/${encodeURIComponent(org.name)}`} className="block">
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 transition-all duration-200 border border-slate-100 hover:border-slate-200 hover:shadow-sm">
                {org.imageUrl && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center p-2">
                    <Image
                      src={org.imageUrl || "/placeholder.svg"}
                      alt={org.name}
                      width={48}
                      height={48}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{org.name}</h3>
                  <p className="text-sm text-slate-500 truncate">{org.category}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </Link>
          ))}

          <Link href="/" className="block">
            <div className="text-center p-4 text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 rounded-lg transition-colors">
              View all organizations →
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

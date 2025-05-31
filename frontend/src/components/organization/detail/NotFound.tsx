"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Organization not found</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The organization you're looking for doesn't exist or has been removed from our database.
          </p>
          <Link href="/">
            <Button className="gap-2 bg-slate-900 hover:bg-slate-800">
              <Home className="h-4 w-4" />
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

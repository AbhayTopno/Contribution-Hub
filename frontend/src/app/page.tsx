"use client"

import { useState } from "react"
import { Search, Filter, Code, Users, Globe, Star, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

// Mock data for organizations
const organizations = [
  {
    id: 1,
    name: "React",
    category: "Frontend Framework",
    logo: "/placeholder.svg?height=60&width=60",
    techStack: ["JavaScript", "TypeScript", "JSX"],
    contributors: "1.2k",
    stars: "220k",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Node.js",
    category: "Backend Runtime",
    logo: "/placeholder.svg?height=60&width=60",
    techStack: ["JavaScript", "C++", "Python"],
    contributors: "3.1k",
    stars: "104k",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    name: "PostgreSQL",
    category: "Database",
    logo: "/placeholder.svg?height=60&width=60",
    techStack: ["C", "SQL", "PL/pgSQL"],
    contributors: "890",
    stars: "15k",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    name: "Docker",
    category: "DevOps",
    logo: "/placeholder.svg?height=60&width=60",
    techStack: ["Go", "Shell", "Dockerfile"],
    contributors: "2.8k",
    stars: "68k",
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    id: 5,
    name: "Kubernetes",
    category: "Container Orchestration",
    logo: "/placeholder.svg?height=60&width=60",
    techStack: ["Go", "YAML", "Shell"],
    contributors: "6.2k",
    stars: "108k",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: 6,
    name: "TensorFlow",
    category: "Machine Learning",
    logo: "/placeholder.svg?height=60&width=60",
    techStack: ["Python", "C++", "CUDA"],
    contributors: "4.5k",
    stars: "185k",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: 7,
    name: "Vue.js",
    category: "Frontend Framework",
    logo: "/placeholder.svg?height=60&width=60",
    techStack: ["JavaScript", "TypeScript", "Vue"],
    contributors: "440",
    stars: "207k",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: 8,
    name: "MongoDB",
    category: "Database",
    logo: "/placeholder.svg?height=60&width=60",
    techStack: ["C++", "JavaScript", "Python"],
    contributors: "1.8k",
    stars: "26k",
    gradient: "from-green-600 to-lime-500",
  },
  {
    id: 9,
    name: "Redis",
    category: "Cache/Database",
    logo: "/placeholder.svg?height=60&width=60",
    techStack: ["C", "Lua", "TCL"],
    contributors: "650",
    stars: "66k",
    gradient: "from-red-500 to-rose-500",
  },
]

const categories = [
  "All",
  "Frontend Framework",
  "Backend Runtime",
  "Database",
  "DevOps",
  "Container Orchestration",
  "Machine Learning",
  "Cache/Database",
]

const topics = [
  "All Topics",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "DevOps & Infrastructure",
  "AI & Machine Learning",
  "Blockchain",
  "Game Development",
]

const techStacks = [
  "All Tech",
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C++",
  "React",
  "Vue",
  "Angular",
  "Node.js",
]

export default function ContributionHub() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTopic, setSelectedTopic] = useState("All Topics")
  const [selectedTech, setSelectedTech] = useState("All Tech")

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.techStack.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || org.category === selectedCategory
    const matchesTech =
      selectedTech === "All Tech" ||
      org.techStack.some((tech) => tech.toLowerCase().includes(selectedTech.toLowerCase()))

    return matchesSearch && matchesCategory && matchesTech
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Contribution Hub
              </span>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-1 items-center justify-center space-x-4 px-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search organizations, categories, or tech stack..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-11 border-0 bg-white/70 backdrop-blur-sm shadow-md rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 h-11 px-4 bg-white/70 backdrop-blur-sm border-0 shadow-md rounded-xl hover:bg-white hover:shadow-lg transition-all"
                    >
                      <Filter className="h-4 w-4" />
                      {selectedCategory}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white/95 backdrop-blur-md border-0 shadow-xl rounded-xl"
                  >
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="cursor-pointer rounded-lg hover:bg-purple-50"
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 h-11 px-4 bg-white/70 backdrop-blur-sm border-0 shadow-md rounded-xl hover:bg-white hover:shadow-lg transition-all"
                    >
                      Topic
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white/95 backdrop-blur-md border-0 shadow-xl rounded-xl"
                  >
                    {topics.map((topic) => (
                      <DropdownMenuItem
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className="cursor-pointer rounded-lg hover:bg-purple-50"
                      >
                        {topic}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 h-11 px-4 bg-white/70 backdrop-blur-sm border-0 shadow-md rounded-xl hover:bg-white hover:shadow-lg transition-all"
                    >
                      Tech Stack
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white/95 backdrop-blur-md border-0 shadow-xl rounded-xl"
                  >
                    {techStacks.map((tech) => (
                      <DropdownMenuItem
                        key={tech}
                        onClick={() => setSelectedTech(tech)}
                        className="cursor-pointer rounded-lg hover:bg-purple-50"
                      >
                        {tech}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>12k+ Contributors</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent mb-4">
            Discover Amazing Organizations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find open source projects and organizations to contribute to. Join a community of developers making a
            difference.
          </p>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== "All" || selectedTopic !== "All Topics" || selectedTech !== "All Tech") && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCategory !== "All" && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Category: {selectedCategory}
              </Badge>
            )}
            {selectedTopic !== "All Topics" && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Topic: {selectedTopic}
              </Badge>
            )}
            {selectedTech !== "All Tech" && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Tech: {selectedTech}
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Showing {filteredOrganizations.length} organization{filteredOrganizations.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Organizations Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredOrganizations.map((org) => (
            <Card
              key={org.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden"
            >
              <CardHeader className="pb-4 relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${org.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
                />
                <div className="flex items-center space-x-4 relative z-10">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${org.gradient} shadow-lg`}
                  >
                    <Image
                      src={org.logo || "/placeholder.svg"}
                      alt={`${org.name} logo`}
                      width={28}
                      height={28}
                      className="rounded filter brightness-0 invert"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate text-gray-900">{org.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{org.category}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{org.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitBranch className="h-4 w-4 text-green-500" />
                    <span>{org.contributors}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1">
                    {org.techStack.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  className={`w-full bg-gradient-to-r ${org.gradient} hover:shadow-lg transition-all duration-300 border-0 text-white font-medium rounded-xl`}
                  size="sm"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Start Contributing
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredOrganizations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-6">
              <Globe className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No organizations found</h3>
            <p className="text-gray-600 text-center max-w-md">
              Try adjusting your search terms or filters to find more organizations to contribute to.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

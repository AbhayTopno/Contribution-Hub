'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface FilterBarProps {
  categories: string[];
  techStacks: string[];
  topics: string[];
  selectedCategory: string | null;
  selectedTechStack: string | null;
  selectedTopic: string | null;
  onSelectCategory: (category: string | null) => void;
  onSelectTechStack: (techStack: string | null) => void;
  onSelectTopic: (topic: string | null) => void;
  onResetFilters: () => void;
  loading?: boolean;
}

export default function FilterBar({
  categories,
  techStacks,
  topics,
  selectedCategory,
  selectedTechStack,
  selectedTopic,
  onSelectCategory,
  onSelectTechStack,
  onSelectTopic,
  onResetFilters,
  loading = false,
}: FilterBarProps) {
  const [categorySearch, setCategorySearch] = useState('');
  const [techStackSearch, setTechStackSearch] = useState('');
  const [topicSearch, setTopicSearch] = useState('');

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredTechStacks = techStacks.filter((tech) =>
    tech.toLowerCase().includes(techStackSearch.toLowerCase())
  );

  const filteredTopics = topics.filter((topic) =>
    topic.toLowerCase().includes(topicSearch.toLowerCase())
  );

  const hasActiveFilters =
    selectedCategory || selectedTechStack || selectedTopic;
  const activeFilterCount = [
    selectedCategory,
    selectedTechStack,
    selectedTopic,
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`bg-white border-gray-300 hover:border-gray-400 ${
                    selectedCategory ? 'border-black bg-gray-100' : ''
                  }`}
                  disabled={categories.length === 0}
                >
                  Category
                  {selectedCategory && (
                    <Badge
                      variant="secondary"
                      className="ml-2 px-1 py-0 text-xs"
                    >
                      1
                    </Badge>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredCategories.length === 0 ? (
                    <div className="text-gray-500 text-sm p-2">
                      No categories found
                    </div>
                  ) : (
                    filteredCategories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() =>
                          onSelectCategory(
                            selectedCategory === category ? null : category
                          )
                        }
                        className={`cursor-pointer ${
                          selectedCategory === category
                            ? 'bg-gray-100 font-medium'
                            : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full border mr-3 ${
                              selectedCategory === category
                                ? 'bg-black border-black'
                                : 'border-gray-300'
                            }`}
                          />
                          {category}
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tech Stack Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`bg-white border-gray-300 hover:border-gray-400 ${
                    selectedTechStack ? 'border-black bg-gray-100' : ''
                  }`}
                  disabled={techStacks.length === 0}
                >
                  Technology
                  {selectedTechStack && (
                    <Badge
                      variant="secondary"
                      className="ml-2 px-1 py-0 text-xs"
                    >
                      1
                    </Badge>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search technologies..."
                    value={techStackSearch}
                    onChange={(e) => setTechStackSearch(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredTechStacks.length === 0 ? (
                    <div className="text-gray-500 text-sm p-2">
                      No technologies found
                    </div>
                  ) : (
                    filteredTechStacks.map((tech) => (
                      <DropdownMenuItem
                        key={tech}
                        onClick={() =>
                          onSelectTechStack(
                            selectedTechStack === tech ? null : tech
                          )
                        }
                        className={`cursor-pointer ${
                          selectedTechStack === tech
                            ? 'bg-gray-100 font-medium'
                            : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full border mr-3 ${
                              selectedTechStack === tech
                                ? 'bg-black border-black'
                                : 'border-gray-300'
                            }`}
                          />
                          {tech}
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Topic Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`bg-white border-gray-300 hover:border-gray-400 ${
                    selectedTopic ? 'border-black bg-gray-100' : ''
                  }`}
                  disabled={topics.length === 0}
                >
                  Topic
                  {selectedTopic && (
                    <Badge
                      variant="secondary"
                      className="ml-2 px-1 py-0 text-xs"
                    >
                      1
                    </Badge>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search topics..."
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredTopics.length === 0 ? (
                    <div className="text-gray-500 text-sm p-2">
                      No topics found
                    </div>
                  ) : (
                    filteredTopics.map((topic) => (
                      <DropdownMenuItem
                        key={topic}
                        onClick={() =>
                          onSelectTopic(selectedTopic === topic ? null : topic)
                        }
                        className={`cursor-pointer ${
                          selectedTopic === topic
                            ? 'bg-gray-100 font-medium'
                            : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full border mr-3 ${
                              selectedTopic === topic
                                ? 'bg-black border-black'
                                : 'border-gray-300'
                            }`}
                          />
                          {topic}
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onResetFilters}
              className="bg-white border-gray-300 hover:border-gray-400 text-gray-600 hover:text-black"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset filters
              <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                {activeFilterCount}
              </Badge>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

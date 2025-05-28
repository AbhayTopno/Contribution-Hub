'use client';

import { Inter } from 'next/font/google';
import Navbar from '@/components/organization/Navbar';
import FilterBar from '@/components/organization/FilterBar';
import LoadingState from '@/components/organization/LoadingState';
import ErrorState from '@/components/organization/ErrorState';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type React from 'react';
import { useQuery } from '@apollo/client';
import OrganizationGrid from '@/components/organization/OrganizationGrid';
import {
  GET_ORGANIZATIONS,
  GET_FILTER_OPTIONS,
} from '@/queries/getOrganizations';
import type {
  OrganizationsQueryVariables,
  OrganizationsData,
  FilterOptionsData,
} from '@/types/organization';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const OrganizationList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTechStack, setSelectedTechStack] = useState<string | null>(
    null
  );
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Fetch filter options
  const {
    data: filterOptionsData,
    loading: filterOptionsLoading,
    error: filterOptionsError,
  } = useQuery<FilterOptionsData>(GET_FILTER_OPTIONS);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTechStack, selectedTopic]);

  const { loading, error, data } = useQuery<
    OrganizationsData,
    OrganizationsQueryVariables
  >(GET_ORGANIZATIONS, {
    variables: {
      search: debouncedSearchTerm || undefined,
      category: selectedCategory || undefined,
      techStack: selectedTechStack ? [selectedTechStack] : undefined,
      topic: selectedTopic ? [selectedTopic] : undefined,
      offset: (currentPage - 1) * pageSize,
      limit: pageSize,
    },
  });

  const hasNextPage = data && data.organizations.length === pageSize;
  const hasPrevPage = currentPage > 1;

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);

    const maxPages = hasNextPage ? currentPage + 1 : currentPage;
    const endPage = Math.min(maxPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedTechStack(null);
    setSelectedTopic(null);
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  const getFilterDescription = () => {
    const filters = [];
    if (selectedCategory) filters.push(`category "${selectedCategory}"`);
    if (selectedTechStack) filters.push(`technology "${selectedTechStack}"`);
    if (selectedTopic) filters.push(`topic "${selectedTopic}"`);
    if (debouncedSearchTerm) filters.push(`search "${debouncedSearchTerm}"`);

    return filters.length > 0 ? ` with ${filters.join(', ')}` : '';
  };

  // Show error if filter options failed to load
  if (filterOptionsError) {
    return (
      <div className={`min-h-screen bg-white text-black ${inter.className}`}>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState error={filterOptionsError} />
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white text-black ${inter.className}`}>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FilterBar
        categories={filterOptionsData?.allCategories || []}
        techStacks={filterOptionsData?.allTechStacks || []}
        topics={filterOptionsData?.allTopics || []}
        selectedCategory={selectedCategory}
        selectedTechStack={selectedTechStack}
        selectedTopic={selectedTopic}
        onSelectCategory={setSelectedCategory}
        onSelectTechStack={setSelectedTechStack}
        onSelectTopic={setSelectedTopic}
        onResetFilters={handleResetFilters}
        loading={filterOptionsLoading}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <LoadingState />}
        {error && <ErrorState error={error} />}
        {data && (
          <>
            {(debouncedSearchTerm ||
              selectedCategory ||
              selectedTechStack ||
              selectedTopic) && (
              <div className="mb-6">
                <p className="text-gray-600">
                  {data.organizations.length > 0
                    ? `Found ${data.organizations.length} organization${
                        data.organizations.length === 1 ? '' : 's'
                      }${getFilterDescription()}`
                    : `No organizations found${getFilterDescription()}`}
                </p>
              </div>
            )}
            <OrganizationGrid organizations={data.organizations} />
            {data.organizations.length === 0 &&
              !debouncedSearchTerm &&
              !selectedCategory &&
              !selectedTechStack &&
              !selectedTopic && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No organizations found
                  </p>
                </div>
              )}
            {data.organizations.length > 0 && (hasPrevPage || hasNextPage) && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {hasPrevPage && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          className="cursor-pointer text-black hover:bg-black hover:text-white"
                        />
                      </PaginationItem>
                    )}
                    {getPageNumbers().map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className={`cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-black text-white '
                              : 'text-black'
                          }`}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {hasNextPage && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                          className="cursor-pointer text-black hover:bg-black hover:text-white"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default OrganizationList;

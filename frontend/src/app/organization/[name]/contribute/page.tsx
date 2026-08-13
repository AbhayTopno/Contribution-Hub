'use client';

import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_ORGANIZATION } from '@/queries/getOrganizations';
import { GET_GITHUB_REPOS } from '@/queries/getOrganizations';
import { useParams } from 'next/navigation';
import { Inter } from 'next/font/google';
import { githubClient } from '@/lib/apolloClient';
import ContributeHero from '@/components/organization/contribute/ContributeHero';
import RepositoryGrid from '@/components/organization/contribute/RepositoryGrid';
import ContributeLoading from '@/components/organization/contribute/ContributeLoading';
import ContributeError from '@/components/organization/contribute/ContributeError';
import NotFound from '@/components/organization/detail/NotFound';
import BreadcrumbNav from '@/components/common/BreadcrumbNav';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type {
  GitHubReposData,
  GitHubReposQueryVariables,
} from '@/types/organization';

const inter = Inter({ subsets: ['latin'] });
const PAGE_SIZE = 9;

export default function ContributePage() {
  const params = useParams();
  const organizationName = decodeURIComponent(params.name as string);
  const [currentPage, setCurrentPage] = useState(1);

  // Get organization details
  const {
    loading: orgLoading,
    error: orgError,
    data: orgData,
  } = useQuery(GET_ORGANIZATION, {
    variables: { name: organizationName },
  });

  // Get GitHub repositories
  const {
    loading: reposLoading,
    error: reposError,
    data: reposData,
  } = useQuery<GitHubReposData, GitHubReposQueryVariables>(GET_GITHUB_REPOS, {
    variables: {
      githubUrl: orgData?.organization?.githubUrl || '',
      limit: PAGE_SIZE,
      offset: (currentPage - 1) * PAGE_SIZE,
    },
    client: githubClient,
    skip: !orgData?.organization?.githubUrl,
  });

  if (orgLoading) return <ContributeLoading />;
  if (orgError) return <ContributeError error={orgError} />;
  if (!orgData?.organization) return <NotFound />;
  if (!orgData.organization.githubUrl) {
    return (
      <ContributeError
        error={new Error('No GitHub URL available for this organization')}
      />
    );
  }

  const organization = orgData.organization;
  const repositories = reposData?.githubRepos?.repositories || [];
  const totalCount = reposData?.githubRepos?.totalCount || 0;
  const hasNextPage = reposData?.githubRepos?.hasNextPage || false;
  const hasPrevPage = currentPage > 1;

  const totalStars = reposData?.githubRepos?.totalStars || 0;
  const totalForks = reposData?.githubRepos?.totalForks || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ${inter.className}`}
    >
      <BreadcrumbNav organizationName={organization.name} />
      <div className="max-w-7xl mx-auto p-4">
        <ContributeHero
          organization={organization}
          loading={reposLoading}
          repositoryCount={totalCount}
          totalStars={totalStars}
          totalForks={totalForks}
        />

        {reposLoading && <ContributeLoading />}
        {reposError && <ContributeError error={reposError} />}
        {reposData && (
          <div className="mb-8">
            <RepositoryGrid repositories={repositories} />
            {repositories.length > 0 && (hasPrevPage || hasNextPage) && (
              <div className="mt-8 flex justify-center pb-8">
                <Pagination>
                  <PaginationContent>
                    {hasPrevPage && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                    {getPageNumbers().map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {hasNextPage && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

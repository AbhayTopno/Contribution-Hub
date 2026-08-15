'use client';

import { useQuery } from '@apollo/client';
import { useLayoutEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, User, Tag, X, ChevronDown } from 'lucide-react';
import type { RepoIssuesData, RepoIssuesVariables } from '@/types/repository';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { GET_REPOSITORY_ISSUES } from '@/queries/getRepositoryInfo';
import { repoClient } from '@/lib/apolloClient';

interface IssuesSectionProps {
  repoUrl: string;
}

const PAGE_SIZE = 10;

function IssuesSkeleton() {
  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse mb-3" />
              <div className="h-3 w-1/3 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function IssuesSection({ repoUrl }: IssuesSectionProps) {
  const [selectedIssueType, setSelectedIssueType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const hasAutoSelected = useRef(false);

  const { loading, error, data, previousData } = useQuery<
    RepoIssuesData,
    RepoIssuesVariables
  >(GET_REPOSITORY_ISSUES, {
    variables: {
      url: repoUrl,
      issueType: selectedIssueType || undefined,
      limit: PAGE_SIZE,
      offset: (currentPage - 1) * PAGE_SIZE,
    },
    client: repoClient,
    skip: !repoUrl,
  });

  // Only page N's data is ever fetched (on-demand); keep rendering the
  // previous page while the next one loads instead of blanking the list.
  const view = data ?? previousData;
  const isPageTransition = loading && !!previousData;

  const byLabel = view?.repoInfo?.issueCounts?.byLabel || [];
  const issues = view?.repoInfo?.issues?.issues || [];
  const totalCount = view?.repoInfo?.issues?.totalCount || 0;
  const hasNextPage = view?.repoInfo?.issues?.hasNextPage || false;
  const hasPrevPage = currentPage > 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const issueTypes = byLabel.map((l) => l.name).slice(0, 10);

  // Auto-select "good first issue" once labels are known, before paint to avoid a flash of the unfiltered list.
  useLayoutEffect(() => {
    if (hasAutoSelected.current || byLabel.length === 0) return;
    hasAutoSelected.current = true;

    const goodFirstIssueLabel = byLabel
      .map((l) => l.name)
      .find(
        (name) =>
          name.toLowerCase().includes('good first issue') ||
          name.toLowerCase().includes('good-first-issue')
      );

    if (goodFirstIssueLabel) {
      setSelectedIssueType(goodFirstIssueLabel);
    }
  }, [byLabel]);

  useLayoutEffect(() => {
    setVisible(false);
    if (view) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [view]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const labelCounts = byLabel.reduce((acc, label) => {
    acc[label.name] = label.count;
    return acc;
  }, {} as Record<string, number>);

  const handleIssueTypeChange = (issueType: string) => {
    setSelectedIssueType(issueType);
    setCurrentPage(1);
  };

  const handleClearFilter = () => handleIssueTypeChange('');

  const handleDropdownFilterSelect = (issueType: string) => {
    if (issueType === selectedIssueType) {
      handleClearFilter();
    } else {
      handleIssueTypeChange(issueType);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (loading && !view) return <IssuesSkeleton />;

  if (error) {
    return (
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">Unable to load issues.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              Issues
            </CardTitle>
            <span className="text-lg text-slate-900 font-bold mt-[0.2rem]">
              ({totalCount})
            </span>
          </div>

          {/* Filter Dropdown - Top Right */}
          {issueTypes.length > 0 && (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-500 gap-2 min-w-[140px] justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span className="truncate">
                        {selectedIssueType || 'All Issues'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto bg-white/80 backdrop-blur-sm border-b border-gray-100 text-slate-800 shadow-lg">
                  <DropdownMenuItem
                    onClick={handleClearFilter}
                    className={`cursor-pointer ${
                      !selectedIssueType
                        ? 'bg-slate-700 text-white font-medium'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>All Issues</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {issueTypes.map((issueType) => (
                    <DropdownMenuItem
                      key={issueType}
                      onClick={() => handleDropdownFilterSelect(issueType)}
                      className={`cursor-pointer ${
                        selectedIssueType === issueType
                          ? 'bg-slate-100 font-medium'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate mr-2">{issueType}</span>
                        <Badge
                          variant="secondary"
                          className="text-xs flex-shrink-0"
                        >
                          {labelCounts[issueType] || 0}
                        </Badge>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedIssueType && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilter}
                  className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-8 w-8 p-0 rounded-full cursor-pointer"
                  title="Clear filter"
                >
                  <X className="w-4 h-4 hover:text-red-600" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Issues List */}
        {issues.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg mb-2">
              {selectedIssueType
                ? `No issues found with label "${selectedIssueType}"`
                : 'No issues available'}
            </p>
            {selectedIssueType && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilter}
                className="text-slate-600 hover:text-slate-800 bg-transparent cursor-pointer"
              >
                View all issues
              </Button>
            )}
          </div>
        ) : (
          <div
            className={`space-y-4 transition-opacity duration-300 ease-out ${
              visible && !isPageTransition ? 'opacity-100' : 'opacity-60'
            }`}
          >
            {issues.map((issue, index) => (
              <a
                key={index}
                href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-100 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 mb-2 line-clamp-2">
                      {issue.title}
                    </h4>

                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(issue.createdAt)}</span>
                      </div>
                      {issue.assignees && issue.assignees.length > 0 && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <div className="flex items-center gap-1">
                            {issue.assignees
                              .slice(0, 3)
                              .map((assignee, assigneeIndex) => (
                                <Image
                                  key={assigneeIndex}
                                  src={
                                    assignee.avatarUrl ||
                                    '/placeholder.svg?height=20&width=20'
                                  }
                                  alt={assignee.login}
                                  width={20}
                                  height={20}
                                  className="rounded-full"
                                  title={assignee.login}
                                />
                              ))}
                            {issue.assignees.length > 3 && (
                              <span className="text-xs text-slate-500 ml-1">
                                +{issue.assignees.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {issue.labels && issue.labels.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-slate-500" />
                        <div className="flex flex-wrap gap-1">
                          {issue.labels.slice(0, 5).map((label, labelIndex) => (
                            <Badge
                              key={labelIndex}
                              variant="secondary"
                              className={`text-xs cursor-pointer transition-colors ${
                                selectedIssueType === label.name
                                  ? 'bg-slate-800 text-white'
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleIssueTypeChange(label.name);
                              }}
                            >
                              {label.name}
                            </Badge>
                          ))}
                          {issue.labels.length > 5 && (
                            <Badge
                              variant="secondary"
                              className="text-xs cursor-pointer"
                            >
                              +{issue.labels.length - 5}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {issues.length > 0 && (hasPrevPage || hasNextPage) && (
          <div className="mt-6 flex justify-center">
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
      </CardContent>
    </Card>
  );
}

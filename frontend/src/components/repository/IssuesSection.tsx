'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, User, Tag, X, ChevronDown } from 'lucide-react';
import type { Issue } from '@/types/repository';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface IssuesSectionProps {
  issues: Issue[];
  allIssues: Issue[];
  selectedIssueType?: string;
  issueTypes: string[];
  onIssueTypeChange: (issueType: string) => void;
}

export default function IssuesSection({
  issues,
  allIssues,
  selectedIssueType,
  issueTypes,
  onIssueTypeChange,
}: IssuesSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredIssues = selectedIssueType
    ? issues.filter((issue) =>
        issue.labels?.some((label) => label.name === selectedIssueType)
      )
    : issues;

  // Calculate label counts from ALL issues (original unfiltered data)
  const labelCounts = issueTypes.reduce((acc, label) => {
    const count = allIssues.filter((issue) =>
      issue.labels?.some((issueLabel) => issueLabel.name === label)
    ).length;
    acc[label] = count;
    return acc;
  }, {} as Record<string, number>);

  const handleClearFilter = () => {
    console.log(
      'Clearing filter, current selectedIssueType:',
      selectedIssueType
    ); // Debug log
    onIssueTypeChange('');
  };

  // Separate handler for dropdown menu items
  const handleDropdownFilterSelect = (issueType: string) => {
    if (issueType === selectedIssueType) {
      // If clicking the same filter in dropdown, clear it
      handleClearFilter();
    } else {
      // Otherwise, apply the new filter
      onIssueTypeChange(issueType);
    }
  };

  // Handler for label badges - always applies the filter
  const handleLabelBadgeClick = (issueType: string) => {
    console.log('Label badge clicked:', issueType); // Debug log
    onIssueTypeChange(issueType);
  };

  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              Issues
            </CardTitle>
            <span className="text-lg text-slate-900 font-bold mt-[0.2rem]">
              ({filteredIssues.length})
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
                      <Badge variant="secondary" className="text-xs">
                        {allIssues.length}
                      </Badge>
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
        {filteredIssues.length === 0 ? (
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
          <div className="space-y-4">
            {filteredIssues.map((issue, index) => (
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
                                    '/placeholder.svg?height=20&width=20' ||
                                    '/placeholder.svg'
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
                                handleLabelBadgeClick(label.name);
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
      </CardContent>
    </Card>
  );
}

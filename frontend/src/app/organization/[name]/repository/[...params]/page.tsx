'use client';

import { useQuery } from '@apollo/client';
import { GET_REPO_INFO } from '@/queries/getRepositoryInfo';
import { useParams } from 'next/navigation';
import { Inter } from 'next/font/google';
import { repoClient } from '@/lib/apolloClient';
import type {
  RepoInfoData,
  RepoInfoVariables,
  ContributorPeriodEnum,
} from '@/types/repository';
import RepositoryHero from '@/components/repository/RepositoryHero';
import ContributorsSection from '@/components/repository/ContributorsSection';
import IssuesSection from '@/components/repository/IssuesSection';
import RepositoryLoading from '@/components/repository/RepositoryLoading';
import RepositoryError from '@/components/repository/RepositoryError';
import BreadcrumbNav from '@/components/common/BreadcrumbNav';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RepositoryPage() {
  const params = useParams();
  const [selectedIssueType, setSelectedIssueType] = useState<string>('');
  const [contributorPeriod, setContributorPeriod] =
    useState<ContributorPeriodEnum>('THIS_MONTH');
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [allIssues, setAllIssues] = useState<any[]>([]);

  // Extract organization name and repository params
  const organizationName = decodeURIComponent(params.name as string);
  const repoUrl = params.params
    ? `https://github.com/${(params.params as string[]).join('/')}`
    : '';

  const { loading, error, data, refetch } = useQuery<
    RepoInfoData,
    RepoInfoVariables
  >(GET_REPO_INFO, {
    variables: {
      url: repoUrl,
      limit: 10,
      issueType: selectedIssueType,
      period: contributorPeriod,
    },
    client: repoClient,
    skip: !repoUrl,
  });

  // Store all issues when we first load them (without any filter)
  useEffect(() => {
    if (data?.repoInfo?.issues && allIssues.length === 0) {
      setAllIssues(data.repoInfo.issues);
    }
  }, [data, allIssues.length]);

  // Set default issue type to "good first issue" if available - only run once
  useEffect(() => {
    if (allIssues.length > 0 && !hasAutoSelected) {
      const hasGoodFirstIssue = allIssues.some((issue) =>
        issue.labels?.some(
          (label) =>
            label.name.toLowerCase().includes('good first issue') ||
            label.name.toLowerCase().includes('good-first-issue')
        )
      );

      if (hasGoodFirstIssue) {
        const goodFirstIssueLabel = Array.from(
          new Set(
            allIssues.flatMap((issue) =>
              (issue.labels || []).map((label) => label.name)
            )
          )
        ).find(
          (label) =>
            label.toLowerCase().includes('good first issue') ||
            label.toLowerCase().includes('good-first-issue')
        );

        if (goodFirstIssueLabel) {
          setSelectedIssueType(goodFirstIssueLabel);
          setHasAutoSelected(true);
        }
      } else {
        setHasAutoSelected(true);
      }
    }
  }, [allIssues, hasAutoSelected]);

  if (!repoUrl) {
    return <RepositoryError error={new Error('Repository URL is required')} />;
  }

  if (loading) return <RepositoryLoading />;
  if (error) return <RepositoryError error={error} />;
  if (!data?.repoInfo) {
    return (
      <RepositoryError error={new Error('Repository information not found')} />
    );
  }

  const { repoInfo } = data;
  const repoName = repoUrl.split('/').pop() || 'Repository';
  const orgName = repoUrl.split('/').slice(-2, -1)[0] || 'Organization';

  // Get unique issue types from ALL issues (not filtered)
  const issueTypes = Array.from(
    new Set(
      allIssues.flatMap((issue) =>
        (issue.labels || []).map((label) => label.name)
      )
    )
  ).slice(0, 10); // Limit to first 10 types

  const handleIssueTypeChange = (issueType: string) => {
    console.log(
      'Changing issue type from:',
      selectedIssueType,
      'to:',
      issueType
    ); // Debug log

    // Update the selected issue type
    setSelectedIssueType(issueType);

    // Refetch with the new filter
    refetch({
      url: repoUrl,
      limit: 10,
      issueType: issueType,
      period: contributorPeriod,
    })
      .then(() => {
        console.log('Refetch completed for issue type:', issueType); // Debug log
      })
      .catch((err) => {
        console.error('Refetch error:', err); // Debug log
      });
  };

  const handlePeriodChange = (period: ContributorPeriodEnum) => {
    setContributorPeriod(period);
    refetch({
      url: repoUrl,
      limit: 10,
      issueType: selectedIssueType,
      period: period,
    });
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ${inter.className}`}
    >
      <BreadcrumbNav
        organizationName={organizationName}
        repositoryName={repoName}
      />
      <div className="max-w-7xl mx-auto p-6">
        <RepositoryHero
          repoUrl={repoUrl}
          repoName={repoName}
          orgName={orgName}
          stats={repoInfo.stats}
          issueCounts={repoInfo.issueCounts}
        />

        {/* Responsive Layout: Issues full width on mobile, Contributors below */}
        <div className="mt-8">
          {/* Issues Section - Full width on mobile, 70% on desktop */}
          <div className="w-full lg:w-[70%] lg:pr-8 mb-8 lg:mb-0 lg:float-left">
            <IssuesSection
              issues={repoInfo.issues || []}
              allIssues={allIssues}
              selectedIssueType={selectedIssueType}
              issueTypes={issueTypes}
              onIssueTypeChange={handleIssueTypeChange}
            />
          </div>

          {/* Contributors Section - Full width on mobile (below issues), 30% on desktop */}
          <div className="w-full lg:w-[30%] lg:float-right">
            <ContributorsSection
              contributors={repoInfo.contributors || []}
              period={contributorPeriod}
              onPeriodChange={handlePeriodChange}
            />
          </div>

          {/* Clear float */}
          <div className="clear-both"></div>
        </div>
      </div>
    </div>
  );
}

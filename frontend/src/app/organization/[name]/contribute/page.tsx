'use client';

import { useQuery } from '@apollo/client';
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

const inter = Inter({ subsets: ['latin'] });

export default function ContributePage() {
  const params = useParams();
  const organizationName = decodeURIComponent(params.name as string);

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
  } = useQuery(GET_GITHUB_REPOS, {
    variables: { githubUrl: orgData?.organization?.githubUrl || '' },
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

  const totalStars =
    reposData?.githubRepos?.reduce((sum, repo) => sum + repo.stars, 0) || 0;
  const totalForks =
    reposData?.githubRepos?.reduce((sum, repo) => sum + repo.forks, 0) || 0;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ${inter.className}`}
    >
      <BreadcrumbNav organizationName={organization.name} />
      <div className="max-w-7xl mx-auto p-4">
        <ContributeHero
          organization={organization}
          loading={reposLoading}
          repositoryCount={reposData?.githubRepos?.length || 0}
          totalStars={totalStars}
          totalForks={totalForks}
        />

        {reposLoading && <ContributeLoading />}
        {reposError && <ContributeError error={reposError} />}
        {reposData && (
          <div className="mb-8">
            <RepositoryGrid repositories={reposData.githubRepos} />
          </div>
        )}
      </div>
    </div>
  );
}

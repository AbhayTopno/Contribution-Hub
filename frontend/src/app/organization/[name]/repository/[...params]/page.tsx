'use client';

import { useParams } from 'next/navigation';
import { Inter } from 'next/font/google';
import RepositoryHero from '@/components/repository/RepositoryHero';
import ContributorsSection from '@/components/repository/ContributorsSection';
import IssuesSection from '@/components/repository/IssuesSection';
import RepositoryError from '@/components/repository/RepositoryError';
import BreadcrumbNav from '@/components/common/BreadcrumbNav';

const inter = Inter({ subsets: ['latin'] });

export default function RepositoryPage() {
  const params = useParams();

  // Extract organization name and repository params
  const organizationName = decodeURIComponent(params.name as string);
  const repoUrl = params.params
    ? `https://github.com/${(params.params as string[]).join('/')}`
    : '';

  if (!repoUrl) {
    return <RepositoryError error={new Error('Repository URL is required')} />;
  }

  const repoName = repoUrl.split('/').pop() || 'Repository';
  const orgName = repoUrl.split('/').slice(-2, -1)[0] || 'Organization';

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ${inter.className}`}
    >
      <BreadcrumbNav
        organizationName={organizationName}
        repositoryName={repoName}
      />
      <div className="max-w-7xl mx-auto p-6">
        <RepositoryHero repoUrl={repoUrl} repoName={repoName} orgName={orgName} />

        {/* Each section fetches and renders independently */}
        <div className="mt-8">
          <div className="w-full lg:w-[70%] lg:pr-8 mb-8 lg:mb-0 lg:float-left">
            <IssuesSection repoUrl={repoUrl} />
          </div>

          <div className="w-full lg:w-[30%] lg:float-right">
            <ContributorsSection repoUrl={repoUrl} />
          </div>

          {/* Clear float */}
          <div className="clear-both"></div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useQuery } from '@apollo/client';
import {
  GET_ORGANIZATION,
  GET_ORGANIZATIONS,
} from '@/queries/getOrganizations';
import { useParams } from 'next/navigation';
import ErrorState from '@/components/organization/ErrorState';
import { Inter } from 'next/font/google';
import OrganizationHero from '@/components/organization/detail/OrganizationHero';
import OrganizationAbout from '@/components/organization/detail/OrganizationAbout';
import ParticipationChart from '@/components/organization/detail/ParticipationChart';
import TechStack from '@/components/organization/detail/TechStack';
import FocusAreas from '@/components/organization/detail/FocusAreas';
import QuickStats from '@/components/organization/detail/QuickStats';
import YearlyBreakdown from '@/components/organization/detail/YearlyBreakdown';
import SimilarOrganizations from '@/components/organization/detail/SimilarOrganizations';
import DetailSkeleton from '@/components/organization/detail/DetailSkeleton';
import NotFound from '@/components/organization/detail/NotFound';

const inter = Inter({ subsets: ['latin'] });

export default function OrganizationPage() {
  const params = useParams();
  const organizationName = decodeURIComponent(params.name as string);

  const { loading, error, data } = useQuery(GET_ORGANIZATION, {
    variables: { name: organizationName },
  });

  const { data: relatedData } = useQuery(GET_ORGANIZATIONS, {
    variables: {
      category: data?.organization?.category,
      limit: 4,
    },
    skip: !data?.organization?.category,
  });

  if (loading) return <DetailSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!data?.organization) return <NotFound />;

  const organization = data.organization;
  const relatedOrganizations =
    relatedData?.organizations
      ?.filter((org: any) => org.name !== organization.name)
      .slice(0, 3) || [];

  const totalYears = organization.yearlyParticipations.length;
  const avgProjectsPerYear =
    totalYears > 0 ? (organization.totalProjects / totalYears).toFixed(1) : 0;

  const chartData = organization.yearlyParticipations
    .slice()
    .sort((a, b) => a.year - b.year)
    .map((item) => ({
      year: item.year.toString(),
      projects: item.projectCount,
    }));

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ${inter.className}`}
    >
      <div className="max-w-7xl mx-auto p-6">
        <OrganizationHero organization={organization} totalYears={totalYears} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <OrganizationAbout description={organization.description} />
            <ParticipationChart data={chartData} />
            <TechStack techStack={organization.techStack} />
            <FocusAreas topics={organization.topics} />
          </div>

          <div className="space-y-8">
            <QuickStats
              totalProjects={organization.totalProjects}
              totalYears={totalYears}
              avgProjectsPerYear={avgProjectsPerYear}
            />
            <YearlyBreakdown
              participations={organization.yearlyParticipations}
            />
            <SimilarOrganizations organizations={relatedOrganizations} />
          </div>
        </div>
      </div>
    </div>
  );
}

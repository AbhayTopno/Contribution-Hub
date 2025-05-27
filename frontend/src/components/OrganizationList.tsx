'use client';

import { Inter } from 'next/font/google';
import { useQuery } from '@apollo/client';
import { GET_ORGANIZATIONS } from '@/queries/getOrganizations';
import type {
  Organization,
  OrganizationsQueryVariables,
} from '@/types/organization';
import Navbar from '@/components/organization/Navbar';
import FilterBar from '@/components/organization/FilterBar';
import OrganizationGrid from '@/components/organization/OrganizationGrid';
import LoadingState from '@/components/organization/LoadingState';
import ErrorState from '@/components/organization/ErrorState';

const inter = Inter({ subsets: ['latin'] });

export default function ContributionHub() {
  const { loading, error, data } = useQuery<
    { organizations: Organization[] },
    OrganizationsQueryVariables
  >(GET_ORGANIZATIONS, {
    variables: {
      category: undefined,
      techStack: undefined,
      topic: undefined,
      offset: 0,
      limit: 40,
    },
  });

  return (
    <div className={`min-h-screen bg-white text-black ${inter.className}`}>
      <Navbar />

      {!loading && !error && <FilterBar />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <LoadingState />}
        {error && <ErrorState error={error} />}
        {data && (
          <>
            <OrganizationGrid organizations={data.organizations} />
            {data.organizations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No organizations found.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

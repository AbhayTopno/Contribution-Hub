'use client';

import { Organization } from '@/types/organization';
import OrganizationCard from './OrganizationCard';

export default function OrganizationGrid({
  organizations,
}: {
  organizations: Organization[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {organizations.map((org, index) => (
        <OrganizationCard key={`${org.name}-${index}`} org={org} />
      ))}
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface BreadcrumbNavProps {
  organizationName?: string;
}

export default function BreadcrumbNav({
  organizationName,
}: BreadcrumbNavProps) {
  const pathname = usePathname();

  // Don't show breadcrumbs on home page
  if (pathname === '/') {
    return null;
  }

  const pathSegments = pathname.split('/').filter(Boolean);

  const getBreadcrumbItems = () => {
    const items = [];

    // Always start with Home
    items.push(
      <BreadcrumbItem key="home">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-slate-900 transition-colors"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
      </BreadcrumbItem>
    );

    // Handle organization pages
    if (pathSegments[0] === 'organization' && pathSegments[1]) {
      const orgName = decodeURIComponent(pathSegments[1]);

      if (pathSegments.length === 2) {
        // Organization detail page
        items.push(
          <BreadcrumbItem key="organization">
            <BreadcrumbPage className="text-slate-900 font-medium">
              {organizationName || orgName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        );
      } else if (pathSegments[2] === 'contribute') {
        // Contribute page
        items.push(
          <BreadcrumbItem key="organization">
            <Link
              href={`/organization/${encodeURIComponent(orgName)}`}
              className="hover:text-slate-900 transition-colors"
            >
              {organizationName || orgName}
            </Link>
          </BreadcrumbItem>
        );
        items.push(
          <BreadcrumbItem key="contribute">
            <BreadcrumbPage className="text-slate-900 font-medium">
              Contribute
            </BreadcrumbPage>
          </BreadcrumbItem>
        );
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                {item}
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

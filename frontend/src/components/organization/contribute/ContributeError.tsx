'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';

interface ContributeErrorProps {
  error: Error;
}

export default function ContributeError({ error }: ContributeErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Unable to load repositories
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {error.message ||
              'There was an error loading the GitHub repositories for this organization.'}
          </p>
          <Link href="/">
            <Button className="gap-2 bg-slate-900 hover:bg-slate-800">
              <Home className="h-4 w-4" />
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

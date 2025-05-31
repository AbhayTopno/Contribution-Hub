'use client';

import Image from 'next/image';
import { JetBrains_Mono } from 'next/font/google';
import { Badge } from '@/components/ui/badge';
import { Target, Folder, Calendar, Globe, ExternalLink } from 'lucide-react';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

interface OrganizationHeroProps {
  organization: {
    name: string;
    imageUrl?: string | null;
    category?: string | null;
    totalProjects: number;
    url?: string | null;
  };
  totalYears: number;
}

export default function OrganizationHero({
  organization,
  totalYears,
}: OrganizationHeroProps) {
  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950 rounded-2xl p-8 mb-8 shadow-xl">
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {organization.imageUrl && (
          <div className="flex-shrink-0">
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden bg-white border-2 border-white/30 flex items-center justify-center p-4">
              <Image
                src={organization.imageUrl || '/placeholder.svg'}
                alt={organization.name}
                width={128}
                height={128}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="flex-grow">
          <h1
            className={`text-4xl lg:text-5xl font-bold text-white mb-6 ${jetbrainsMono.className}`}
          >
            {organization.name}
          </h1>

          <div className="flex flex-wrap gap-3 mb-6">
            {organization.category && (
              <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 hover:bg-blue-500/30 px-4 py-2 text-sm">
                <Target className="w-4 h-4 mr-2" />
                {organization.category}
              </Badge>
            )}
            <Badge className="bg-green-500/20 text-green-200 border-green-400/30 hover:bg-green-500/30 px-4 py-2 text-sm">
              <Folder className="w-4 h-4 mr-2" />
              {organization.totalProjects} Projects
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 hover:bg-purple-500/30 px-4 py-2 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              {totalYears} Years Active
            </Badge>
          </div>

          {organization.url && (
            <a
              href={organization.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 font-medium transition-colors"
            >
              <Globe className="w-4 h-4" />
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

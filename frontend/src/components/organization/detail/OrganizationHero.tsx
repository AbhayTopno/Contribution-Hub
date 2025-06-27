'use client';

import Image from 'next/image';
import Link from 'next/link';
import { JetBrains_Mono } from 'next/font/google';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Folder,
  Calendar,
  Globe,
  ExternalLink,
  Github,
  Rocket,
} from 'lucide-react';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

interface OrganizationHeroProps {
  organization: {
    name: string;
    imageUrl?: string | null;
    category?: string | null;
    totalProjects: number;
    url?: string | null;
    githubUrl?: string | null;
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

          <div className="flex flex-wrap items-center gap-12">
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

            {organization.githubUrl && (
              <a
                href={organization.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 font-medium transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {organization.githubUrl && (
              <Link
                href={`/organization/${encodeURIComponent(
                  organization.name
                )}/contribute`}
                className="group relative inline-flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/60 backdrop-blur-sm border border-slate-500/30 hover:border-slate-400/50 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
              >
                {/* Continuous animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 via-slate-500/30 to-slate-600/20 animate-pulse"></div>

                {/* Continuous shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer"></div>

                {/* Continuous glow effect */}
                <div className="absolute inset-0 rounded-lg bg-slate-400/20 animate-glow"></div>

                <Rocket className="w-4 h-4 relative z-10 animate-bounce-subtle" />
                <span className="relative z-10">Contribute</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

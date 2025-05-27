'use client';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { JetBrains_Mono } from 'next/font/google';
import type { Organization } from '@/types/organization';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

export default function OrganizationCard({ org }: { org: Organization }) {
  return (
    <Card className="border border-gray-200 hover:border-black transition-colors duration-200 bg-white shadow-sm hover:shadow-lg rounded-3xl overflow-hidden h-full flex flex-col">
      {/* Logo Section - Fixed Height */}
      <div className="p-6 pb-4 flex-shrink-0">
        <a
          href={org.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="w-full h-16 rounded flex items-center justify-center overflow-hidden">
            {org.imageUrl && (
              <img
                src={org.imageUrl || '/placeholder.svg'}
                alt={org.name}
                className="max-w-full max-h-full object-contain hover:opacity-80 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
        </a>
      </div>

      {/* Name Section - Fixed Height */}
      <div className="px-6 pb-4 flex-shrink-0">
        <div className="h-14 flex items-center justify-center">
          <a href={org.url} target="_blank" rel="noopener noreferrer">
            <h3
              className={`font-semibold text-lg text-center leading-tight text-black hover:text-gray-700 transition-colors line-clamp-2 ${jetbrainsMono.className}`}
            >
              {org.name}
            </h3>
          </a>
        </div>
      </div>

      {/* Category Section - Fixed Height */}
      <div className="px-6 pb-4 flex-shrink-0">
        <div className="h-6 flex items-center justify-center">
          <Badge
            variant="outline"
            className="text-xs text-black border-gray-300"
          >
            {org.category}
          </Badge>
        </div>
      </div>

      {/* Description Section - Fixed Height */}
      <div className="px-6 pb-4 flex-shrink-0">
        <div className="h-16 flex items-start">
          <p className="text-sm text-gray-600 line-clamp-3 text-center w-full">
            {org.description}
          </p>
        </div>
      </div>

      {/* Tech Stack Section - Fixed Height */}
      <div className="px-6 pb-6 flex-shrink-0">
        <div className="h-12 flex items-start justify-center">
          {org.techStack && org.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {org.techStack.slice(0, 4).map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {tech}
                </Badge>
              ))}
              {org.techStack.length > 4 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700"
                >
                  +{org.techStack.length - 4}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

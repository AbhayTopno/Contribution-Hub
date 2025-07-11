'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JetBrains_Mono } from 'next/font/google';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

interface YearlyParticipation {
  year: number;
  projectCount: number;
}

interface YearlyBreakdownProps {
  participations: YearlyParticipation[];
}

export default function YearlyBreakdown({
  participations,
}: YearlyBreakdownProps) {
  const sortedParticipations = [...participations].sort(
    (a, b) => b.year - a.year
  );

  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-800">
          Year by Year
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedParticipations.map((participation) => (
            <div
              key={participation.year}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200"
            >
              <span
                className={`font-bold text-slate-800 ${jetbrainsMono.className}`}
              >
                {participation.year}
              </span>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 hover:bg-blue-200 transition-colors">
                {participation.projectCount} projects
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

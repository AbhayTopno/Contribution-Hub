'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ChartData {
  year: string;
  projects: number;
}

interface ParticipationChartProps {
  data: ChartData[];
}

export default function ParticipationChart({ data }: ParticipationChartProps) {
  if (data.length === 0) return null;

  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-slate-600" />
          Participation History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full cursor-pointer">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barCategoryGap="20%"
              maxBarSize={60}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: '#64748b', cursor: 'pointer' }}
                tickMargin={10}
                stroke="#94a3b8"
                style={{ cursor: 'pointer' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b', cursor: 'pointer' }}
                tickMargin={10}
                stroke="#94a3b8"
                style={{ cursor: 'pointer' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)', cursor: 'pointer' }}
              />
              <Bar
                dataKey="projects"
                fill="url(#gradient)"
                radius={[6, 6, 0, 0]}
                stroke="#3b82f6"
                strokeWidth={1}
                style={{ cursor: 'pointer' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="slate-950" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

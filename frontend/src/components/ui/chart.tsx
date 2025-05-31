'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn('recharts-wrapper', className)}
      style={
        {
          '--color-chart-1': 'hsl(var(--chart-1))',
          '--color-chart-2': 'hsl(var(--chart-2))',
          '--color-chart-3': 'hsl(var(--chart-3))',
          '--color-chart-4': 'hsl(var(--chart-4))',
          '--color-chart-5': 'hsl(var(--chart-5))',
          ...Object.entries(config).reduce(
            (acc, [key, { color }]) => ({
              ...acc,
              [`--color-${key}`]: color,
            }),
            {}
          ),
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      [key: string]: any;
    };
  }>;
  label?: string;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            Year
          </span>
          <span className="font-bold text-sm">{label}</span>
        </div>
        {payload.map((data) => (
          <div key={data.name} className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {data.name}
            </span>
            <span className="font-bold">{data.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('recharts-tooltip-wrapper', className)}
    {...props}
  />
));
ChartTooltip.displayName = 'ChartTooltip';

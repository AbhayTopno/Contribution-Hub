import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';
import type React from 'react';
import { cn } from '@/lib/utils';

interface ContributeButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export default function ContributeButton({
  children,
  className,
  ...props
}: ContributeButtonProps) {
  return (
    <Button
      className={cn(
        'bg-slate-900 hover:bg-slate-700 backdrop-blur-sm border border-slate-500/30 hover:border-slate-400/50 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden cursor-hero-hand contribute-button',
        className
      )}
      {...props}
    >
      {/* Continuous animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 via-slate-500/30 to-slate-600/20 animate-pulse"></div>

      {/* Continuous shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer"></div>

      {/* Continuous glow effect */}
      <div className="absolute inset-0 rounded-lg bg-slate-400/20 animate-glow"></div>

      {children}
    </Button>
  );
}

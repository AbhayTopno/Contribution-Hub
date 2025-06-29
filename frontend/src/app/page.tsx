'use client';

import Link from 'next/link';
import { Rocket } from 'lucide-react';
import ContributeButton from '@/components/common/ContributeButton';
import TypewriterEffect from '@/components/common/TypewriterEffect'; // Import the new component

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-50 text-slate-900 overflow-hidden animate-gradient-shift">
      {/* Background elements for visual interest */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-12">
        {/* Typewriter Effect for the main heading */}
        <TypewriterEffect
          text="Discover Open Source Opportunities"
          speed={100} // Speed in ms per character
          pauseDuration={2000} // Pause duration in ms after typing
          loop={true} // Loop indefinitely
          className="animate-fade-in-up" // Apply fade-in to the component container
        />

        <p
          className="text-lg md:text-xl text-slate-700 mb-10 animate-fade-in-up animate-fade-in-up-delay-1"
          style={{ animationFillMode: 'both' }}
        >
          Explore a curated list of organizations and their projects, making it
          easier to find your next contribution.
        </p>
        <Link href="/organizations">
          <ContributeButton
            size="lg"
            className="animate-fade-in-up animate-fade-in-up-delay-2"
            style={{ animationFillMode: 'both' }}
          >
            <Rocket className="w-5 h-5 mr-2 relative z-10 animate-bounce-subtle contribute-icon" />
            <span className="relative z-10">Explore Organizations</span>
          </ContributeButton>
        </Link>

        <p
          className="mt-16 text-sm text-slate-600 animate-fade-in-up animate-fade-in-up-delay-2"
          style={{ animationFillMode: 'both' }}
        >
          All organizations and stats are based on Google Summer of Code (GSOC)
          data.
        </p>
      </div>
    </main>
  );
}

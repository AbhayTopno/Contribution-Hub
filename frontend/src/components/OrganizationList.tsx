import { useQuery } from '@apollo/client';
import { GET_ORGANIZATIONS } from '@/queries/getOrganizations';
import type {
  Organization,
  OrganizationsQueryVariables,
} from '@/types/organization';
import {
  Search,
  ChevronDown,
  Star,
  GitBranch,
  Users,
  ExternalLink,
  Sparkles,
  Filter,
  Loader2,
  ArrowDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

interface GetOrganizationsResponse {
  organizations: Organization[];
}

export default function OrganizationList() {
  const [isScrolled, setIsScrolled] = useState(false);

  const { loading, error, data } = useQuery<
    GetOrganizationsResponse,
    OrganizationsQueryVariables
  >(GET_ORGANIZATIONS, {
    variables: {
      category: undefined,
      techStack: undefined,
      topic: undefined,
      offset: 0,
      limit: 15,
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToOrganizations = () => {
    const organizationsSection = document.getElementById(
      'organizations-section'
    );
    organizationsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '2s' }}
      ></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>

      {/* Sticky Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div
                className={`transition-all duration-300 ${
                  isScrolled ? 'block' : 'hidden'
                }`}
              >
                <h1 className="text-white text-xl font-bold">
                  Contribution Hub
                </h1>
              </div>
            </div>

            {/* Search and Filter - Only show when scrolled */}
            <div
              className={`flex items-center gap-4 flex-1 max-w-2xl transition-all duration-300 ${
                isScrolled
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  placeholder="Search organizations, tech stacks, or topics..."
                  className="pl-12 pr-4 py-3 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500 focus:bg-slate-800/80 transition-all duration-200 rounded-xl backdrop-blur-sm"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/80 hover:text-white transition-all duration-200 rounded-xl backdrop-blur-sm px-6 py-3"
                  >
                    <Filter className="mr-2 w-4 h-4" />
                    Filters
                    <ChevronDown className="ml-2 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800/95 border-slate-600/50 backdrop-blur-xl rounded-xl">
                  {/* Add filter options here */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Profile */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl border border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-5xl mx-auto space-y-8">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent leading-tight animate-fade-in">
              Contribution
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Hub
              </span>
            </h1>

            <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl font-light text-slate-300">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-blue-500"></div>
              <span className="animate-fade-in-delay-1">Discover</span>
              <span className="text-blue-400 animate-fade-in-delay-2">•</span>
              <span className="animate-fade-in-delay-3">Contribute</span>
              <span className="text-purple-400 animate-fade-in-delay-4">•</span>
              <span className="animate-fade-in-delay-5">Impact</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-purple-500"></div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6 animate-fade-in-delay-6">
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Connect with amazing open source organizations and find the
              perfect projects to contribute to. Build your skills, make an
              impact, and join a global community of developers.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>1000+ Organizations</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                  style={{ animationDelay: '0.5s' }}
                ></div>
                <span>50+ Tech Stacks</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                  style={{ animationDelay: '1s' }}
                ></div>
                <span>Active Community</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-7">
            <Button
              onClick={scrollToOrganizations}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-lg group"
            >
              Explore Organizations
              <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              className="bg-transparent border-slate-600 text-white hover:bg-slate-800/50 px-8 py-4 rounded-xl font-medium transition-all duration-200 text-lg backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-20 w-16 h-16 bg-pink-500/10 rounded-full blur-xl animate-float-slow"></div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Organizations Section */}
      <section
        id="organizations-section"
        className="relative bg-slate-900/50 backdrop-blur-sm"
      >
        {/* Stats Bar */}
        <div className="border-b border-slate-700/30">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-bold text-white">
                  Featured Organizations
                </h2>
                <span className="text-slate-400">
                  Found{' '}
                  <span className="text-white font-semibold">
                    {data?.organizations.length || 0}
                  </span>{' '}
                  organizations
                </span>
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                >
                  <Star className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              </div>
              <div className="text-slate-400">
                Last updated: <span className="text-white">2 minutes ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto" />
                <div className="absolute inset-0 w-12 h-12 border-2 border-blue-400/20 rounded-full animate-pulse mx-auto"></div>
              </div>
              <p className="text-slate-300 text-lg font-medium">
                Loading organizations...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-20 flex items-center justify-center">
            <div className="text-center space-y-4 p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-red-500/20">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <h3 className="text-red-400 text-xl font-semibold">
                Oops! Something went wrong
              </h3>
              <p className="text-slate-400 max-w-md">{error.message}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Organization Grid */}
        {data && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.organizations.map((org: Organization, index) => (
                <div
                  key={org.name}
                  className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/80 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 via-slate-800/40 to-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Header with logo and name */}
                  <div className="relative flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 relative">
                      {org.imageUrl ? (
                        <div className="relative">
                          <img
                            src={org.imageUrl || '/placeholder.svg'}
                            alt={`${org.name} logo`}
                            className="w-20 h-20 object-contain rounded-xl p-2 group-hover:border-slate-500/80 transition-colors"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center border border-slate-600/50 group-hover:border-slate-500/80 transition-colors">
                          <span className="text-white font-bold text-xl">
                            {org.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                          {org.name}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs font-medium"
                      >
                        {org.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="relative mb-6">
                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 group-hover:text-slate-200 transition-colors">
                      {org.description}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="relative space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                        Tech Stack
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {org.techStack?.slice(0, 4).map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="outline"
                          className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs hover:bg-slate-600/50 hover:border-slate-500/50 transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {org.techStack && org.techStack.length > 4 && (
                        <Badge
                          variant="outline"
                          className="bg-slate-700/30 text-slate-400 border-slate-600/30 text-xs"
                        >
                          +{org.techStack.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Footer info */}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Load more section */}
            <div className="mt-12 text-center">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                Load More Organizations
              </Button>
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-delay-1 {
          animation: fade-in 1s ease-out 0.2s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.4s both;
        }
        .animate-fade-in-delay-3 {
          animation: fade-in 1s ease-out 0.6s both;
        }
        .animate-fade-in-delay-4 {
          animation: fade-in 1s ease-out 0.8s both;
        }
        .animate-fade-in-delay-5 {
          animation: fade-in 1s ease-out 1s both;
        }
        .animate-fade-in-delay-6 {
          animation: fade-in 1s ease-out 1.2s both;
        }
        .animate-fade-in-delay-7 {
          animation: fade-in 1s ease-out 1.4s both;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

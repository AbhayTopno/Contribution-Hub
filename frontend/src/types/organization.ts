export interface YearlyParticipation {
  year: number;
  projectCount: number;
}

export interface Organization {
  name: string;
  description?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  githubUrl?: string | null;
  category?: string | null;
  topics?: string[] | null;
  techStack?: string[] | null;
  rating: number;
  totalProjects: number;
  yearlyParticipations: YearlyParticipation[];
}

export interface OrganizationsQueryVariables {
  search?: string;
  category?: string;
  techStack?: string[];
  topic?: string[];
  offset?: number;
  limit?: number;
}

export interface OrganizationsData {
  organizations: Organization[];
}

export interface CategoriesData {
  allCategories: string[];
}

export interface TechStacksData {
  allTechStacks: string[];
}

export interface TopicsData {
  allTopics: string[];
}

export interface FilterOptionsData {
  allCategories: string[];
  allTechStacks: string[];
  allTopics: string[];
}

export interface GitHubLanguage {
  name: string;
  color: string;
}

export interface GitHubRepo {
  name: string;
  description?: string | null;
  url: string;
  stars: number;
  forks: number;
  lastCommitDate: string;
  languages: GitHubLanguage[];
}

export interface GitHubReposData {
  githubRepos: GitHubRepo[];
}

export interface GitHubReposQueryVariables {
  githubUrl: string;
}

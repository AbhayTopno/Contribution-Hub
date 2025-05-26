export interface YearlyParticipation {
  year: number;
  projectCount: number;
}

export interface Organization {
  name: string;
  description?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  topics?: string[] | null;
  techStack?: string[] | null;
  rating: number;
  totalProjects: number;
  yearlyParticipations: YearlyParticipation[];
}

export interface OrganizationsQueryVariables {
  category?: string;
  techStack?: string[];
  topic?: string[];
  offset?: number;
  limit?: number;
}

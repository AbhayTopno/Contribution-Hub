import { gql } from '@apollo/client';

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations(
    $search: String
    $category: String
    $techStack: [String!]
    $topic: [String!]
    $offset: Int
    $limit: Int
  ) {
    organizations(
      search: $search
      category: $category
      techStack: $techStack
      topic: $topic
      offset: $offset
      limit: $limit
    ) {
      name
      description
      url
      imageUrl
      githubUrl
      category
      topics
      techStack
      rating
      totalProjects
      yearlyParticipations {
        year
        projectCount
      }
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    allCategories
  }
`;

export const GET_ALL_TECH_STACKS = gql`
  query GetAllTechStacks {
    allTechStacks
  }
`;

export const GET_ALL_TOPICS = gql`
  query GetAllTopics {
    allTopics
  }
`;

export const GET_FILTER_OPTIONS = gql`
  query GetFilterOptions {
    allCategories
    allTechStacks
    allTopics
  }
`;

export const GET_ORGANIZATION = gql`
  query GetOrganization($name: String!) {
    organization(name: $name) {
      name
      description
      url
      imageUrl
      githubUrl
      category
      topics
      techStack
      rating
      totalProjects
      yearlyParticipations {
        year
        projectCount
      }
    }
  }
`;

export const GET_GITHUB_REPOS = gql`
  query GetGitHubRepos($githubUrl: String!) {
    githubRepos(githubUrl: $githubUrl) {
      name
      description
      url
      stars
      forks
      lastCommitDate
      languages {
        name
        color
      }
    }
  }
`;

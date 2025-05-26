import { gql } from '@apollo/client';

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations(
    $category: String
    $techStack: [String!]
    $topic: [String!]
    $offset: Int
    $limit: Int
  ) {
    organizations(
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

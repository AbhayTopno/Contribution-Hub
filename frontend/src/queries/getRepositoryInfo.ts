import { gql } from "@apollo/client"

export const GET_REPOSITORY_HERO = gql`
  query GetRepositoryHero($url: String!) {
    repoInfo(url: $url) {
      stats {
        stars
        forks
        languages {
          name
          color
          percentage
        }
      }
      issueCounts {
        assigned
        byLabel {
          count
          name
        }
        unassigned
        totalOpen
      }
    }
  }
`

export const GET_REPOSITORY_ISSUES = gql`
  query GetRepositoryIssues(
    $url: String!
    $issueType: String
    $limit: Int
    $offset: Int
  ) {
    repoInfo(url: $url) {
      issueCounts {
        byLabel {
          count
          name
        }
        totalOpen
      }
      issues(issueType: $issueType, limit: $limit, offset: $offset) {
        totalCount
        hasNextPage
        issues {
          assignees {
            login
            url
            avatarUrl
          }
          createdAt
          labels {
            name
          }
          title
          url
        }
      }
    }
  }
`

export const GET_REPOSITORY_CONTRIBUTORS = gql`
  query GetRepositoryContributors(
    $url: String!
    $period: ContributorPeriodEnum
    $limit: Int
  ) {
    repoInfo(url: $url) {
      contributors(period: $period, limit: $limit) {
        login
        commits
        url
        avatarUrl
      }
    }
  }
`

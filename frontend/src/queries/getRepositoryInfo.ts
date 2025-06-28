import { gql } from "@apollo/client"

export const GET_REPO_INFO = gql`
  query GetRepoInfo($url: String!, $limit: Int, $issueType: String, $period: ContributorPeriodEnum) {
    repoInfo(url: $url) {
      issues(issueType: $issueType) {
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
      contributors(period: $period, limit: $limit) {
        login
        commits
        url
        avatarUrl
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
      stats {
        stars
        forks
        languages {
          name
          color
          percentage
        }
      }
    }
  }
`

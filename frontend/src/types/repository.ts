export interface Contributor {
  login: string
  commits: number
  url: string
  avatarUrl: string
}

export interface Language {
  name: string
  color: string
  percentage: number
}

export interface RepoStats {
  stars: number
  forks: number
  languages: Language[]
}

export interface LabelCount {
  count: number
  name: string
}

export interface IssueCounts {
  assigned: number
  byLabel: LabelCount[]
  unassigned: number
  totalOpen: number
}

export interface Assignee {
  login: string
  url: string
  avatarUrl: string
}

export interface Label {
  name: string
}

export interface Issue {
  assignees: Assignee[]
  createdAt: string
  labels: Label[]
  title: string
  url: string
}

export interface IssuePage {
  issues: Issue[]
  totalCount: number
  hasNextPage: boolean
}

export type ContributorPeriodEnum = "THIS_MONTH" | "ALL_TIME"

export interface RepoHeroData {
  repoInfo: {
    stats: RepoStats
    issueCounts: IssueCounts
  }
}

export interface RepoHeroVariables {
  url: string
}

export interface RepoIssuesData {
  repoInfo: {
    issueCounts: IssueCounts
    issues: IssuePage
  }
}

export interface RepoIssuesVariables {
  url: string
  issueType?: string
  limit?: number
  offset?: number
}

export interface RepoContributorsData {
  repoInfo: {
    contributors: Contributor[]
  }
}

export interface RepoContributorsVariables {
  url: string
  period?: ContributorPeriodEnum
  limit?: number
}

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

export interface RepoInfo {
  contributors: Contributor[]
  stats: RepoStats
  issueCounts: IssueCounts
  issues: Issue[]
}

export interface RepoInfoData {
  repoInfo: RepoInfo
}

export type ContributorPeriodEnum = "THIS_MONTH" | "ALL_TIME"

export interface RepoInfoVariables {
  url: string
  limit?: number
  issueType?: string
  period?: ContributorPeriodEnum
}

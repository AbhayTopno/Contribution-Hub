import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

export const githubClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GITHUB_GRAPHQL,
  cache: new InMemoryCache(),
});

export const repoClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_REPO_GRAPHQL,
  cache: new InMemoryCache(),
});

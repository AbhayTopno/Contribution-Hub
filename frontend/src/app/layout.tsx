'use client';

import type React from 'react';

import './globals.css';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/lib/apolloClient';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Contribution Hub</title>
        <link rel="icon" href="/Logo.png" />
        <link rel="shortcut icon" href="/Logo.png" />
        <link rel="apple-touch-icon" href="/Logo.png" />
        <meta
          name="description"
          content="Discover Open Source Opportunities - Explore organizations and contribute to projects"
        />
      </head>
      <body>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}

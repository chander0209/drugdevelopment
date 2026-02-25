'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

/**
 * QueryProvider
 *
 * Creates a single QueryClient per browser session and wraps children with
 * QueryClientProvider. ReactQueryDevtools is included in development builds
 * only (tree-shaken in production).
 *
 * A new QueryClient is created inside useState so that each server-side
 * render gets a fresh instance (important for Next.js SSR / RSC boundaries).
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 30 seconds before a background
            // refetch is triggered on the next mount / focus event
            staleTime: 30_000,
            // Retry failed requests up to 2 times with exponential backoff
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10_000),
            // Refetch when the browser tab regains focus
            refetchOnWindowFocus: true,
          },
          mutations: {
            // Surface mutation errors rather than silently swallowing them
            throwOnError: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools panel only appears in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

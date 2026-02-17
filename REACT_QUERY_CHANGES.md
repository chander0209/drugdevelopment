# React Query Integration — Change Summary

## Packages added

| Package | Version | Purpose |
|---|---|---|
| `@tanstack/react-query` | ^5.56.2 | Data fetching, caching, synchronisation |
| `@tanstack/react-query-devtools` | ^5.56.2 | Dev-only inspector panel (tree-shaken in production) |

---

## New files

| File | Purpose |
|---|---|
| `app/QueryProvider.tsx` | Creates the `QueryClient` and wraps the tree with `QueryClientProvider`. Added to `app/layout.tsx`. |
| `lib/api.ts` | Centralised fetch helpers (`fetchPrograms`, `fetchProgram`, `updateProgram`). Decoupled from components so any hook can import them. |
| `lib/queryKeys.ts` | Type-safe query key factory. Ensures cache keys are consistent across hooks and makes invalidation surgical. |
| `hooks/usePrograms.ts` | `useQuery` wrapper for the paginated programs list. |
| `hooks/useProgram.ts` | `useQuery` wrapper for a single program + `useMutation` wrapper for PATCH. |

---

## Modified files

### `app/page.tsx`
- **Removed**: `useState` for `loading` / `error` / `programs` / `pagination`; `useCallback fetchPrograms`; the `useEffect` that called it.
- **Added**: `usePrograms(filters)` from the new hook.
- **UX improvements**:
  - `keepPreviousData` keeps the current page visible while pagination / filter transitions load — no blank flash.
  - A subtle spinner (`isFetching && !isLoading`) indicates a background refetch without replacing the content.
  - Pagination and filter buttons are disabled while a fetch is in flight.

### `app/programs/[id]/page.tsx`
- **Removed**: `useState` for `loading` / `saving` / `error`; `useEffect fetchProgram`; manual `fetch` calls.
- **Added**: `useProgram(id)` + `useProgramMutation(id)` from the new hooks.
- **Mutation flow**: on success the detail cache is updated directly with the server response (`queryClient.setQueryData`) and the list cache is invalidated so stale data is refetched in the background.

---

## Key optimisations

| Optimisation | How |
|---|---|
| **Request deduplication** | React Query coalesces multiple callers with identical query keys into one in-flight request. |
| **Caching** | Results are cached for 30 s (`staleTime`). Navigating back to the list shows instant data, then silently revalidates. |
| **No loading flash on pagination** | `keepPreviousData` keeps the last page rendered until the new page arrives. |
| **Background refresh** | Data is automatically refetched on window focus without user action. |
| **Smart retries** | 404s on the detail page are not retried (the program doesn't exist); other errors retry up to 2× with exponential back-off. |
| **Cache invalidation after mutation** | After a successful PATCH the list cache is invalidated, keeping the two views consistent. |
| **Dev tooling** | `ReactQueryDevtools` (dev only) gives a visual cache inspector — zero bytes in production builds. |

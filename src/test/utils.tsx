import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";

/**
 * `retry: false` is not optional.
 *
 * TanStack Query retries failed requests three times by default with
 * exponential backoff (~1s, 2s, 4s). Vitest's default test timeout is 5000ms.
 * Without this, every error-state test you write from Day 6 onward hangs and
 * then fails for a reason that has nothing to do with your code.
 *
 * `gcTime: 0` stops one test's cache leaking into the next.
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(ui: ReactElement) {
  const client = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
  return { client, ...render(ui, { wrapper }) };
}

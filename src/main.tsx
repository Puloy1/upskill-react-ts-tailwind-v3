import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { App } from "./App";
import "./index.css";

// There is no separate backend service. MSW serves the API in the browser
// during development, and in Node during tests, from the same handlers.
//
// Awaited before render so the first request cannot outrun the worker —
// a race that shows up as one mysterious failed fetch on page load.
async function startMockApi() {
  if (!import.meta.env.DEV) return;
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

// StrictMode is ON, deliberately. It double-invokes effects in development,
// so the hand-rolled fetch on Day 6 fires twice. That is not a bug — it is
// React surfacing missing cleanup, and Day 6 explains it.
const queryClient = new QueryClient();

// Not top-level await: that is unsupported by the default build target and
// fails only at `npm run build`, which is a bad time to find out.
void startMockApi().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>,
  );
});

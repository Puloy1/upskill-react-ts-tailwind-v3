import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Browser entry point. There is no separate backend service in this
// programme, so MSW serves the API in development as well as in tests.
//
// Started from main.tsx, and only in development — see the guard there.
export const worker = setupWorker(...handlers);

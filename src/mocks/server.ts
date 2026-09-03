import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Node entry point, used by Vitest. Shares the same handlers as the browser
// worker, so a behaviour you see in the app is the behaviour your tests see.
export const server = setupServer(...handlers);

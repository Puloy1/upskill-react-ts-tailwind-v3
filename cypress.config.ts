import { defineConfig } from "cypress";

// Pre-configured deliberately. Day 9 gives Cypress 45 minutes, and config is
// not what that time is for.
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    video: false,
  },
});

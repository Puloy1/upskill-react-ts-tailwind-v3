import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./src/mocks/server";
import { resetDb } from "./src/mocks/db";

// `onUnhandledRequest: "error"` is deliberate. A request the handlers do not
// cover should fail loudly rather than hang the test for five seconds and
// then fail for a reason that has nothing to do with the cause.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  cleanup();
  server.resetHandlers(); // undo any per-test server.use(...)
  resetDb();              // the mock backend is stateful — reset it too,
                          // or a shift created in one test appears in the next
});

afterAll(() => server.close());

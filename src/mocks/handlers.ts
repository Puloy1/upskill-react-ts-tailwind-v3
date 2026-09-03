import { http, HttpResponse, delay } from "msw";
import { db } from "./db";

/**
 * TRAINEES: read this, do not edit it. This is the backend you were given.
 *
 * There is no separate backend service in this programme — MSW plays that
 * role in the browser and in tests. Everything here is deliberately on the
 * other side of a boundary you do not own, which is the point of Day 4.
 *
 * MSW v2 syntax. If a tutorial says `rest.get` or `res(ctx.json(...))` it is
 * v1 — close it.
 */

/** Realistic-ish latency so loading states are visible rather than theoretical. */
const LATENCY = 120;

export const handlers = [
  http.get("/api/employees", async ({ request }) => {
    await delay(LATENCY);
    const url = new URL(request.url);
    const rows = db.employees({
      search: url.searchParams.get("search") ?? undefined,
      department: url.searchParams.get("department") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
    });
    return HttpResponse.json({ employees: rows });
  }),

  http.get("/api/employees/:id", async ({ params }) => {
    await delay(LATENCY);
    const employee = db.employee(Number(params.id));
    if (!employee) {
      return HttpResponse.json(
        { code: "NOT_FOUND", message: "Employee not found." },
        { status: 404 },
      );
    }
    return HttpResponse.json(employee);
  }),

  http.get("/api/availability", async ({ request }) => {
    await delay(LATENCY);
    const url = new URL(request.url);
    const employeeId = Number(url.searchParams.get("employeeId"));
    const date = url.searchParams.get("date") ?? "2026-03-02";
    const result = db.availability(employeeId, date);
    if (!result) {
      return HttpResponse.json(
        { code: "NOT_FOUND", message: "Employee not found." },
        { status: 404 },
      );
    }
    return HttpResponse.json(result);
  }),

  http.get("/api/shifts", async ({ request }) => {
    await delay(LATENCY);
    const url = new URL(request.url);
    return HttpResponse.json({
      shifts: db.shifts(url.searchParams.get("date") ?? undefined),
    });
  }),

  http.post("/api/shifts", async ({ request }) => {
    await delay(LATENCY);
    const body = (await request.json()) as {
      date: string; startTime: string; endTime: string; role: "front-desk" | "warehouse";
    };
    if (body.endTime <= body.startTime) {
      return HttpResponse.json(
        { code: "VALIDATION_FAILED", message: "End time must be after start time." },
        { status: 422 },
      );
    }
    if (body.date < new Date().toISOString().slice(0, 10)) {
      return HttpResponse.json(
        { code: "SHIFT_IN_PAST", message: "That date is in the past." },
        { status: 422 },
      );
    }
    return HttpResponse.json(db.createShift(body), { status: 201 });
  }),

  // The interesting one. The rule lives in db.assign, so a rejection here is
  // a real consequence of application state — not a scripted response.
  http.post("/api/shifts/:id/assign", async ({ params, request }) => {
    await delay(LATENCY);
    const { employeeId } = (await request.json()) as { employeeId: number };
    const result = db.assign(Number(params.id), employeeId);
    if (!result.ok) {
      return HttpResponse.json(
        { code: result.code, message: result.message },
        { status: result.code === "NOT_FOUND" ? 404 : 409 },
      );
    }
    return HttpResponse.json(result.shift);
  }),
];

/**
 * Failure scenarios, opted into per test:
 *
 *     server.use(failures.employeesServerError);
 *
 * Reach for a named failure rather than writing a handler inline, so every
 * trainee's error tests exercise the same responses.
 */
export const failures = {
  employeesServerError: http.get("/api/employees", () =>
    HttpResponse.json(
      { code: "INTERNAL_ERROR", message: "Something went wrong." },
      { status: 500 },
    ),
  ),

  employeesEmpty: http.get("/api/employees", () =>
    HttpResponse.json({ employees: [] }),
  ),

  /** Day 7, Ex 6: one service down, the page must survive. */
  availabilityTimeout: http.get("/api/availability", async () => {
    await delay(10_000);
    return HttpResponse.error();
  }),

  /** Day 7, Ex 5: makes the older response land last. */
  availabilitySlow: http.get("/api/availability", async () => {
    await delay(1_000);
    return HttpResponse.json({
      employeeId: 1, date: "2026-03-02", available: true,
      startTime: "09:00", endTime: "17:00",
    });
  }),

  /** Day 4, Ex 5: status outside the union. */
  employeesMalformed: http.get("/api/employees", () =>
    HttpResponse.json({
      employees: [
        { id: 1, name: "Jane Doe", email: "jane@example.com",
          department: "Engineering", status: "retired" },
      ],
    }),
  ),

  /** Day 4, Ex 7: a code that is not in product-spec.md. */
  unknownErrorCode: http.post("/api/shifts", () =>
    HttpResponse.json(
      { code: "TEAPOT_UNAVAILABLE", message: "Unrecognised." },
      { status: 400 },
    ),
  ),
};

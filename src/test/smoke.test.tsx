import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { App } from "../App";
import { renderWithProviders } from "./utils";

describe("starter harness", () => {
  it("renders the employees route", () => {
    window.history.pushState({}, "", "/employees");
    renderWithProviders(<App />);
    expect(screen.getByRole("heading", { name: /employees/i })).toBeInTheDocument();
  });

  it("reaches the mock API", async () => {
    const res = await fetch("/api/employees");
    const body = (await res.json()) as { employees: unknown[] };
    expect(body.employees.length).toBeGreaterThan(0);
  });

  it("the mock API is stateful", async () => {
    const before = await (await fetch("/api/shifts")).json();
    await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2099-01-01", startTime: "09:00",
                             endTime: "17:00", role: "warehouse" }),
    });
    const after = await (await fetch("/api/shifts")).json();
    expect(after.shifts.length).toBe(before.shifts.length + 1);
  });
});

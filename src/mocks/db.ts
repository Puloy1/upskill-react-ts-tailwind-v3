/**
 * db.ts — the mock backend's state.
 *
 * TRAINEES: treat this file and `handlers.ts` as another team's code. Read
 * them, do not edit them. They are the backend you were given, and part of
 * the point is that it behaves in ways you did not choose.
 *
 * This is deliberately *stateful* rather than a set of fixed responses.
 * A shift you create appears in the next GET. Assigning an employee who is
 * already booked is rejected because the rule is evaluated here, not because
 * a test told it to fail. Without that, Day 7's "the server rejected
 * something you could not have predicted" is theatre.
 */

export type EmployeeStatus = "active" | "inactive" | "on-leave";
export type ShiftRole = "front-desk" | "warehouse";

export type DbEmployee = {
  id: number;
  name: string;
  email: string;
  department: string;
  status: EmployeeStatus;
};

export type DbShift = {
  id: number;
  employeeId: number | null;
  role: ShiftRole;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
};

const DEPARTMENTS = ["Engineering", "Operations", "Support", "Finance"];
const STATUSES: EmployeeStatus[] = ["active", "inactive", "on-leave"];
const FIRST = ["Jane", "Sam", "Ana", "Luis", "Mia", "Noah", "Ivy", "Omar"];
const LAST = ["Doe", "Reyes", "Cruz", "Santos", "Tan", "Lim", "Ocampo"];

function buildEmployees(n: number): DbEmployee[] {
  // The first three are stable so tests and examples can rely on them.
  const fixed: DbEmployee[] = [
    { id: 1, name: "Jane Doe", email: "jane@example.com",
      department: "Engineering", status: "active" },
    { id: 2, name: "Sam Reyes", email: "sam@example.com",
      department: "Operations", status: "on-leave" },
    { id: 3, name: "Ana Cruz", email: "ana@example.com",
      department: "Support", status: "inactive" },
  ];
  const rest = Array.from({ length: Math.max(0, n - 3) }, (_, k) => {
    const i = k + 4;
    const first = FIRST[i % FIRST.length]!;
    const last = LAST[i % LAST.length]!;
    return {
      id: i,
      name: `${first} ${last} ${i}`,
      email: `${first.toLowerCase()}.${i}@example.com`,
      department: DEPARTMENTS[i % DEPARTMENTS.length]!,
      status: STATUSES[i % STATUSES.length]!,
    };
  });
  return [...fixed, ...rest];
}

/** Day 9 profiles this. 5,000 rows is the point, not an accident. */
export const EMPLOYEE_COUNT = 5000;

type State = { employees: DbEmployee[]; shifts: DbShift[]; nextShiftId: number };

let state: State = {
  employees: buildEmployees(EMPLOYEE_COUNT),
  shifts: [
    { id: 1, employeeId: 1, role: "front-desk",
      date: "2026-03-02", startTime: "09:00", endTime: "13:00" },
    { id: 2, employeeId: null, role: "front-desk",
      date: "2026-03-02", startTime: "13:00", endTime: "17:00" },
    { id: 3, employeeId: 2, role: "warehouse",
      date: "2026-03-02", startTime: "09:00", endTime: "17:00" },
  ],
  nextShiftId: 4,
};

/** Tests call this between cases so one test cannot leak into the next. */
export function resetDb() {
  state = {
    employees: buildEmployees(EMPLOYEE_COUNT),
    shifts: [
      { id: 1, employeeId: 1, role: "front-desk",
        date: "2026-03-02", startTime: "09:00", endTime: "13:00" },
      { id: 2, employeeId: null, role: "front-desk",
        date: "2026-03-02", startTime: "13:00", endTime: "17:00" },
      { id: 3, employeeId: 2, role: "warehouse",
        date: "2026-03-02", startTime: "09:00", endTime: "17:00" },
    ],
    nextShiftId: 4,
  };
}

export const db = {
  employees(filters?: { search?: string; department?: string; status?: string }) {
    let rows = state.employees;
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      rows = rows.filter(
        (e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q),
      );
    }
    if (filters?.department) {
      rows = rows.filter((e) => e.department === filters.department);
    }
    if (filters?.status) {
      rows = rows.filter((e) => e.status === filters.status);
    }
    return rows;
  },

  employee(id: number) {
    return state.employees.find((e) => e.id === id) ?? null;
  },

  shifts(date?: string) {
    return date ? state.shifts.filter((s) => s.date === date) : state.shifts;
  },

  shift(id: number) {
    return state.shifts.find((s) => s.id === id) ?? null;
  },

  createShift(input: Omit<DbShift, "id" | "employeeId">): DbShift {
    const shift: DbShift = { ...input, id: state.nextShiftId++, employeeId: null };
    state.shifts.push(shift);
    return shift;
  },

  /**
   * Availability is derived, not stored — deterministic per employee and
   * date so the same request always gives the same answer, but not something
   * the trainee chose.
   *
   * Rule: an employee is unavailable on the (id + day-of-month) % 4 === 0
   * days, and never available when their status is not "active".
   */
  availability(employeeId: number, date: string) {
    const employee = this.employee(employeeId);
    if (!employee) return null;
    const day = Number(date.slice(-2)) || 1;
    const blocked = employee.status !== "active" || (employeeId + day) % 4 === 0;
    return blocked
      ? { employeeId, date, available: false as const }
      : { employeeId, date, available: true as const,
          startTime: "09:00", endTime: "17:00" };
  },

  /**
   * The business rule Day 7 depends on. The client cannot evaluate this —
   * it does not know the whole schedule — which is exactly why optimistic
   * updates are the wrong call for this action.
   */
  assign(shiftId: number, employeeId: number):
    | { ok: true; shift: DbShift }
    | { ok: false; code: string; message: string } {
    const shift = this.shift(shiftId);
    if (!shift) {
      return { ok: false, code: "NOT_FOUND", message: "Shift not found." };
    }
    const availability = this.availability(employeeId, shift.date);
    if (!availability || !availability.available) {
      return { ok: false, code: "EMPLOYEE_UNAVAILABLE",
               message: "Employee is unavailable." };
    }
    const clash = state.shifts.find(
      (s) =>
        s.employeeId === employeeId &&
        s.date === shift.date &&
        s.id !== shift.id &&
        s.startTime < shift.endTime &&
        shift.startTime < s.endTime,
    );
    if (clash) {
      return { ok: false, code: "EMPLOYEE_ALREADY_ASSIGNED",
               message: "Employee is already assigned." };
    }
    shift.employeeId = employeeId;
    return { ok: true, shift };
  },
};

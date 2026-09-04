import type { Brand } from './brand';
import type { ApiError } from "./api";
// import { expectTypeOf } from "vitest";

export type EmployeeStatus = "active" | "inactive" | "on-leave";

export const STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  "on-leave": "On Leave",
};

export type EmployeeId = Brand<number, 'EmployeeId'>;
export type IsoDate = Brand<string, 'IsoDate'>;

export function toEmployeeId(value: number): EmployeeId {
  return value as EmployeeId;
}

export function toIsoDate(value: string): IsoDate {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Not an ISO date: ${value}`);
  }
  return value as IsoDate;
}

export type Employee = {
  id: EmployeeId;
  name: string;
  email: string;
  department: string;
  status: EmployeeStatus;
};

export type EmployeeState =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error"; error: ApiError }
  | { status: "success"; employee: Employee };

export type EmployeeAction =
| { type: "load" }
| { type: "loaded"; employee: Employee }
| { type: "failed"; error: ApiError };

export function getEmployeeDisplayName(
  employee: Employee
): string {
    return employee.name;
}

// // @ts-expect-error "terminated" is not an EmployeeStatus
// const bad: EmployeeStatus = "terminated";
// void bad;

// expectTypeOf(getEmployeeDisplayName).returns.toBeString();
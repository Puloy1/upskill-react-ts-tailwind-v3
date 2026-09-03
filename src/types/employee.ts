export type EmployeeStatus = "active" | "inactive" | "on-leave";

export type Employee = {
  id: number;
  name: string;
  email: string;
  department: string;
  status: EmployeeStatus;
};

export function getEmployeeDisplayName(
  employee: Employee
): string {
    return employee.name;
}

import { expectTypeOf } from "vitest";

// @ts-expect-error "terminated" is not an EmployeeStatus
const bad: EmployeeStatus = "terminated";

expectTypeOf(getEmployeeDisplayName).returns.toBeString();
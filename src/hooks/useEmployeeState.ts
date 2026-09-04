import type {
  EmployeeAction,
  EmployeeState,
} from "../types/employee";
import { assertNever } from '../lib/assertNever';
import { useReducer } from "react";

export function employeeReducer(
  _state: EmployeeState,
  action: EmployeeAction,
): EmployeeState {
  switch (action.type) {
    case "load":
      return { status: "loading" };

    case "loaded":
      return {
        status: "success",
        employee: action.employee,
      };

    case "failed":
      return {
        status: "error",
        error: action.error,
      };
    default:
      return assertNever(action);
  }
}

export function useEmployeeState() {
  return useReducer(employeeReducer, {
    status: "loading",
  });
}
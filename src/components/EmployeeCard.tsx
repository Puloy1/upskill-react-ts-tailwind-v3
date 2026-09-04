import type { Employee, EmployeeId } from '../types/employee';
import { STATUS_LABELS } from '../types/employee';

export type EmployeeCardProps = {
  employee: Employee;
  onSelect: (id: EmployeeId) => void;
};

export function EmployeeCard({ employee, onSelect }: EmployeeCardProps) {
  return (
    <div>
        <h2>{employee.name}</h2>
        <p>{employee.email}</p>
        <p>{employee.department}</p>
        <p>Status: {STATUS_LABELS[employee.status]}</p>

        <button onClick={() => onSelect(employee.id)}>
          View Employee
        </button>
    </div>
  )
}
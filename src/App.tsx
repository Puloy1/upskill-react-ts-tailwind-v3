import { Navigate, Route, Routes } from "react-router-dom";
import { EmployeeCard } from './components/EmployeeCard';
import type { EmployeeId } from './types/employee';
import { toEmployeeId, type Employee } from "./types/employee";
import { useState, useEffect } from "react";

// The three routes from product-spec.md, stubbed. You fill them in.
// Note there is no /availability route — availability is a panel on the
// employee detail page. Day 5 explains why that distinction matters.

function EmployeesPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const initialEmployee: Employee = {
      id: toEmployeeId(1),
      name: "Jane Doe",
      email: "jane@example.com",
      department: "Engineering",
      status: "active",
    };

    setTimeout(() => {
      setEmployee(initialEmployee);
    }, 1000);
  }, []);

  const handleSelect = (id: EmployeeId) => {
    console.log("Selected employee:", id);
  };

  return (
    <div>
      <h1>Employees</h1>

      {employee === null
        ?
          (
            <p>Loading...</p>
          )
        : (
          <EmployeeCard
            employee={employee}
            onSelect={handleSelect}
          />
        )}
    </div>
  );
}

function EmployeeDetailPage() {
  return <h1>Employee detail</h1>;
}

function SchedulingPage() {
  return <h1>Scheduling</h1>;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/employees" replace />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/employees/:id" element={<EmployeeDetailPage />} />
      <Route path="/scheduling" element={<SchedulingPage />} />
    </Routes>
  );
}

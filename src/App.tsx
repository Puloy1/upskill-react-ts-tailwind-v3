import { Navigate, Route, Routes } from "react-router-dom";

// The three routes from product-spec.md, stubbed. You fill them in.
// Note there is no /availability route — availability is a panel on the
// employee detail page. Day 5 explains why that distinction matters.

function EmployeesPage() {
  return <h1>Employees</h1>;
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

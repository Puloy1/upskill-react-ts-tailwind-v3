// A smoke test so `npm run cypress` proves the harness works before Day 9.
describe("smoke", () => {
  it("loads the employees page", () => {
    cy.visit("/employees");
    cy.contains("Employees");
  });
});

// Login Page Redirections ...

describe("LoginPage", () => {
  it("should navigate to the login page", () => {
    cy.visit("/");

    cy.get("h2").contains("Login");
  });
});

describe("LoginPagetoResetRedirection", () => {
  it("should navigate to the reset page", () => {
    cy.visit("/");

    cy.get('a[href*="reset"]').click();

    cy.url().should("include", "/reset");

    cy.get("button").contains("Send password reset email");
  });
});

describe("LoginPagetoSignupRedirection", () => {
  it("should navigate to the signup page", () => {
    cy.visit("/");

    cy.get('a[href*="signup"]').click();

    cy.url().should("include", "/signup");

    cy.get("h2").contains("Signup");
  });
});

export {};

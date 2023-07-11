describe("<Reset />", () => {
  it("should render and display expected content", () => {
    cy.visit("/reset");

    // To check if the component is rendered
    cy.get("button").contains("Send password reset email").should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
  });
});

describe("<Signup />", () => {
  it("should render and display expected content", () => {
    cy.visit("/signup");

    // To check if the component is rendered
    cy.get("h2").contains("Signup");
    cy.get("label").contains("Username:");
    cy.get("label").contains("Email:");
    cy.get("label").contains("Password:");
    cy.get("label").contains("Confirm Password:");

    // To check if the links are rendered
    cy.get('a[href*="/"]').should("be.visible");

    // To check if the buttons are rendered
    cy.get('input[name="submit"]').contains("Sign Up");

    // To check if the inputs are rendered
    cy.get('input[name="username"]').should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('input[name="cnfrmpass"]').should("be.visible");

    // To check if the inputs are empty
    cy.get('input[name="username"]').should("be.empty");
    cy.get('input[name="email"]').should("be.empty");
    cy.get('input[name="password"]').should("be.empty");
    cy.get('input[name="cnfrmpass"]').should("be.empty");

    // To try typing in the inputs
    cy.get('input[name="username"]').type("test");
    cy.get('input[name="email"]').type("abcd@gmail.com");
    cy.get('input[name="password"]').type("Ruhab@123");
    cy.get('input[name="cnfrmpass"]').type("Ruhab@123");

    // To check the input values
    cy.get('input[name="username"]').should("have.value", "test");
    cy.get('input[name="email"]').should("have.value", "abcd@gmail.com");
    cy.get('input[name="password"]').should("have.value", "Ruhab@123");
    cy.get('input[name="cnfrmpass"]').should("have.value", "Ruhab@123");

    // To Submit the form
    cy.get('input[name="submit"]').contains("Sign Up").click();

    // To clear the inputs
    cy.get('input[name="username"]').clear();
    cy.get('input[name="email"]').clear();
    cy.get('input[name="password"]').clear();
    cy.get('input[name="cnfrmpass"]').clear();

    // To check the username error message
    cy.get('input[name="submit"]').contains("Sign Up").click();
    cy.get("span").contains("Invalid Username");

    // To check the email error message
    cy.get('input[name="username"]').type("test");
    cy.get('input[name="username"]').should("have.value", "test");
    cy.get('input[name="submit"]').contains("Sign Up").click();
    cy.get("span").contains("Invalid Email");

    // To check the password error message
    cy.get('input[name="email"]').type("abcd@gmail.com");
    cy.get('input[name="email"]').should("have.value", "abcd@gmail.com");
    cy.get('input[name="submit"]').contains("Sign Up").click();
    cy.get("span").contains("Password is required.");

    // To check special character error message
    cy.get('input[name="password"]').type("Ruhab123");
    cy.get('input[name="password"]').should("have.value", "Ruhab123");
    cy.get('input[name="submit"]').contains("Sign Up").click();
    cy.get("span").contains(
      "Password must contain at least one Special Symbol."
    );

    // To check the digit error message
    cy.get('input[name="password"]').clear();
    cy.get('input[name="password"]').type("Ruhab@");
    cy.get('input[name="password"]').should("have.value", "Ruhab@");
    cy.get('input[name="submit"]').contains("Sign Up").click();
    cy.get("span").contains("Password must contain at least one Digit.");

    // To check the uppercase error message
    cy.get('input[name="password"]').clear();
    cy.get('input[name="password"]').type("ruhab@123");
    cy.get('input[name="password"]').should("have.value", "ruhab@123");
    cy.get('input[name="submit"]').contains("Sign Up").click();
    cy.get("span").contains(
      "Password must have at least one Uppercase Character."
    );

    // To check the lowercase error message
    cy.get('input[name="password"]').clear();
    cy.get('input[name="password"]').type("RUHAB@123");
    cy.get('input[name="password"]').should("have.value", "RUHAB@123");
    cy.get('input[name="submit"]').contains("Sign Up").click();
    cy.get("span").contains(
      "Password must have at least one Lowercase Character."
    );

    // To check the length error message
    cy.get('input[name="password"]').clear();
    cy.get('input[name="password"]').type("Ru@1");
    cy.get('input[name="password"]').should("have.value", "Ru@1");
    cy.get('input[name="submit"]').contains("Sign Up").click();
    cy.get("span").contains("Password must be 5 or more Characters Long.");

    // To check the confirm password error message
    cy.get('input[name="password"]').clear();
    cy.get('input[name="password"]').type("Ruhab@123");
    cy.get('input[name="password"]').should("have.value", "Ruhab@123");
    cy.get('input[name="submit"]').contains("Sign Up").click();
    cy.get("span").contains("Passwords do not match");

    // Final Check
    cy.get('input[name="cnfrmpass"]').type("Ruhab@1234");
    cy.get('input[name="cnfrmpass"]').should("have.value", "Ruhab@1234");
    cy.get('input[name="submit"]').contains("Sign Up").click();
  });
});

describe("<Login />", () => {
  it("should render and display expected content", () => {
    cy.visit("/");

    // To check if the component is rendered
    cy.get("h2").contains("Login");
    cy.get("label").contains("Email:");
    cy.get("label").contains("Password:");

    // To check if the links are rendered
    cy.get('a[href*="reset"]').should("be.visible");
    cy.get('a[href*="signup"]').should("be.visible");

    // To check if the buttons are rendered
    cy.get('input[name="submit"]').contains("Login");

    // To check if the inputs are rendered
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");

    // To check if the inputs are empty
    cy.get('input[name="email"]').should("be.empty");
    cy.get('input[name="password"]').should("be.empty");

    // To try typing in the inputs
    cy.get('input[name="email"]').type("abcd@gmail.com");
    cy.get('input[name="password"]').type("Ruhab@123");

    // To check if the inputs are empty and check the values
    cy.get('input[name="email"]').should("have.value", "abcd@gmail.com");
    cy.get('input[name="password"]').should("have.value", "Ruhab@123");

    // To Submit the form
    cy.get('input[name="submit"]').contains("Login").click();

    // To clear the inputs
    cy.get('input[name="email"]').clear();
    cy.get('input[name="password"]').clear();

    // To check the email error messages
    cy.get('input[name="submit"]').contains("Login").click();
    cy.get("span").contains("Invalid Email or Password");

    // To check the password error messages
    cy.get('input[name="email"]').type("abcd@gmail.com");
    cy.get('input[name="email"]').should("have.value", "abcd@gmail.com");
    cy.get('input[name="submit"]').contains("Login").click();
    cy.get("span").contains("Invalid Email or Password");

    // Final Check
    cy.get('input[name="password"]').type("Ruhab@123");
    cy.get('input[name="password"]').should("have.value", "Ruhab@123");
    // cy.get('input[name="submit"]').contains("Login").click();
  });
});

export {};

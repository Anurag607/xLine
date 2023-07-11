describe("<Chat />", () => {
  it("should render and display expected content", () => {
    cy.visit("/chat");

    cy.get("nav").should("be.visible");
    cy.get("aside").should("be.visible");
    cy.get("main").should("be.visible");
    cy.get("form").should("be.visible");
    cy.get('input[name="imgMsg"]').should("be.visible");
    cy.get('input[name="messageInput"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible").contains("Send");
  });
});

export {};

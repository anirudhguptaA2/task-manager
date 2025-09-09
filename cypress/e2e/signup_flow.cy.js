/// <reference types="cypress" />

describe('Signup Flow', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const testFirstName = 'Test';
  const testLastName = 'User';

  before(() => {
    cy.clearLocalStorage();
  });

  it('signs up a new user and redirects to dashboard', () => {
    cy.visit('/signup');
    cy.get('input[placeholder="First Name"]').type(testFirstName);
    cy.get('input[placeholder="Last Name"]').type(testLastName);
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type(testPassword);
    cy.get('input[placeholder="Confirm Password"]').type(testPassword);
    cy.get('button[type="submit"]').click();

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back');
  });

  it('shows error for existing email', () => {
    cy.visit('/signup');
    cy.get('input[placeholder="First Name"]').type(testFirstName);
    cy.get('input[placeholder="Last Name"]').type(testLastName);
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type(testPassword);
    cy.get('input[placeholder="Confirm Password"]').type(testPassword);
    cy.get('button[type="submit"]').click();

    // Should show error (Firebase or app error message)
    cy.contains('already in use').should('exist');
  });
});

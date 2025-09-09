/// <reference types="cypress" />

describe('Login and Create Task Flow', () => {
  const testEmail = 'test1@gmail.com';
  const testPassword = 'test1234';
  const testTaskTitle = 'E2E Test Task';
  const testTaskDesc = 'This is a task created by Cypress E2E test.';

  before(() => {
    // Optionally, clear localStorage or reset state
    cy.clearLocalStorage();
  });

  it('logs in and creates a new task', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type(testPassword);
    cy.get('button[type="submit"]').click();

    // Wait for dashboard to load
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back');

    // Go to add task
    cy.contains('+ Add task').click();
    cy.url().should('include', '/tasks/add');

    // Fill out the form
    cy.get('input#title').type(testTaskTitle);
    cy.get('input#date').type('2025-09-09');
    cy.get('select#status').select(0); // Select first status
    cy.get('textarea#desc').type(testTaskDesc);
    cy.get('button[type="submit"]').click();

    // Should return to dashboard and show the new task
    cy.url().should('include', '/dashboard');
    cy.contains(testTaskTitle);
    cy.contains(testTaskDesc.substring(0, 10)); // Partial match for truncated desc
  });
});

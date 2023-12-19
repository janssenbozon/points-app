// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Cypress command to log out a user
// commands.js
Cypress.Commands.add('signOut', () => {
    cy.window().then((win) => {
        if (win.signOut) {
            win.signOut();
        }
    });
});

Cypress.Commands.add('getVerificationCode', () => {

    const projectId = 'points-app-c2759';

    // Construct the API endpoint URL
    const apiUrl = `http://localhost:9099/emulator/v1/projects/${projectId}/verificationCodes`;

    cy.log(`API URL: ${apiUrl}`);

    // Make a GET request to the Firebase Emulator API endpoint
    cy.request({
        method: 'GET',
        url: apiUrl,
    }).then((response) => {
        const codes = response.body.verificationCodes
        cy.log(`Codes: ${JSON.stringify(codes)}`);
        const verificationCode = codes[codes.length - 1].code;
        return cy.wrap(verificationCode)
    });

});

Cypress.Commands.add('createSampleEvent', () => {
    const projectId = 'points-app-c2759';

    // Construct the API endpoint URL
    const apiUrl = `http://localhost:9099/emulator/v1/projects/${projectId}/databases/(default)/documents/events`;

    cy.log(`API URL: ${apiUrl}`);

    // Make a GET request to the Firebase Emulator API endpoint
    cy.request({
        method: 'POST',
        url: apiUrl,
        body: {
            fields: {
                name: {
                    stringValue: "Culture Night"
                },
                start: {
                    stringValue: new Date().toISOString()
                },
                end: {
                    stringValue: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()
                },
                startCode: {
                    stringValue: "123456"
                },
                endCode: {
                    stringValue: "654321"
                },
                points: {
                    integerValue: 1
                },
                category: {
                    stringValue: "Culture"
                },
                attendance: {
                    stringValue: ""
                }
            }
        }
    }).then((response) => {
        const codes = response.body.verificationCodes
        cy.log(`Codes: ${JSON.stringify(codes)}`);
        const verificationCode = codes[codes.length - 1].code;
        return cy.wrap(verificationCode)
    });

});


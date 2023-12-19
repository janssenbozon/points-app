describe('Create New User Tests', () => {

    // TODO: add beforeAll to restart the realtime database, wait for it to restart, and then run the tests  

    beforeEach(() => {
        // clear cookies before each test
        cy.visit('localhost:3000')
        cy.wait(2000)
        cy.signOut()
    })

    it('create user flow works', () => {

        cy.visit('localhost:3000')
        cy.get('#phoneInput').type('2222222222')
        cy.get('button').click()

        // wait until the code is sent
        cy.get('#otpInput', { timeout: 10000 }).should('be.visible');

        cy.getVerificationCode().then((verificationCode) => {
            cy.get('#otpInput').type(verificationCode)
            cy.get('button').click()
        })

        cy.get('#firstNameInput', { timeout: 5000 }).type('John')
        cy.get('#nextButton').click()

        cy.get('#lastNameInput', { timeout: 2000 }).type('Doe')
        cy.get('#nextButton').click()

        cy.get('#yearInput', { timeout: 2000 }).select('Freshman')
        cy.get('#nextButton').click()

        // have it select the last option
        cy.get('#bigFamInput').select("I don''t know")
        cy.get('#nextButton').click()

        cy.contains("You're in!")
        cy.contains("You're registered for the 23-24 school year.")
        cy.get('#nextButton').click()

        cy.url().should('include', '/Homepage')

    })

    it('create user flow works with back button', () => {
            
            cy.visit('localhost:3000')
            cy.get('#phoneInput').type('0987654321')
            cy.get('button').click()
    
            // wait until the code is sent
            cy.get('#otpInput', { timeout: 10000 }).should('be.visible');
    
            cy.getVerificationCode().then((verificationCode) => {
                cy.get('#otpInput').type(verificationCode)
                cy.get('button').click()
            })
    
            cy.get('#firstNameInput', { timeout: 5000 }).type('John')
            cy.get('#nextButton').click()
    
            cy.get('#lastNameInput', { timeout: 2000 }).type('Doe')
            cy.get('#backButton').click()
    
            cy.get('#firstNameInput', { timeout: 5000 }).type('Jane')
            cy.get('#nextButton').click()
    
            cy.get('#lastNameInput', { timeout: 2000 }).type('Smith')
            cy.get('#nextButton').click()
    
            cy.get('#yearInput', { timeout: 2000 }).select('Freshman')
            cy.get('#backButton').click()
    
            cy.get('#lastNameInput', { timeout: 2000 }).type('Doe')
            cy.get('#nextButton').click()
    
            cy.get('#yearInput', { timeout: 2000 }).select('Graduate')
            cy.get('#nextButton').click()
    
            // have it select the last option
            cy.get('#bigFamInput').select("I don''t know")
            cy.get('#nextButton').click()
    
            cy.contains("You're in!")
            cy.contains("You're registered for the 23-24 school year.")

            cy.get('#nextButton').click()

            cy.url().should('include', '/Homepage')
    
        })

  })

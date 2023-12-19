describe('Login Tests', () => {

  beforeEach(() => {
    // clear cookies before each test
    cy.clearCookies()
    cy.visit('localhost:3000')
  })
  
  it('renders', () => {
    cy.contains('Hey there!')
    cy.contains('Welcome to UTFSA!')
    cy.contains("To get started, enter your phone number")
    cy.get('input').should('have.attr', 'placeholder', '(000) 000 - 0000')
  })

  it('shows error message when phone number is invalid', () => {
    cy.visit('localhost:3000')
    cy.get('input').type('123')
    cy.get('button').click()
    cy.contains('Something went wrong. Please try again. Error code: auth/invalid-phone-number')
  })

  it('shows code input when phone number is valid', () => {
    cy.get('input').type('1234567890')
    cy.get('button').click()
    cy.contains('We sent you a code!')
    cy.contains('Please enter it below.')
  })

  it('shows error message when code is invalid', () => {
    cy.get('#phoneInput').type('1234567890')
    cy.get('button').click()
    cy.get('#otpInput').type('123')
    cy.get('button').click()
    cy.contains('Something went wrong. Please try again.')
  })

  it('redirects to home page when code is valid', () => {
    cy.get('#phoneInput').type('1234567890')
    cy.get('button').click()

    // wait until the code is sent
    cy.get('#otpInput', { timeout: 10000 }).should('be.visible');
    
    cy.getVerificationCode().then((verificationCode) => {
      cy.get('#otpInput').type(verificationCode)
      cy.get('button').click()
      // make sure link contains /createNewUser
      cy.url().should('include', '/createNewUser')
    })
  })

})
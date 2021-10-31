/**
 * Error thrown if email/password used for personal authentication was incorrect
 */
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Your email/password combination is incorrect.');
  }
}

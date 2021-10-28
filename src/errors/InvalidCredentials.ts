export class InvalidCredentialsError extends Error {
  constructor() {
    super('Your email/password combination is incorrect.');
  }
}

export class AuthRequiredError extends Error {
  constructor() {
    super('Authentication is required to proceed');
  }
}

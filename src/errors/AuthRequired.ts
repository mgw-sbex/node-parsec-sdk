/** Error thrown if authentication is required to perform certain action */
export class AuthRequiredError extends Error {
  constructor() {
    super('Authentication is required to proceed');
  }
}

/**
 * Error thrown if TFA code is required to authenticate with _personal_ strategy
 */
export class TFARequiredError extends Error {
  tfaType: string;

  constructor(tfaType: string) {
    super('You need to provide an authentication code.');
    this.tfaType = tfaType;
  }
}

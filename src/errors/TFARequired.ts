export class TFARequiredError extends Error {
  tfaType: string;

  constructor(tfaType: string) {
    super('You need to provide an authentication code.');
    this.tfaType = tfaType;
  }
}

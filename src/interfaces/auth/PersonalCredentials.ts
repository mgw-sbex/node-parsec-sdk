/**
 * Representation of the _personal_ authentication credentials/request body
 */
export interface AuthPersonalCredentials {
  /** Parsec account's email address */
  email: string;

  /** Parsec account's password */
  password: string;

  /** Optional TFA code */
  tfa?: string;
}

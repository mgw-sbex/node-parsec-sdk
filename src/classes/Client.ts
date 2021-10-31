import { AxiosError } from 'axios';

import { httpClient } from '../utils/httpClient';
import { Status } from '../enums/Status';
import { InvalidCredentialsError } from '../errors/InvalidCredentials';
import { TFARequiredError } from '../errors/TFARequired';
import { AuthErrorBody } from '../interfaces/AuthErrorBody';
import { AuthSuccessBody } from '../interfaces/AuthSuccessBody';

export class Client {
  public status: Status = Status.PARSEC_NOT_RUNNING;

  public sessionID?: string;

  public peerID?: string;

  /**
   * Authenticate client using the _personal_ strategy
   *
   * @param  {string} email Parsec account's email
   * @param  {string} password Parsec account's password
   * @param  {string} [tfa] TFA code
   */
  public async authPersonal(email: string, password: string, tfa?: string) {
    try {
      if (this.sessionID && this.peerID && this.status === Status.PARSEC_OK) {
        return;
      }

      this.status = Status.PARSEC_CONNECTING;

      const response = await httpClient.post<AuthSuccessBody>('/v1/auth/', {
        email,
        password,
        tfa
      });
      const { host_peer_id, session_id } = response.data;

      this.peerID = host_peer_id;
      this.sessionID = session_id;
      this.status = Status.PARSEC_OK;
    } catch (error) {
      this.status = Status.ERR_DEFAULT;
      const httpErrorBody = (error as AxiosError<AuthErrorBody>).response?.data;

      if (httpErrorBody?.tfa_required) {
        throw new TFARequiredError(httpErrorBody?.tfa_type as string);
      } else if (!httpErrorBody?.tfa_required && httpErrorBody?.error) {
        throw new InvalidCredentialsError();
      }

      throw error;
    }
  }
}

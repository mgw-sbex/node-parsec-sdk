import MockAdapter from 'axios-mock-adapter';
import { httpClient } from '../../src/utils/httpClient';

import { Client } from '../../src/classes/Client';
import { Status } from '../../src/enums/Status';

import { InvalidCredentialsError } from '../../src/errors/InvalidCredentials';
import { TFARequiredError } from '../../src/errors/TFARequired';

const client = new Client();
const mockAxios = new MockAdapter(httpClient);

mockAxios
  .onPost('/v1/auth/')
  .replyOnce(403, { error: 'Your email/password combination is incorrect.' })
  .onPost('/v1/auth/')
  .replyOnce(403, {
    error: 'You need to provide an authentication code.',
    tfa_required: true
  })
  .onPost('/v1/auth/')
  .replyOnce(201, {
    host_peer_id: '123abc',
    session_id: 'xyz456'
  });

describe("Parsec client's authPersonal method", () => {
  it('should throw InvalidCredentialsError and set error status if called with wrong email/password', async () => {
    try {
      const clientConnectPromise = client.authPersonal(
        'invalid@example.com',
        'Invalid_passw0rd'
      );
      await clientConnectPromise;
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidCredentialsError);
      expect(client.status).toEqual(Status.ERR_DEFAULT);
    }
  });

  it('should throw TFARequiredError and set error status if called with valid credentials, but no TFA code', async () => {
    try {
      const clientConnectPromise = client.authPersonal(
        'john.doe@example.com',
        'Password123!'
      );

      await clientConnectPromise;
    } catch (error) {
      expect(error).toBeInstanceOf(TFARequiredError);
      expect(client.status).toEqual(Status.ERR_DEFAULT);
    }
  });

  it('should set peer and host IDs and OK status if called with valid credentials and TFA code', async () => {
    try {
      await client.authPersonal(
        'john.doe@example.com',
        'Password123!',
        '069420'
      );

      expect(client.peerID).not.toBeUndefined();
      expect(client.sessionID).not.toBeUndefined();
      expect(client.status).toEqual(Status.PARSEC_OK);
    } catch (error) {
      console.error(error);
    }
  });

  it('should do nothing if called when session and peer IDs and OK status are set', async () => {
    try {
      const peerIDBeforeConnect = client.peerID;
      const sessionIDBeforeConnect = client.sessionID;
      const statusBeforeConnect = client.status;

      await client.authPersonal(
        'john.doe@example.com',
        'Password123!',
        '069420'
      );

      expect(client.peerID).toEqual(peerIDBeforeConnect);
      expect(client.sessionID).toEqual(sessionIDBeforeConnect);
      expect(client.status).toEqual(statusBeforeConnect);
    } catch (error) {
      console.error(error);
    }
  });
});

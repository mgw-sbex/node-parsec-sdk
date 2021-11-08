import MockAdapter from 'axios-mock-adapter';
import { http } from '../../src/utils/http';

import { Client } from '../../src/classes/Client';
import { Status } from '../../src/enums/Status';

import { InvalidCredentialsError } from '../../src/errors/InvalidCredentials';
import { TFARequiredError } from '../../src/errors/TFARequired';

const client = new Client();
const mockAxios = new MockAdapter(http);

mockAxios
  .onPost('/v1/auth')
  .replyOnce(403, { error: 'Your email/password combination is incorrect.' })
  .onPost('/v1/auth')
  .replyOnce(403, {
    error: 'You need to provide an authentication code.',
    tfa_required: true
  })
  .onPost('/v1/auth')
  .replyOnce(404)
  .onPost('/v1/auth')
  .replyOnce(201, {
    host_peer_id: '123abc',
    session_id: 'xyz456'
  });

describe("Parsec client's authPersonal method", () => {
  it('should throw InvalidCredentialsError and set error status if called with wrong email/password', async () => {
    try {
      await client.authPersonal({
        email: 'invalid@example.com',
        password: 'Invalid_passw0rd'
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidCredentialsError);
      expect(client.status).toEqual(Status.ERR_DEFAULT);
    }
  });

  it('should throw TFARequiredError and set error status if called with valid credentials, but no TFA code', async () => {
    try {
      await client.authPersonal({
        email: 'john.doe@example.com',
        password: 'Password123'
      });
    } catch (error) {
      expect(error).toBeInstanceOf(TFARequiredError);
      expect(client.status).toEqual(Status.ERR_DEFAULT);
    }
  });

  it('should throw any other error caught during execution', async () => {
    try {
      // Throws an error because of the 404 status code of the 3rd reply
      await client.authPersonal({
        email: 'john.doe@example.com',
        password: 'Password123',
        tfa: '852005'
      });
    } catch (error) {
      expect(error).not.toBeInstanceOf(InvalidCredentialsError);
      expect(error).not.toBeInstanceOf(TFARequiredError);
      expect(client.status).toEqual(Status.ERR_DEFAULT);
    }
  });

  it('should set peer and host IDs and OK status if called with valid credentials and TFA code', async () => {
    try {
      await client.authPersonal({
        email: 'john.doe@example.com',
        password: 'Password123',
        tfa: '852005'
      });

      expect(client.peerID).not.toBeUndefined();
      expect(client.sessionID).not.toBeUndefined();
      expect(client.status).toEqual(Status.PARSEC_OK);
    } catch (error) {
      console.error(error);
    }
  });

  it('should do nothing if called when session and peer IDs and OK status are set', async () => {
    try {
      const peerIDBeforeAuthCall = client.peerID;
      const sessionIDBeforeAuthCall = client.sessionID;
      const statusBeforeAuthCall = client.status;

      await client.authPersonal({
        email: 'john.doe@example.com',
        password: 'Password123',
        tfa: '852005'
      });

      expect(client.peerID).toEqual(peerIDBeforeAuthCall);
      expect(client.sessionID).toEqual(sessionIDBeforeAuthCall);
      expect(client.status).toEqual(statusBeforeAuthCall);
    } catch (error) {
      console.error(error);
    }
  });
});

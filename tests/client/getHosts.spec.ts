import MockAdapter from 'axios-mock-adapter';
import { http } from '../../src/utils/http';

import { Client } from '../../src/classes/Client';
import { Status } from '../../src/enums/Status';
import { AuthRequiredError } from '../../src/errors/AuthRequired';

const client = new Client();
const mockAxios = new MockAdapter(http);
const hostsEndpoint = new RegExp('/v2/hosts');

mockAxios
  .onGet(hostsEndpoint)
  .replyOnce(401, {
    error: 'no session ID in request header'
  })
  .onGet(hostsEndpoint)
  .replyOnce(400)
  .onGet(hostsEndpoint)
  .replyOnce(200, {
    data: [
      {
        peer_id: '2a0045',
        name: 'NICE-HOST',
        mode: 'desktop',
        public: false
      }
    ],
    has_more: false
  });

describe("Parsec client's getHosts method", () => {
  it('should throw AuthRequiredError if called without authenticating first', async () => {
    try {
      await client.getHosts({ mode: 'desktop' });
    } catch (error) {
      expect(error).toBeInstanceOf(AuthRequiredError);
      expect(client.status).toEqual(Status.ERR_DEFAULT);
    }
  });

  it('should throw a generic error if authenticated but invalid mode query param was specified', async () => {
    try {
      client.sessionID = 'ParsecIsAwesome';
      await client.getHosts({ mode: 'squid' as 'game' });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(client.status).toEqual(Status.ERR_DEFAULT);
    }
  });

  it('should return HTTP response body if authenticated and called with valid params', async () => {
    try {
      client.sessionID = 'SrslyParsecSlaps';
      const getHostsReturn = await client.getHosts({
        mode: 'desktop',
        public: false
      });

      expect(getHostsReturn.has_more).toEqual(false);
      expect(getHostsReturn.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            peer_id: '2a0045',
            name: 'NICE-HOST',
            mode: 'desktop',
            public: false
          })
        ])
      );
    } catch (error) {
      console.error(error);
    }
  });
});

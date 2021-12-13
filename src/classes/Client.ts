import { AxiosError } from 'axios';
import { stringify } from 'querystring';

import { http } from '../utils/http';
import { Status } from '../enums/Status';

import { InvalidCredentialsError } from '../errors/InvalidCredentials';
import { TFARequiredError } from '../errors/TFARequired';
import { AuthRequiredError } from '../errors/AuthRequired';

import { AuthPersonalCredentials } from '../interfaces/auth/PersonalCredentials';
import { AuthErrorBody } from '../interfaces/auth/ErrorBody';
import { AuthPayload } from '../interfaces/auth/Payload';

import { GetHostsPayload } from '../interfaces/host/GetPayload';
import { GetHostsQueryParams } from '../interfaces/host/GetQueryParams';

export class Client {
  public status: Status = Status.PARSEC_NOT_RUNNING;

  public sessionID?: string;

  public peerID?: string;

  private webrtcPeerConnection?: RTCPeerConnection;

  private websocket!: WebSocket;

  /**
   * Authenticate client using the _personal_ strategy
   *
   * @param {@link AuthPersonalCredentials} credentials Credentials to use
   *    in the authentication request
   */
  public async authPersonal(credentials: AuthPersonalCredentials) {
    try {
      if (this.sessionID && this.peerID && this.status === Status.PARSEC_OK) {
        return;
      }

      this.status = Status.PARSEC_CONNECTING;
      const { data } = await http.post<AuthPayload>('/v1/auth', credentials);
      const { host_peer_id, session_id } = data;

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

      throw new Error(httpErrorBody?.error || (error as Error).message);
    }
  }
  /**
   * Obtain a list of hosts matching specified `mode` and `public` criteria
   *
   * @param {@link GetHostsQueryParams} queryParams get hosts request
   *    query params object representation
   */
  public async getHosts(queryParams: GetHostsQueryParams) {
    try {
      const queryString = stringify({ ...queryParams });
      const { data } = await http.get<GetHostsPayload>(
        `/v2/hosts?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${this.sessionID}`
          }
        }
      );

      return data;
    } catch (error) {
      this.status = Status.ERR_DEFAULT;

      const httpErrorBody = (error as AxiosError<AuthErrorBody>).response?.data;

      if (
        !this.sessionID &&
        httpErrorBody?.error === 'no session ID in request header'
      ) {
        throw new AuthRequiredError();
      }

      throw new Error(httpErrorBody?.error || (error as Error).message);
    }
  }
  /**
   * @param  {{htmlVideo:HTMLVideoElement;htmlAudio:HTMLAudioElement;secret?:string;}} config
   */
  public async connect(config: {
    htmlVideo: HTMLVideoElement;
    htmlAudio: HTMLAudioElement;
    secret?: string;
  }) {
    if (!this.sessionID) {
      throw new AuthRequiredError();
    }

    this.websocket = new WebSocket(
      `wss://kessel-ws.parsecgaming.com:443/?session_id=${this.sessionID}&role=client&version=1&sdk_version=0`
    );

    this.websocket.onclose;

    this.webrtcPeerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.parsec.gg:3478' }]
    });

    this.webrtcPeerConnection.onicecandidate = ({ candidate }) => {
      const iceCandidateData = candidate?.candidate
        ?.replace('candidate:', '')
        .split(' ');

      if (iceCandidateData && iceCandidateData.length >= 8) {
        const protocol = iceCandidateData[2].toLowerCase();
      }
    };
  }
}

import { Host } from './Host';

/** Payload of the `getHosts` call */
export interface GetHostsPayload {
  data: Host[];
  has_more: boolean;
}

/**
 * Object representation of `getHosts` request query params
 */
export interface GetHostsQueryParams {
  /** Host's mode */
  mode: 'desktop' | 'game';

  /** Host's visibility */
  public?: boolean;
}

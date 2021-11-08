/**
 * Host object representation
 */
export interface Host {
  /** Host computer's peer ID */
  peer_id: string;

  /** User that created the host */
  user: {
    id: number;
    name: string;
    warp: boolean;
  };

  /** Internal Parsec game ID */
  game_id: string;

  /** Parsec build number */
  build: string;

  /** Host's description */
  description: string;

  /** Maximal number of players allowed to be connected simultaneously */
  max_players: number;

  /** Host's mode, can be either _desktop_ or _game_ */
  mode: 'desktop' | 'game';

  /** Host's name */
  name: string;

  /** Number of players currently connected to the host */
  players: number;

  /** Host's visibility */
  public: boolean;

  /** Determines if the host that made the `GET /hosts` call
   *    is attached to the same sessionID */
  self: boolean;
}

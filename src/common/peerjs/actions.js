/* @flow */
import type { Action, Deps, Peer, DataConnection } from '../types';
import { Observable } from 'rxjs/Observable';
import { multiplayerActions } from '../cards/actions';
import { isBrowser, getParameterByName } from '../utils';

export const startup = (): Action => ({
  type: 'STARTUP',
});

export const started = (peer: Peer): Action => ({
  type: 'STARTED',
  payload: {
    peer,
  },
});

export const connecting = (id: string): Action => ({
  type: 'CONNECTING',
  payload: {
    id,
  },
});

export const connected = (connection: DataConnection): Action => ({
  type: 'CONNECTED',
  payload: {
    connection,
  },
});

export const close = (): Action => ({
  type: 'CLOSE',
});

export const send = (data: object): Action => ({
  type: 'SEND',
  payload: {
    data,
  },
});

export const receive = (data: object): Action => ({
  type: 'RECEIVE',
  payload: {
    data,
  },
});

export const setError = (error: string): Action => ({
  type: 'ERROR',
  payload: {
    error,
  },
});

export const ping = (i: number): Action => ({
  type: 'PING',
  payload: i,
});

const startupEpic = (
  action$: any,
  { peerjs, peerjsServer }: Deps,
): Action => action$
  .ofType('STARTUP')
  .first()
  .mergeMap(() => {
    if (!isBrowser()) {
      return action$.mapTo({
        type: 'NOT_READY',
      });
    }

    return Observable.fromPromise(
      new Promise((resolve) => {
        try {
          const peer = new window.Peer({
            key: peerjs,
            host: peerjsServer,
            port: 443,
            secure: true,
            debug: 3,
          });

          peer
            .on('open', () => resolve(started(peer)))
            .on('error', err => resolve(setError(err.message)));
        } catch (err) {
          resolve(setError(err.message));
        }
      })
    );
  });

const autoconnectEpic = (
  action$: any,
  { getState },
): Action => action$
  .ofType('STARTED')
  .mergeMap(() => {
    const { peerjs: { peer } } = getState();

    const id = getParameterByName('p');

    if (!peer || !id) {
      return Observable.of();
    }

    return Observable.fromPromise(
      new Promise((resolve) => {
        try {
          const conn = peer.connect(id);

          conn
            .on('open', () => resolve(connected(conn)))
            .on('error', err => resolve(setError(err.message)));
        } catch (err) {
          resolve(setError(err.message));
        }
      })
    );
  });

const listeningEpic = (
  action$: any,
  { getState },
): Action => action$
  .ofType('STARTED')
  .mergeMap(() => {
    const { peerjs: { peer } } = getState();

    if (!peer) {
      return Observable.of();
    }

    return Observable.fromPromise(
      new Promise((resolve) => {
        try {
          peer
            .on('connection', (conn) => {
              conn.on('open', () => resolve(connected(conn)));
            })
            .on('error', err => resolve(setError(err.message)));
        } catch (err) {
          resolve(setError(err.message));
        }
      })
    );
  });

const connectingEpic = (
  action$: any,
  { getState },
): Action => action$
  .ofType('CONNECTING')
  .mergeMap((action: Action) => {
    const { peerjs: { peer } } = getState();

    if (!peer) {
      return Observable.of();
    }

    return Observable.fromPromise(
      new Promise((resolve) => {
        try {
          const conn = peer.connect(
            action.payload.id
          );

          conn
            .on('open', () => resolve(connected(conn)))
            .on('error', err => resolve(setError(err.message)));
        } catch (err) {
          resolve(setError(err.message));
        }
      })
    );
  });

const sendActionEpic = (
  action$: any,
  { getState },
): Action => action$
  .ofType(...multiplayerActions)
  .mergeMap((action: Action) => {
    const { peerjs: { connection } } = getState();

    if (!connection) {
      return Observable.of();
    }

    try {
      if (action.payload.isPlayer) {
        // you are sending your actions,
        // which show as the opponent for the opponent!
        action.payload.isPlayer = false;
        connection.send(action);
      }
      // otherwise, no need to send to the opponent their moves
    } catch (err) {
      return Observable.of(setError(err.message));
    }

    return Observable.of();
  });

const receiveActionEpic = (
  action$: any,
  { getState },
): Action => action$
  .ofType('CONNECTED')
  .mergeMap(() => {
    const { peerjs: { connection } } = getState();

    if (!connection) {
      return Observable.of();
    }

    return Observable.fromEvent(connection, 'data');
  });

const pingingEpic = (
  action$: any,
  { getState },
): Action => action$
  .ofType('STARTED')
  .mergeMap(() => {
    const { peerjs: { peer } } = getState();

    if (!peer) {
      return Observable.of();
    }

    // const interval = 1000;
    const interval = 30000;
    return Observable.interval(interval)
      .map((i) => {
        peer.socket.send({ type: 'ping' });
        // connection.provider.socket.send({ type: 'ping' });
        return ping(i);
      })
      .takeUntil(action$.ofType('ERROR', 'CLOSE'));
  });

export const epics = [
  startupEpic,
  autoconnectEpic,
  listeningEpic,
  connectingEpic,
  sendActionEpic,
  receiveActionEpic,
  pingingEpic,
];

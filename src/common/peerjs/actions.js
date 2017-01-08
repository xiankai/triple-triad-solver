/* @flow */
import type { Action, Deps, Peer, DataConnection } from '../types';
import { Observable } from 'rxjs/Observable';

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

const startupEpic = (
  action$: any,
  { peerjs }: Deps,
): Action => {
  if (typeof window === 'undefined') {
    return action$.mapTo({
      type: 'NOT_READY',
    });
  }

  const peer = new window.Peer({ key: peerjs });
  const peerConnection = Observable.fromPromise(
    new Promise((resolve, reject) => {
      try {
        peer.on('open', () => resolve(peer));
      } catch (err) {
        reject(err);
      }
    })
  );

  return action$
    .ofType('STARTUP')
    .mergeMap(() => peerConnection.map(started));

  // create observable that takes id and returns connetion
  // from connection, listen to connect or connected actions
  // both should return a completed connection, which starts listening for data
};

const listeningEpic = (
  action$: any,
  { getState },
): Action => {
  return action$
    .ofType('STARTED')
    .mergeMap(() => {
      const { peerjs: { peer } } = getState();

      if (!peer) {
        return Observable.of();
      }

      const peerConnection = Observable.fromPromise(
        new Promise((resolve, reject) => {
          try {
            console.log(`listening on ${peer.id}`);
            peer.on('connection', (connection: DataConnection) => {
              console.log(`connected to ${connection.peer}`);
              resolve(connection);
            });
          } catch (err) {
            reject(err);
          }
        })
      );

      return peerConnection.map(connected);
    })
    // .takeUntil(action$.filter((action: Action) => action.type === 'CONNECTED'));
};

const connectingEpic = (
  action$: any,
  { getState },
): Action => {
  return action$
    .ofType('CONNECTING')
    .mergeMap((action: Action) => {
      const { peerjs: { peer } } = getState();
      console.log(peer);

      if (!peer) {
        return Observable.of();
      }

      const peerConnection = Observable.fromPromise(
        new Promise((resolve, reject) => {
          try {
            console.log(`connecting from ${peer.id}`);
            console.log(`connecting to ${action.payload.id}`);

            const conn = peer.connect(
              action.payload.id
            );
            console.log(conn);
            conn.on('open', () => {
              console.log('connected to ' + conn.peer);
              resolve(conn);
            });
          } catch (err) {
            reject(err);
          }
        })
      );

      return peerConnection.map(connected);
    });
};

export const epics = [
  startupEpic,
  listeningEpic,
  connectingEpic,
];

/* @flow */
import type { Action, Deps } from '../types';
import { Observable } from 'rxjs/Observable';

export const startup = (): Action => ({
  type: 'STARTUP',
});

export const connecting = (id: string): Action => ({
  type: 'CONNECTING',
  payload: {
    id,
  },
});

export const connected = (connection: object): Action => ({
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

export const error = (error: string): Action => ({
  type: 'ERROR',
  payload: {
    error,
  },
});

const connectivityEpic = (
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
        peer.on('open', id => resolve(id));
      } catch (err) {
        reject(err);
      }
    })
  );

  return action$
    .filter((action: Action) => action.type === 'STARTUP')
    .mergeMap(() => {
      return peerConnection.map(connecting);
    });

  // create observable that takes id and returns connetion
  // from connection, listen to connect or connected actions
  // both should return a completed connection, which starts listening for data
};

export const epics = [
  connectivityEpic,
];

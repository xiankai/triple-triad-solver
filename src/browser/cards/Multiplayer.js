/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Spinner,
} from '../app/components';

import {
  startup,
  connecting,
  setError,
  send,
  receive,
} from '../../common/peerjs/actions';
import { isBrowser } from '../../common/utils';

class Multiplayer extends Component {
  componentDidMount() {
    if (typeof window === 'undefined') {
      return;
    }

    this.props.startup();
  }

  findOpponent = () => {
    if (this.input.value) {
      this.props.connecting(this.input.value);
    } else {
      this.props.setError('No opponent ID specified.');
    }
  };

  render() {
    const {
      peer,
      connection,
      connectee,
      loading,
      error,
    } = this.props;

    return (
      <div>
        {
          peer &&
          <div>
            <div>Your TT ID for this session is: { peer.id } </div>
            <div>
              Share this link to challenge your friends!
              <input type="text" value={`${isBrowser() ? window.location.origin : ''}/cards?p=${peer.id}`} />
              <a href={`whatsapp://send?text=${isBrowser() ? window.location.origin : ''}/cards?p=${peer.id}`} data-action="share/whatsapp/share">
                Share via Whatsapp
              </a>
            </div>
          </div>
        }
        <div>
          Enter your opponent's id here:
          <input type="text" ref={(input) => { this.input = input; }} />
          <button onClick={this.findOpponent} >Enter</button>
          { loading && <Spinner /> }
        </div>
        Status: {(() => {
          if (error) {
            return error;
          }

          if (connection && connection.open) {
            return `Connected to ${connection.peer}`;
          }

          if (loading) {
            return `Connecting to ${connectee}`;
          }

          return 'Not connected yet.';
        })()}
      </div>
    );
  }
}

export default connect(
  state => state.peerjs,
  {
    startup,
    connecting,
    setError,
    send,
    receive,
  }
)(Multiplayer);

/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Spinner,
  Image,
  Input,
} from '../app/components';

import {
  startup,
  connecting,
  setError,
  send,
  receive,
} from '../../common/peerjs/actions';
import { isBrowser, isMobile } from '../../common/utils';

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

    const link = `${isBrowser() ? window.location.origin : ''}/cards?p=${peer && peer.id}`;

    return (
      <div>
        {
          peer &&
          <div>
            Your ID for this multiplayer session is: { peer.id }
            <div>
              Share this link to challenge your friends!
              <Input
                value={link}
                readOnly
                hideLabel
                autoOff
              />
              {
                isMobile &&
                <div>
                  <a href={`fb-messenger://share?link=${link}`}>
                   <Image src={require('./messenger.png')} height="16px" /> Share link via Facebook Messenger
                  </a>
                </div>
              }
              {
                isMobile &&
                <div>
                  <a href={`whatsapp://send?text=${isBrowser() ? window.location.origin : ''}/cards?p=${peer.id}`} data-action="share/whatsapp/share">
                   <Image src={require('./whatsapp-icon.png')} height="16px" /> Share link via Whatsapp
                  </a>
                </div>
              }
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

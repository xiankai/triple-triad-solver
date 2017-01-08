/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  startup,
  connecting,
  setError,
  send,
  receive,
} from '../../common/peerjs/actions';

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
    const { peer, connection, error } = this.props;

    return (
      <div>
        { peer && <div>Your TT ID for this session is: { peer.id } </div> }
        <div>
          Enter your opponent's id here:
          <input type="text" ref={input => { this.input = input; }} />
          <button onClick={this.findOpponent} >Enter</button>
          { error }
        </div>
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

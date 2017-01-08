/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  startup,
  connecting,
  connectFail,
  send,
  receive,
} from '../../common/peerjs/actions';

class Multiplayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      peer: null,
      id: null,
      connection: null,
      error: null,
    };
  }

  componentDidMount() {
    if (typeof window === 'undefined') {
      return;
    }

    this.props.startup();
  }

  monitorConnection = (connection) => {
    this.setState({
      connection,
      error: null,
    });
    connection.on('open', () => {
      connection.on('data', data => console.log(data));
      connection.send(`Hello! from ${Math.random() * 1000}`);
    });
  }

  findOpponent = () => {
    if (this.input.value) {
      this.props.connecting(this.input.value);
    } else {
      this.props.connectFail('No opponent ID specified.');
    }
  };

  render() {
    return (
      <div>
        <div>Your TT ID for this session is: { this.props.id } </div>
        <div>
          Enter your opponent's id here:
          <input type="text" ref={input => { this.input = input; }} />
          { this.state.error }
          { !this.state.connection && <button onClick={this.findOpponent} >Enter</button> }
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ id: state.peerjs.id }),
  {
    startup,
    connecting,
    connectFail,
    send,
    receive,
  }
)(Multiplayer);

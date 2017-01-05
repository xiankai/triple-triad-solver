/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  startup,
  connecting,
  connected,
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

    const {
      startup,
    } = this.props;

    startup();
    // const that = this;
    // const peer = new window.Peer({ key: that.props.peerjs });
    // peer.on('open', id => that.setState({ id }));

    // peer.on('connection', this.monitorConnection);

    // that.setState({ peer });
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
      this.monitorConnection(this.state.peer.connect(this.input.value));
    } else {
      this.setState({ error: 'No opponent ID specified.' });
    }
  };

  render() {
    return (
      <div>
        <div>Your TT ID for this session is: { this.state.id } </div>
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
  state => ({ peerjs: state.config.peerjs }),
  {
    startup,
    connecting,
    connected,
    send,
    receive,
  }
)(Multiplayer);

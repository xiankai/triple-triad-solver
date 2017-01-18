/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Panel,
  PanelFooter,
  Flex,
  Grid,
  Space,

  Spinner,
  Image,

  Input,
  Button,
  Tooltip,
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
  constructor() {
    super();

    this.state = { copied: '' };
  }

  componentDidMount() {
    if (typeof window === 'undefined') {
      return;
    }

    this.props.startup();

    const clipboard = new window.Clipboard('#share_button');

    clipboard.on('success', () => {
      this.setState({ copied: 'Copied!' });
      setTimeout(() => this.setState({ copied: '' }), 5000);
    });

    clipboard.on('error', () => {
      this.setState({ copied: 'Can\'t copy - do it manually.' });
      setTimeout(() => this.setState({ copied: '' }), 5000);
    });
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
      <Panel>
        {
          peer &&
          <div>
            Your ID for this multiplayer session is: { peer.id }
            <Flex align="flex-end">
              <Grid>
                <Input
                  id="share_link"
                  value={link}
                  name="link"
                  label="Share this link to challenge your friends!"
                  readOnly
                  autoOff
                  style={{
                    marginBottom: 0,
                    display: 'inline-block',
                  }}
                />
                <Tooltip
                  title={this.state.copied}
                  style={{
                    display: this.state.copied ? 'block' : 'none',
                  }}
                >
                  <Button
                    id="share_button"
                    data-clipboard-target="#share_link"
                    rounded
                  >
                    Copy
                  </Button>
                </Tooltip>
              </Grid>
              <Space x={1} />
              {
                isMobile() &&
                <Grid>
                  <a href={`fb-messenger://share?link=${link}`}>
                   <Image src={require('./messenger.png')} height="16px" /> Share link via Facebook Messenger
                  </a>
                </Grid>
              }
              <Space x={1} />
              {
                isMobile() &&
                <Grid>
                  <a href={`whatsapp://send?text=${isBrowser() ? window.location.origin : ''}/cards?p=${peer.id}`} data-action="share/whatsapp/share">
                   <Image src={require('./whatsapp-icon.png')} height="16px" /> Share link via Whatsapp
                  </a>
                </Grid>
              }
            </Flex>
          </div>
        }
        <Flex align="flex-end">
          <Input
            name="opponent"
            ref={(input) => { this.input = input; }}
            label="Or enter your opponent's id here to connect to them"
            autoOff
            style={{
              marginBottom: 0,
              display: 'inline-block',
            }}
          />
          <Button onClick={this.findOpponent} rounded>Enter</Button>
          { loading && <Spinner /> }
        </Flex>
        <PanelFooter>
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
        </PanelFooter>
      </Panel>
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

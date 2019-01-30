import React from 'react';
import { View, Button, TextInput, Alert } from 'react-native';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import Loader from '../components/loader';
import SOCKET_SERVER_URL from '../config/config';
import styles from '../styles/styles';

class JoinGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'Player 2', roomId: '', loading: false };
  }

  render() {
    const { roomId, name, loading } = this.state;

    return (
      <View style={styles.container}>
        <Loader loading={loading} />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '25%' }}
          onChangeText={text => this.setState({ name: text })}
          value={name}
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '25%' }}
          onChangeText={text => this.setState({ roomId: text })}
          value={roomId}
        />
        <Button
          onPress={() => {
            const { navigation } = this.props;
            this.setState({ loading: true });
            this.socket = socketIOClient(SOCKET_SERVER_URL.SOCKET_SERVER_URL, {
              transports: ['websocket']
            });
            this.socket.on('connect', () => {
              this.setState({ loading: false });
              this.socket.emit('getRoomInfo', roomId);
              this.socket.on('roomInfo', info => {
                if (info === null || info === undefined) {
                  Alert.alert(
                    'Lobby closed!',
                    'The party is no longer available...',
                    [{ text: 'OK' }],
                    { cancelable: false }
                  );
                  this.socket.disconnect();
                } else {
                  this.socket.removeAllListeners();
                  navigation.navigate('Lobby', {
                    type: 'join',
                    playerName: name,
                    joinId: roomId,
                    socket: this.socket
                  });
                }
              });
            });
          }}
          title="Join"
          disabled={roomId.length < 1}
        />
      </View>
    );
  }
}

JoinGame.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

export default JoinGame;

import React from 'react';
import { View, Button, TextInput, Alert } from 'react-native';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import styles from '../styles/styles';

class JoinGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'Player 2', roomId: '' };
  }

  render() {
    const { roomId } = this.state;
    const { name } = this.state;

    return (
      <View style={styles.container}>
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
            this.socket = socketIOClient('http://192.168.2.17:8000/');
            this.socket.on('connect', () => {
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
                  navigation.navigate('JoinGame');
                } else {
                  this.socket.disconnect();
                  navigation.navigate('Lobby', { type: 'join', joinId: roomId, playerName: name });
                }
              });
            });
          }}
          title="Join"
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

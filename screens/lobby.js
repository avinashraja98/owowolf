import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import socketIOClient from 'socket.io-client';
import PropTypes from 'prop-types';
import SOCKET_SERVER_URL from '../config/config';
import styles from '../styles/styles';

class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: '',
      roomId: '',
      me: { name: '' },
      players: []
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const joinRoomId = navigation.getParam('joinId', '');
    this.setState({ type: navigation.getParam('type', 'create') });
    const type = navigation.getParam('type', 'create');

    const player = { name: navigation.getParam('playerName', '') };
    this.setState({ me: player });

    let connectRoomId = '';

    if (type === 'join') {
      this.setState({ roomId: joinRoomId });
      connectRoomId = joinRoomId;
    } else if (type === 'create') {
      connectRoomId = Math.floor(1000 + Math.random() * 9000).toString();
      this.setState({ roomId: connectRoomId });
    }

    this.socket = socketIOClient(SOCKET_SERVER_URL.SOCKET_SERVER_URL, {
      transports: ['websocket']
    });
    this.socket.on('connect', () => {
      this.setState(prevState => {
        if (prevState.players.length === 0) return { players: [player] };
        return { players: [...prevState.players, player] };
      });

      this.socket.emit('join', connectRoomId);

      this.socket.on('newPlayer', newPlayerInfo => {
        this.setState(prevState => ({ players: [...prevState.players, newPlayerInfo] }));
      });

      this.socket.on('clientDisconnect', client => {
        const { players } = this.state;
        this.setState({
          players: players.filter(connectedClient => {
            return connectedClient.name !== client.name;
          })
        });
      });

      if (type === 'join') {
        this.socket.emit('newPlayer', player);
        this.socket.on('getPlayersRet', playersRet => {
          this.setState({ players: playersRet });
        });
        this.socket.emit('getPlayers');

        this.socket.on('hostDisconnect', () => {
          Alert.alert('Host Disconnected', 'The Host has left the party', [{ text: 'OK' }], {
            cancelable: false
          });
          this.socket.disconnect();
          navigation.navigate('JoinGame');
        });
      } else {
        this.socket.on('getPlayers', () => {
          const { players } = this.state;
          this.socket.emit('getPlayersRet', players);
        });
      }
    });
  }

  componentWillUnmount() {
    const { type, me } = this.state;
    if (type === 'create') {
      this.socket.emit('hostDisconnect');
    } else if (type === 'join') {
      this.socket.emit('clientDisconnect', me);
    }
    this.socket.emit('leaveRoom');
    this.socket.disconnect();
  }

  render() {
    const { type, roomId, players } = this.state;
    return (
      <View style={styles.container}>
        <Text>Hi</Text>
        <Text>
          Number of Players in Lobby:
          {players.length}
        </Text>
        <Text>
          Room Id:
          {roomId}
        </Text>

        <Text>Players:</Text>
        {players.map(item => (
          <Text key={item.name}>{item.name}</Text>
        ))}
        {type === 'create' ? (
          <Button
            title="Start!"
            onPress={() =>
              Alert.alert('Not Implemented', 'Have to code the game from here', [{ text: 'OK' }], {
                cancelable: false
              })
            }
          />
        ) : (
          <Text>Waiting for host to start...</Text>
        )}
      </View>
    );
  }
}

Lobby.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

export default Lobby;

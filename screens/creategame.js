import React from 'react';
import { View, Button, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import Loader from '../components/loader';
import SOCKET_SERVER_URL from '../config/config';
import styles from '../styles/styles';

class CreateGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'Player 1', loading: false };
  }

  render() {
    const { name, loading } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Loader loading={loading} />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '25%' }}
          onChangeText={text => this.setState({ name: text })}
          value={name}
        />
        <Button
          onPress={() => {
            this.setState({ loading: true });
            this.socket = socketIOClient(SOCKET_SERVER_URL.SOCKET_SERVER_URL, {
              transports: ['websocket']
            });
            this.socket.on('connect', () => {
              this.setState({ loading: false });
              navigation.navigate('Lobby', {
                type: 'create',
                playerName: name,
                socket: this.socket
              });
            });
          }}
          title="Create"
        />
      </View>
    );
  }
}

CreateGame.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

export default CreateGame;

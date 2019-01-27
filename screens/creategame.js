import React from 'react';
import { View, Button, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../styles/styles';

class CreateGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'Player 1' };
  }

  render() {
    const { name } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '25%' }}
          onChangeText={text => this.setState({ name: text })}
          value={name}
        />
        <Button
          onPress={() => navigation.navigate('Lobby', { type: 'create', playerName: name })}
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

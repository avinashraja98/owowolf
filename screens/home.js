import React from 'react';
import { View, Button } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../styles/styles';

const Home = props => {
  return (
    <View style={styles.container}>
      <Button onPress={() => props.navigation.navigate('CreateGame')} title="Create Game" />
      <Button onPress={() => props.navigation.navigate('JoinGame')} title="Join Game" />
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

export default Home;

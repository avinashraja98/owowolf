import { createStackNavigator, createAppContainer } from 'react-navigation';
import { YellowBox } from 'react-native';
import Home from './screens/home';
import CreateGame from './screens/creategame';
import Lobby from './screens/lobby';
import JoinGame from './screens/joingame';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

const AppNavigator = createStackNavigator({
  Home: { screen: Home },
  CreateGame: { screen: CreateGame },
  JoinGame: { screen: JoinGame },
  Lobby: { screen: Lobby }
});

export default createAppContainer(AppNavigator);

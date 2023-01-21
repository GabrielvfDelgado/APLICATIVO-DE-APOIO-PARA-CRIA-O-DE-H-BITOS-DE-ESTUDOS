import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import registerRootComponent from 'expo/build/launch/registerRootComponent';

AppRegistry.registerComponent(appName, () => App);
registerRootComponent(App);
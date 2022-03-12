import { AppRegistry, LogBox } from 'react-native';
import { enableScreens } from 'react-native-screens';

import { App } from './App';

// ignore warnings about deprecated methods in RN
LogBox.ignoreLogs(['EventEmitter.', 'new NativeEventEmitter()']);

enableScreens(false);

AppRegistry.registerComponent('main', () => App);

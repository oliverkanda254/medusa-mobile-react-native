/**
 * @format
 */

import 'react-native-url-polyfill/auto';

import {AppRegistry} from 'react-native';
import App from './app/app';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

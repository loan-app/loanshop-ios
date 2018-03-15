import {NativeModules} from 'react-native';
const RNStatusBar = NativeModules.RNStatusBar;

export function setDark() {
  RNStatusBar && RNStatusBar.setDark();
}

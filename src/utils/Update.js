import {NativeModules} from 'react-native';
const RNUpdate = NativeModules.RNUpdate;

export function autoUpdate(updateUrl,uploadUrl) {
  RNUpdate && RNUpdate.autoUpdate(updateUrl, uploadUrl);
}

export function checkUpdate(name) {
  RNUpdate && RNUpdate.checkUpdate(name);
}
import {
  Dimensions,
  Platform,
  StatusBar,
  PixelRatio,
  NativeModules
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

global.version = DeviceInfo.getBuildNumber();
global.os = Platform.OS;
const AndroidCn = NativeModules.RNChannel && NativeModules.RNChannel.channel || 'test';
const iOSCn = __DEV__ ? "test" : "iphone";
export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const STATUS_HEIGHT = Platform.OS === 'ios' ? 20 : 20;
export const BORDER_WIDTH = 1 / PixelRatio.get();
export const OS = Platform.OS;
export const PackageName = DeviceInfo.getBundleId();
export const Channel = OS === "ios" ? iOSCn : AndroidCn;
export const InnerVersion = "1";
export const WeChatKey = "";
export const ItunesId = "com.wcz.app";
export const TDkey = OS === "ios" ? "F8EEB5B98AEE4597984274DA18B0E2E9" : "AF1FA0E532384161BEDE63D225B84A11";

import {NativeModules} from 'react-native';
// const RNTD = NativeModules.RNTD;
const RNTD=null;

export function init(appId, channelId) {
  RNTD && RNTD.init(appId, channelId);
}

export function onRegister(name) {
  RNTD && RNTD.onRegister(name);
}

export function onLogin(name) {
  RNTD && RNTD.onLogin(name);
}

export function onPay(userId, orderId, amount, payType) {
  RNTD && RNTD.onPay(userId, orderId, amount, payType);
}
import * as types from '../actions/actionTypes';
import {login as _login, getUserProfile, sign, logout} from '../requests/http';
import {loginUser as _loginUser, logoutUser as _logoutUser} from '../requests/axios';

export function userProfile(loading,time=0) {
  return dispatch => {
    dispatch(requestData({loading}));
    setTimeout(()=>{
      getUserProfile().then(data => {
        const user = data.data.data;
        if (data.data.code == 0) {
          const check = [
            {
              routeName: 'Authentication',
              checked: user.isAuthenticated,
              tip: user.isAuthenticated ? '已认证' : '未认证'
            },
            {
              routeName: 'BankCardBind',
              checked: user.isBindBankCard,
              tip: user.isBindBankCard ? '已绑定' : '未绑定'
            },
            {
              routeName: 'PayPasswordInit',
              checked: user.isSetTradingPassword
            }
          ];
          user.total = user.redPacketMoney + user.inviteRewards + user.platformRewards + user.totleInterestMoney;
          dispatch(receiveUserProfile({userInfo: user, check: check}));
        } else {
          dispatch(receiveUserProfile({error: true, msg: data.data.msg}));
        }
      }).catch(err => {
        dispatch(receiveUserProfile({error: true, msgStr: 'netWorkError'}));
      });
    },time);
  }
}

export function userSign(signing) {
  return dispatch => {
    dispatch(requestData({signing}));
    sign().then(data => {
      if (data.data.code == 0) {
        dispatch(receiveUserSign({}));
      } else {
        dispatch(receiveUserSign({error: true, msg: data.data.msg}));
      }
    }).catch(err => {
      dispatch(receiveUserSign({error: true, msgStr: 'netWorkError'}));
    });
  }
}

export function userLogout() {
  return dispatch => {
    logout({token: global.token});
    _logoutUser();
  }
}

function requestData(data) {
  return {
    type: types.REQUEST_USER_LOGIN,
    ...data
  }
}

function receiveData(data) {
  return {
    type: types.RECEIVE_USER_LOGIN,
    ...data
  }
}

function receiveUserProfile(data) {
  return {
    type: types.RECEIVE_USER_INFO,
    ...data
  }
}

function receiveUserSign(data) {
  return {
    type: types.RECEIVE_USER_SIGN,
    ...data
  }
}
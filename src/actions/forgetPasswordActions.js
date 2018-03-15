import * as types from '../actions/actionTypes';
import {sendCode as _sendCode,forget} from '../requests/http';
import {OS} from '../config/constants';
import {logoutUser} from '../requests/axios';

export function passwordRest(registing, mobile, code, pwd) {
  return dispatch => {
    dispatch(requestData({registing, error: false}));
    // setTimeout(()=>{dispatch(receiveRest({}));},200);
    // return;
    forget({mobile, code, pwd}).then(data => {
      if (data.data.code == 0) {
        logoutUser();
        dispatch(receiveRest({}));
      } else {
        dispatch(receiveRest({error: true, msg: data.data.msg}));
      }
    }).catch(err => {
      dispatch(receiveRest({error: true, msgStr: 'netWorkError'}));
    });
  }
}

export function sendCode(sending,mobile) {
  return dispatch => {
    dispatch(requestData({sending,error:false}));
    // setTimeout(()=>{dispatch(receiveData({}));},200);
    // return;
    _sendCode({mobile,type:2,clientType:OS=='ios'?2:1}).then(data=>{
      if(data.data.code==0){
        dispatch(receiveData({}));
      }else{
        dispatch(receiveData({error:true,msg:data.data.msg}));
      }
    }).catch(err=>{
      dispatch(receiveData({error:true,msgStr:'netWorkError'}));
    });
  }
}


function requestData(data) {
  return {
    type: types.REQUEST_FORGET,
    ...data
  }
}

function receiveData(data) {
  return {
    type: types.RECEIVE_SEND_CODE,
    ...data
  }
}

function receiveRest(data) {
  return {
    type: types.RECEIVE_FORGET_PASSWORD,
    ...data
  }
}
import * as types from '../actions/actionTypes';
import {bankCardDetail} from '../requests/http';

export function getData(loading) {
  return dispatch => {
    dispatch(requestData({loading}));
    bankCardDetail().then(data => {
      if (data.data.code == 0) {
        dispatch(receiveData({detail: data.data.data}));
      } else {
        dispatch(receiveData({error: true, msg: data.data.msg}));
      }
    }).catch(err => {
      dispatch(receiveData({error: true, msgStr: 'netWorkError'}));
    });
  }
}

function requestData(data) {
  return {
    type: types.REQUEST_BANKCARD_DETAIL,
    ...data
  }
}

function receiveData(data) {
  return {
    type: types.RECEIVE_BANKCARD_DETAIL,
    ...data
  }
}
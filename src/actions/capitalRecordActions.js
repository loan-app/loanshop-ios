import * as types from '../actions/actionTypes';
import {capitalRecord} from '../requests/http';

export function getData(isRefreshing, isLoadMore, loading, pageNumber = 1, ctype) {
  return dispatch => {
    dispatch(requestData({isRefreshing, isLoadMore, loading,ctype}));
    capitalRecord({pageNumber, cashType: ctype}).then(data => {
      if (data.data.code == 0) {
        dispatch(receiveData({list: data.data.data.list}));
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
    type: types.REQUEST_CAPITAL_RECORD,
    ...data
  }
}

function receiveData(data) {
  return {
    type: types.RECEIVE_CAPITAL_RECORD,
    ...data
  }
}
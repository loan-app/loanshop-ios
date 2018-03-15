import * as types from '../actions/actionTypes';
import {investList} from '../requests/http';

export function getData(isRefreshing, isLoadMore, loading, status, pageNumber = 1) {
  return dispatch => {
    dispatch(requestData({isRefreshing, isLoadMore, loading}));
    investList({pageNumber, status}).then(data => {
      if (data.data.code == 0) {
        dispatch(receiveData({list: data.data.data.investList}));
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
    type: types.REQUEST_CAPITAL_LIST,
    ...data
  }
}

function receiveData(data) {
  return {
    type: types.RECEIVE_CAPITAL_LIST,
    ...data
  }
}
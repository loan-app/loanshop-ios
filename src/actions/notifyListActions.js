import * as types from '../actions/actionTypes';
import {getNotification} from '../requests/http';

export function getData(isRefreshing, isLoadMore, loading, pageNumber = 1) {
  return dispatch => {
    dispatch(requestData({isRefreshing, isLoadMore, loading}));
    getNotification({pageNumber}).then(data => {
      if (data.data.code == 0) {
        dispatch(receiveData({list: data.data.data}));
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
    type: types.REQUEST_NOTIFY_LIST,
    ...data
  }
}

function receiveData(data) {
  return {
    type: types.RECEIVE_NOTIFY_LIST,
    ...data
  }
}
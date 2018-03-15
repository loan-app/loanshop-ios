import * as types from '../actions/actionTypes';
import {financeDetail} from '../requests/http';

export function getData(loading, isRefreshing, id) {
  return dispatch => {
    dispatch(requestData({loading, isRefreshing}));
    financeDetail({id}).then(data => {
      if (data.data.code == 0) {
        if (data.data.data.financePicList) {
          data.data.data.financePicList = data.data.data.financePicList.map(item => {
            item.url = item.picPath;
            return item;
          });
        }
        dispatch(receiveData({detail: data.data.data}));
      } else {
        dispatch(receiveData({error: true, msg: data.data.msg}));
      }
    }).catch(err => {
      dispatch(receiveData({error: true, msgStr: 'netWorkError'}));
    });
  }
}

export function clearCache() {
  return {
    type: types.CLEAR_FINANCE_CACHE
  }
}

function requestData(data) {
  return {
    type: types.REQUEST_FINANCE_DETAIL,
    ...data
  }
}

function receiveData(data) {
  return {
    type: types.RECEIVE_FINANCE_DETAIL,
    ...data
  }
}
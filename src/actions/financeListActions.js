import * as types from '../actions/actionTypes';
import {financeList} from '../requests/http';

export function getData(isRefreshing, isLoadMore, loading, pageNumber = 1) {
  return dispatch => {
    dispatch(requestData({isRefreshing, isLoadMore, loading, noMore: false}));
    financeList({pageNumber}).then(data => {
      if (data.data.code == 0) {
        dispatch(receiveData({list: data.data.data.financeBaseList || []}));
      } else {
        dispatch(receiveData({error: true, msg: data.data.msg}));
      }
    }).catch(err => {
      dispatch(receiveData({error: true, msgStr: 'netWorkError'}));
    });
  }
}

export function refresh() {
  return dispatch => {
    financeList({pageNumber: 1}).then(data => {
      if (data.data.code == 0) {
        dispatch(refreshData({list: data.data.data.financeBaseList || []}));
      }
    }).catch(err => {
    });
  }
}


function requestData(data) {
  return {
    type: types.REQUEST_FINANCE_LIST,
    ...data
  }
}

function receiveData(data) {
  return {
    type: types.RECEIVE_FINANCE_LIST,
    ...data
  }
}

function refreshData(data) {
  return {
    type: types.REFRESH_FINANCE_LIST,
    ...data
  }
}
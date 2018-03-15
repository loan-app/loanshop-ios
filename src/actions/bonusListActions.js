import * as types from '../actions/actionTypes';
import {bonusList} from '../requests/http';

export function getData(isRefreshing, isLoadMore, loading, ctype, isOverdue = 0, pageNumber = 1, navi) {
  return dispatch => {
    dispatch(requestData({isRefreshing, isLoadMore, loading, ctype}));
    if (!navi) {
      bonusList({pageNumber, isOverdue, type: ctype}).then(data => {
        if (data.data.code == 0) {
          dispatch(receiveData({list: data.data.data.memberCouponList}));
        } else {
          dispatch(receiveData({error: true, msg: data.data.msg}));
        }
      }).catch(err => {
        dispatch(receiveData({error: true, msgStr: 'netWorkError'}));
      });
    }
  }
}


function requestData(data) {
  return {
    type: types.REQUEST_BONUS_LIST,
    ...data
  }
}

function receiveData(data) {
  return {
    type: types.RECEIVE_BONUS_LIST,
    ...data
  }
}
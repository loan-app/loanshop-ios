import * as types from '../actions/actionTypes';
import {orderDetail} from '../requests/http';

export function getData(loading,id) {
  return dispatch => {
    dispatch(requestData({loading}));
    orderDetail({id}).then(data=>{
      if(data.data.code==0){
        dispatch(receiveData({detail:data.data.data}));
      }else{
        dispatch(receiveData({error:true,msg:data.data.msg}));
      }
    }).catch(err=>{
      dispatch(receiveData({error:true,msgStr:'netWorkError'}));
    });
  }
}

export function clearCache(){
  return {
    type:types.CLEAR_ORDERDETAIL_CACHE
  }
}

function requestData(data) {
  return {
    type: types.REQUEST_ORDER_DETAIL,
    ...data
  }
}

function receiveData(data) {
  return {
    type: types.RECEIVE_ORDER_DETAIL,
    ...data
  }
}
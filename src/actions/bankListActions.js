import * as types from '../actions/actionTypes';
import {getBankList} from '../requests/http';

export function getData(loading) {
  return dispatch => {
    dispatch(requestData({loading}));
    getBankList().then(data=>{
      if(data.data.code==0){
        dispatch(receiveData({list:data.data.data.bankDataList}));
      }else{
        dispatch(receiveData({error:true,msg:data.data.msg}));
      }
    }).catch(err=>{
      dispatch(receiveData({error:true,msgStr:'netWorkError'}));
    });
  }
}

function requestData(data){
  return {
    type: types.REQUEST_BANK_LIST,
    ...data
  }
}

function receiveData(data) {
  return {
    type: types.RECEIVE_BANK_LIST,
    ...data
  }
}
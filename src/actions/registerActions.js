import * as types from '../actions/actionTypes';
import {register as _register} from '../requests/http';
import {OS} from '../config/constants';

export function register(loading,pdata) {
  return dispatch => {
    dispatch(requestData({loading,error:false}));
    // setTimeout(()=>{dispatch(receiveData({}));},200);
    // return;
    _register(pdata).then(data=>{
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
    type: types.REQUEST_USER_REGISTER,
    ...data
  }
}

function receiveData(data) {
  return {
    type: types.RECEIVE_USER_REGISTER,
    ...data
  }
}
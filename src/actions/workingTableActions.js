import * as types from '../actions/actionTypes';
import {getHome, getBanner as _getBanner, getAds as _getAds,getNotification as _getNotification, getCompanyName as _getCompanyName} from '../requests/http';

export function getData(loading) {
  return dispatch => {
    dispatch(requestData({loading}));
    getHome().then(data => {
      if (data.data.code == 0) {
        dispatch(receiveProfile({list: data.data.data.financeBaseList}));
      } else {
        dispatch(receiveProfile({error: true, msg: data.data.msg}));
      }
    }).catch(err => {
      dispatch(receiveProfile({error: true, msgStr: 'netWorkError'}));
    });
  }
}

export function getBanner() {
  return dispatch => {
    _getBanner().then(data => {
      if (data.data.code == 0) {
        dispatch(receiveBanner({banner: data.data.data.bannerDataList}));
      }
    });
  }
}

export function getAds() {
  return dispatch => {
    _getAds().then(data => {
      if (data.data.code == 0) {
        const adOperationsList=data.data.data.adOperationsList;
        if(adOperationsList&&adOperationsList.length>2){
          global.https=adOperationsList[2].link.indexOf("https")>-1?"s":"";
        }
        dispatch(receiveAds({ads: adOperationsList}));
      }
    });
  }
}

export function getNotification() {
  return dispatch => {
    _getNotification({position:'index'}).then(data => {
      if (data.data.code == 0) {
      dispatch(receiveNotification({notification: data.data.data}));
      }
    });
  }
}

export function getCompanyName() {
  return dispatch => {
    _getCompanyName().then(data => {
      if (data.data.code == 0) {
        dispatch(receiveCompanyName({companyName:data.data.data}))
      }
    })
  }
}

function requestData(data) {
  return {
    type: types.REQUEST_WORKINGTABLE,
    ...data
  }
}

function receiveProfile(data) {
  return {
    type: types.RECEIVE_WORKINGTABLE_INFO,
    ...data
  }
}

function receiveBanner(data) {
  return {
    type: types.RECEIVE_BANNER,
    ...data
  }
}

function receiveAds(data) {
  return {
    type: types.RECEIVE_ADS,
    ...data
  }
}

function receiveNotification(data) {
  return {
    type: types.RECEIVE_NOTIFICATION,
    ...data
  }
}

function receiveCompanyName(data) {
  return {
    type: types.RECEIVE_COMPANYNAME,
    ...data
  }
}
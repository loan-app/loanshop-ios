import * as types from '../actions/actionTypes';


export function hideSplash() {
  return dispatch=> {
    dispatch(_splashHide({visible:false}));
  }
}

function _splashHide(data) {
  return {
    type: types.SPLASH_HIDE,
    ...data
  }
}
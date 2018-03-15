import * as types from '../actions/actionTypes';

const initialState={
  registing: false,
  sending:false,
  error: false
};

export default function passwordEdit(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_FORGET:
      return Object.assign({}, state, action);
    case types.RECEIVE_FORGET_PASSWORD:
      if (action.error) {
        return Object.assign({}, state, {
          registing: false,
          error: action.error,
          msg:action.msg
        });
      }
      return Object.assign({}, state, {
        registing: false,
        error: false
      });
    case types.RECEIVE_SEND_CODE:
      if (action.error) {
        return Object.assign({}, state, {
          sending: false,
          error: action.error,
          msg:action.msg
        });
      }
      return Object.assign({}, state, {
        sending: false,
        error: false
      });
    default:
      return state;
  }
}
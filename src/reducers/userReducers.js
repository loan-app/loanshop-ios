import * as types from '../actions/actionTypes';

const initialState = {
  logining: false,
  loading: false,
  signing: false,
  userInfo: {},
  check: [{}, {}, {}],
  error: false
};

export default function user(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_USER_LOGIN:
      return Object.assign({}, state, action);
    case types.RECEIVE_USER_INFO:
      if (action.error) {
        return Object.assign({}, state, {
          loading: false,
          error: action.error,
          msg: action.msg
        });
      }
      return Object.assign({}, state, {
        loading: false,
        userInfo: action.userInfo,
        check: action.check,
        error: false
      });
    default:
      return state;
  }
}
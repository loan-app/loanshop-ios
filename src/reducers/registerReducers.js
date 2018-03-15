import * as types from '../actions/actionTypes';

const initialState={
  loading: false,
  error: false
};

export default function register(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_USER_REGISTER:
      return Object.assign({}, state, action);
    case types.RECEIVE_USER_REGISTER:
      if (action.error) {
        return Object.assign({}, state, {
          loading: false,
          error: action.error,
          msg:action.msg
        });
      }
      return Object.assign({}, state, {
        loading: false,
        error: false
      });
    default:
      return state;
  }
}
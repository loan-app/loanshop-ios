import * as types from '../actions/actionTypes';

const initialState = {
  loading: false,
  list: null,
  error: false
};

export default function bankList(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_BANK_LIST:
      return Object.assign({}, state, action);
    case types.RECEIVE_BANK_LIST:
      if (action.error) {
        return Object.assign({}, state, {
          loading: false,
          error: action.error,
          msg: action.msg
        });
      }
      return Object.assign({}, state, {
        loading: false,
        list: action.list,
        error: false
      });
    default:
      return state;
  }
}


import * as types from '../actions/actionTypes';

const initialState = {
  loading: false,
  error: false,
  detail: null
};

export default function bankCardDetail(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_BANKCARD_DETAIL:
      return Object.assign({}, state, action);
    case types.RECEIVE_BANKCARD_DETAIL:
      if (action.error) {
        return Object.assign({}, state, {
          loading: false,
          error: action.error,
          msg: action.msg
        });
      }
      return Object.assign({}, state, {
        loading: false,
        error: false,
        detail: action.detail
      });
    case types.CLEAR_BANKCARD_CACHE:
      return Object.assign({}, state, {detail: null});
    default:
      return state;
  }
}
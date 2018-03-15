import * as types from '../actions/actionTypes';

const initialState = {
  loading: false,
  error: false,
  detail: {}
};

export default function capitalDetail(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_CAPITAL_DETAIL:
      return Object.assign({}, state, action);
    case types.RECEIVE_CAPITAL_DETAIL:
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
    case types.CLEAR_CAPITAL_CACHE:
      return Object.assign({}, state, {detail: {}});
    default:
      return state;
  }
}
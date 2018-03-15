import * as types from '../actions/actionTypes';

const initialState = {
  loading: false,
  error: false,
  home: {},
  ads: null,
  list: null,
  banner: null,
  notification: null
};

export default function workingTable(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_WORKINGTABLE:
      return Object.assign({}, state, action);
    case types.RECEIVE_WORKINGTABLE_INFO:
      if (action.error) {
        return Object.assign({}, state, {
          error: action.error,
          msg: action.msg,
          loading: false
        });
      }
      return Object.assign({}, state, {
        error: false,
        list: action.list,
        loading: false
      });
    case types.RECEIVE_BANNER:
      if (!action.error) {
        return Object.assign({}, state, {
          banner: action.banner,
        });
      }
    case types.RECEIVE_ADS:
      if (!action.error) {
        return Object.assign({}, state, {
          ads: action.ads,
        });
      }
    case types.RECEIVE_NOTIFICATION:
      if (!action.error) {
        return Object.assign({}, state, {
          notification: action.notification,
        });
      }
    default:
      return state;
  }
}
import * as types from '../actions/actionTypes';

const initialState = {
  isRefreshing: false,
  isLoadMore: false,
  loading: false,
  noMore: false,
  error: false,
  list: []
};

export default function capitalList(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_CAPITAL_LIST:
      return Object.assign({}, state, action);
    case types.RECEIVE_CAPITAL_LIST:
      if (action.error) {
        return Object.assign({}, state, {
          isRefreshing: false,
          isLoadMore: false,
          error: action.error,
          loading: false
        });
      }
      return Object.assign({}, state, {
        isRefreshing: false,
        isLoadMore: false,
        error: false,
        noMore: action.list.length < 10,
        list: state.isLoadMore
          ? loadMore(state, action)
          : combine(state, action),
        loading: false
      });
    default:
      return state;
  }
}

function combine(state, action) {
  state.list = action.list;
  return state.list;
}

function loadMore(state, action) {
  state.list = state.list.concat(action.list);
  return state.list;
}
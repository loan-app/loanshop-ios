import * as types from '../actions/actionTypes';

const initialState = {
  ctype: '1',
  "1": {
    isRefreshing: false,
    isLoadMore: false,
    loading: false,
    noMore: false,
    list:[]
  },
  "4": {
    isRefreshing: false,
    isLoadMore: false,
    loading: false,
    noMore: false,
    list:[]
  },
};

export default function bonusList(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_BONUS_LIST:
      const _state_ = {ctype: action.ctype};
      _state_[action.ctype] = Object.assign({}, state[action.ctype], action);
      return Object.assign({}, state, _state_);
    case types.RECEIVE_BONUS_LIST:
      const _state = {};
      if (action.error) {
        _state[state.ctype] = {
          isRefreshing: false,
          isLoadMore: false,
          error: action.error,
          loading: false
        };
        return Object.assign({}, state, _state);
      }
      _state[state.ctype] = {
        isRefreshing: false,
        isLoadMore: false,
        error: false,
        noMore: action.list.length < 10,
        list: state[state.ctype].isLoadMore ? loadMore(state, action) : combine(state, action),
        loading: false
      };
      return Object.assign({}, state, _state);
    default:
      return state;
  }
}

function combine(state, action) {
  state[state.ctype].list = action.list;
  return state[state.ctype].list;
}

function loadMore(state, action) {
  state[state.ctype].list = state[state.ctype].list.concat(action.list);
  return state[state.ctype].list;
}
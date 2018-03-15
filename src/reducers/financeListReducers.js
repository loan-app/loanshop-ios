import * as types from '../actions/actionTypes';

const initialState = {
  isRefreshing: false,
  isLoadMore: false,
  loading: false,
  noMore: false,
  error: false,
  initLen:0,
  list: []
};

export default function financeList(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_FINANCE_LIST:
      return Object.assign({}, state, action);
    case types.RECEIVE_FINANCE_LIST:
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
        initLen:!state.isLoadMore?action.list.length:state.initLen,
        noMore: state.isLoadMore && action.list.length < 10,
        list: state.isLoadMore
          ? loadMore(state, action)
          : combine(state, action),
        loading: false
      });
      case types.REFRESH_FINANCE_LIST:
        const _list=state.list;
        _list.splice(0,state.initLen);
        let list=action.list;
        list=list.concat(_list);
        return Object.assign({}, state, {
          initLen:action.list.length,
          list
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
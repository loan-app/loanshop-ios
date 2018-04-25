import * as types from '../actions/actionTypes';
import moment from 'moment';

const initialState = {
  isRefreshing: false,
  isLoadMore: false,
  loading: false,
  noMore: false,
  error: false
  // ctype: "1",
  // "1": {
  //   isRefreshing: false,
  //   isLoadMore: false,
  //   loading: false,
  //   noMore: false,
  //   loaded: false,
  //   list: {},
  //   monthList: []
  // },
  // "21": {
  //   isRefreshing: false,
  //   isLoadMore: false,
  //   loading: false,
  //   noMore: false,
  //   loaded: false,
  //   list: {},
  //   monthList: []
  // },
  // "3": {
  //   isRefreshing: false,
  //   isLoadMore: false,
  //   loading: false,
  //   noMore: false,
  //   loaded: false,
  //   list: {},
  //   monthList: []
  // },
  // "7": {
  //   isRefreshing: false,
  //   isLoadMore: false,
  //   loading: false,
  //   noMore: false,
  //   loaded: false,
  //   list: {},
  //   monthList: []
  // },
  // "41": {
  //   isRefreshing: false,
  //   isLoadMore: false,
  //   loading: false,
  //   noMore: false,
  //   loaded: false,
  //   list: {},
  //   monthList: []
  // }
};

export default function capitalRecord(state = initialState, action = {}) {
  // switch (action.type) {
  //   case types.REQUEST_CAPITAL_RECORD:
  //     const _state_ = {ctype: action.ctype};
  //     _state_[action.ctype] = Object.assign({}, state[action.ctype], action);
  //     return Object.assign({}, state, _state_);
  //   case types.RECEIVE_CAPITAL_RECORD:
  //     const _state = {};
  //     if (action.error) {
  //       _state[state.ctype] = {
  //         isRefreshing: false,
  //         isLoadMore: false,
  //         error: action.error,
  //         loading: false
  //       };
  //       return Object.assign({}, state, _state);
  //     }
  //     const data = (state[state.ctype].isLoadMore ? loadMore(state, action) : combine(state, action));
  //     _state[state.ctype] = {
  //       isRefreshing: false,
  //       isLoadMore: false,
  //       loaded: true,
  //       error: false,
  //       noMore: action.list.length < 10,
  //       loading: false,
  //       ...data,
  //     };
  //     return Object.assign({}, state, _state);
  //   default:
  //     return state;
  // }
  switch (action.type) {
    case types.REQUEST_CAPITAL_RECORD:
        let _state_ = {};
        _state_ = Object.assign({}, state, action);
        return Object.assign({}, state, _state_);
    case types.RECEIVE_CAPITAL_RECORD:
        let _state = {};
        if (action.error) {
          _state[state.ctype] = {
            isRefreshing: false,
            isLoadMore: false,
            error: action.error,
            loading: false
          };
          return Object.assign({}, state, _state);
        }
        console.log('capitalRecordFunction1', action)
      console.log('capitalRecordFunction2', state)
        const data = (state.isLoadMore ? loadMore(state, action) : combine(state, action));
        _state = {
          isRefreshing: false,
          isLoadMore: false,
          loaded: true,
          error: false,
          noMore: action.list.length < 10,
          loading: false,
          ...data,
        };
        console.log('capitalRecordFunction3', _state)
        return Object.assign({}, state, _state);
    default:
        return state;
  }
}

// function combine(state, action) {
//   state[state.ctype].list = {};
//   state[state.ctype].monthList = [];
//   action.list && action.list.map(item => {
//     const month=moment(item.createdAt,"YYYY-MM-DD").format("YYYY年M月");
//     if (state[state.ctype].monthList.indexOf(month) < 0) {
//       state[state.ctype].monthList.push(month);
//       state[state.ctype].list[month] = [item];
//     } else {
//       state[state.ctype].list[month].push(item);
//     }
//   });
//   return {list: state[state.ctype].list, monthList: state[state.ctype].monthList};
// }
//
// function loadMore(state, action) {
//   action.list && action.list.map(item => {
//     const month=moment(item.createdAt,"YYYY-MM-DD").format("YYYY年M月");
//     if (state[state.ctype].monthList.indexOf(month) < 0) {
//       state[state.ctype].monthList.push(month);
//       state[state.ctype].list[month] = [item];
//     } else {
//       state[state.ctype].list[month].push(item);
//     }
//   });
//   return {list: state[state.ctype].list, monthList: state[state.ctype].monthList};
// }

function combine(state, action) {
  state.list = action.list
  return {list: state.list};
}

function loadMore(state, action) {
  console.log('capitalRecordFunction3LoadMore', JSON.stringify(state.list))
  state.list = state.list.concat(action.list)
  return {list: state.list};
}
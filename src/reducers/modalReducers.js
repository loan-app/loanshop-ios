import * as types from '../actions/actionTypes';

const initialState={
  visible:false,
  children:null,
  swipeClose:false
};

export default function modal(state = initialState, action = {}) {
  switch (action.type) {
    case types.TOGGLE_MODAL:
      return Object.assign({}, state, action);
    default:
      return state;
  }
}
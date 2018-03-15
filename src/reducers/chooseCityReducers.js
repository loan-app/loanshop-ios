import * as types from '../actions/actionTypes';

const initialState={
  currentCity:''
};

export default function chooseCity(state = initialState, action = {}) {
  switch (action.type) {
    case types.TOGGLE_MODAL:
      return Object.assign({}, state, action);
    default:
      return state;
  }
}
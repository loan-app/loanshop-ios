import * as types from '../actions/actionTypes';


export function toggleModal(children, swiperClose = false, time = 0) {
  return (dispatch, getState) => {
    if (children) {
      setTimeout(() => {
        dispatch(_toggleModal({
          visible: !getState().modal.visible,
          children: children,
          swiperClose
        }));
      }, time);
    } else {
      setTimeout(() => {
        dispatch(_toggleModal({visible: !getState().modal.visible, swiperClose}));
      }, time);
    }
  }
}

function _toggleModal(data) {
  return {
    type: types.TOGGLE_MODAL,
    ...data
  }
}
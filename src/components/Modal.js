import React, {Component} from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import globalStyles from '../styles/global';

import * as modalCreator from '../actions/modalActions';

import ModalBox from 'react-native-modalbox';

class Modal extends Component {

  constructor(props) {
    super(props);
  }


  render() {
    const {modalActions,modal} = this.props;
    return (
      <ModalBox
        style={globalStyles.modalBox}
        ref={ref => {
          this.modal = ref
        }}
        backButtonClose={true}
        onClosed={()=>{modal.visible&&modalActions.toggleModal()}}
        swipeToClose={modal.swipeClose}>
        {modal.children}
      </ModalBox>
    )
  }

  componentWillReceiveProps(nextProps){
    const {modal} = nextProps;
    if(modal.visible){
      this.modal&&this.modal.open();
    }else{
      this.modal&&this.modal.close();
    }
  }
}

const mapStateToProps = (state) => {
  const {modal} = state;
  return {modal};
};

const mapDispatchToProps = (dispatch) => {
  const modalActions = bindActionCreators(modalCreator, dispatch);
  return {modalActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
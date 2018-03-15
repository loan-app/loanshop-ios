import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, requireNativeComponent} from 'react-native';
import {OS} from '../config/constants';

const RCTMyView = (OS==="ios"?requireNativeComponent('RCTMyView', MyView):()=><View/>);
export default class MyView extends Component {

  static propTypes = {
    value: PropTypes.number,
    isTest1: PropTypes.bool,
    num: PropTypes.number,
    infoDict: PropTypes.object,
  };

  render() {
    return (
      <RCTMyView
        {...this.props}
      >
      </RCTMyView>
    );
  }
}

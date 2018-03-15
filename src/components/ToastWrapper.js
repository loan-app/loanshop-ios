import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StatusBar,
  View,
  Text
} from 'react-native';
import imgs from '../resources/imgs';

import {
  WINDOW_WIDTH as windowWidth,
  WINDOW_HEIGHT as windowHeight
} from '../config/constants';

export const TOAST_TYPES = {
  SUCCESS: 'success',
  TIP: 'tip'
};

export default class ToastWrapper extends Component{
  constructor(props){
    super(props);
    this.animatedXValue = new Animated.Value(-windowWidth);
    this.animatedOpacityValue = new Animated.Value(0);
    this.state = {
      toastAlreadyShow: false,
      toastText: "",
      toastType: TOAST_TYPES.TIP
    };
  }

  getChildContext() {
    return {
      callToast: this.callToast.bind(this),
      closeToast: this.closeToast.bind(this)
    };
  }

  callToast(text, type) {
    if(this.state.toastAlreadyShow) return void 0;
    this.setState({
      toastAlreadyShow: true,
      toastText: text,
      toastType: type || TOAST_TYPES.TIP
    });
    Animated.sequence([
      Animated.timing(this.animatedXValue, {
        toValue: 0,
        duration: 0
      }),
      Animated.timing(this.animatedOpacityValue, {
        toValue: 1,
        duration: 0
      })
    ]).start(this.closeToast.bind(this));
  }

  closeToast() {
    this.timer=setTimeout(() => {
      this.setState({ toastAlreadyShow: false });
      Animated.sequence([
        Animated.timing(this.animatedOpacityValue, {
          toValue: 0,
          duration: 300
        }),
        Animated.timing(this.animatedXValue, {
          toValue: -windowWidth,
          duration: 0
        })
      ]).start();
    }, 1000)
  }

  _getToastPosition(type){
    switch (type){
      case 'top':
        return 70;
      case 'bottom':
        return windowHeight - 70;
      default:
        return Math.floor((windowHeight - 130) / 2)
    }
  }

  _getSuccessToastContent(text){
    return (
      <View style={{
        width: 120,
        height: 120,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center'
        }}>
        { imgs.successTip({ width: 45, height: 45, marginBottom: 5}) }
        <Text style={{color: '#FFF'}}>{text}</Text>
      </View>
    );
  }

  _getTipToastContent(text){
    return (
      <View style={{
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.65)'}}>
        <Text style={{color: '#FFF'}}>{text}</Text>
      </View>
    );
  }

  _getToastContent(){
    return this.state.toastType === TOAST_TYPES.TIP ?
      this._getTipToastContent(this.state.toastText) :
      this._getSuccessToastContent(this.state.toastText);
  }

  componentWillUnmount(){
    this.timer&&clearTimeout(this.timer);
  }

  render(){
    let top = this._getToastPosition(this.props.positionType);
    return (
      <View style={{flex: 1, position: 'relative'}}>
        { this.props.children }
        <Animated.View style={{
          transform: [{ translateX: this.animatedXValue }],
          opacity: this.animatedOpacityValue,
          position: 'absolute',
          left:0,
          height: 130,
          top: top,
          width: windowWidth,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          { this._getToastContent() }
        </Animated.View>
      </View>
    );
  }
}

ToastWrapper.propTypes = {
  positionType: PropTypes.oneOf(['top', 'bottom', 'middle'])
};

ToastWrapper.defaultProps = {
  positionType: 'middle'
};

ToastWrapper.childContextTypes = {
  callToast: PropTypes.func.isRequired,
  closeToast: PropTypes.func.isRequired
};

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import styled from 'styled-components/native';

const dismissKeyboard = require('dismissKeyboard');

import color from '../styles/color';

import {WINDOW_WIDTH, WINDOW_HEIGHT, BORDER_WIDTH,STATUS_HEIGHT} from '../config/constants';
import Touchable from './Touchable';

const styles = StyleSheet.create({
  blockWrapper: {
    backgroundColor: '#FFF'
  },
  grayBottom: {
    borderBottomColor: color.border.separatorGray
  }
});

/**
 * Block wrapper, used to add bottom or top margin
 * **/
export class BlockWrapper extends PureComponent {
  render() {
    let marginType = this.props.marginType,
      marginValue = this.props.marginValue,
      wrapperStyle = {};
    if (marginType === 'both') {
      wrapperStyle.paddingTop = marginValue;
      wrapperStyle.paddingBottom = marginValue;
    } else if (marginType === 'top') {
      wrapperStyle.paddingTop = marginValue;
    } else if (marginType === 'bottom') {
      wrapperStyle.paddingBottom = marginValue;
    }
    return (
      <View style={[wrapperStyle]}>
        <View style={[{backgroundColor: "#FFF"}, this.props.style]}>
          {this.props.children}
        </View>
      </View>
    );
  }
}

BlockWrapper.propTypes = {
  marginType: PropTypes.oneOf(['top', 'bottom', 'both', 'none']).isRequired,
  marginValue: PropTypes.number,
  style: PropTypes.any
};

BlockWrapper.defaultProps = {
  marginType: 'bottom',
  marginValue: 12
};


/**
 * Gray bottom, used to add a gray bottom
 * **/
export class GrayBottom extends PureComponent {
  render() {
    return <View style={[styles.grayBottom, this.props.style]}>{this.props.children}</View>
  }
}

GrayBottom.propTypes = {
  style: PropTypes.any
};

/**
 * Row Wrapper, used to add horizontal padding
 * **/
export class RowWrapper extends PureComponent {
  render() {
    return <View style={[{
      paddingLeft: this.props.leftPadding,
      paddingRight: this.props.rightPadding
    }, this.props.style]}>{this.props.children}</View>
  }
}

RowWrapper.propTypes = {
  leftPadding: PropTypes.number,
  rightPadding: PropTypes.number,
  style: PropTypes.any
};

RowWrapper.defaultProps = {
  leftPadding: 15,
  rightPadding: 15
};

/**
 * Gray bottom row
 * **/
export class GrayBottomRowWrapper extends PureComponent {
  render() {
    return (
      <View style={{paddingLeft: 15}}>
        <View style={[styles.grayBottom, {
          paddingRight: 15,
          borderBottomWidth: this.props.borderWidth
        }, this.props.style]}>{this.props.children}</View>
      </View>
    );
  }
}

GrayBottomRowWrapper.propTypes = {
  borderWidth: PropTypes.number.isRequired
};

GrayBottomRowWrapper.defaultProps = {
  borderWidth: 1
};

/**
 * 等待提示 Modal
 * **/

export class ActivityIndicatorModal extends PureComponent {
  render() {
    return (
      <Modal
        onRequestClose={() => {
        }}
        transparent={true}
        visible={this.props.visible}>
        <View
          style={{flex: 1, backgroundColor: 'rgba(255,255,255,0.65)', justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            color={"#c0c0c0"}
            size="large"/>
        </View>
      </Modal>
    );
  }
}

ActivityIndicatorModal.propTypes = {
  visible: PropTypes.bool.isRequired
};

ActivityIndicatorModal.defaultProps = {
  visible: false
};

/**
 * 遮罩层
 * **/

export class IndicatorView extends PureComponent {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.backPress}>
        <View style={[{
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: this.props.visible ? 'rgba(0,0,0,0.3)' : 'transparent',
          width: WINDOW_WIDTH,
          height: WINDOW_HEIGHT - 100
        }, this.props.style]}>
          {this.props.children}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export class InputView extends PureComponent {
  render() {
    return (
      <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
        {this.props.children}
      </TouchableWithoutFeedback>
    );
  }
}

export class IndicatorTouchable extends PureComponent {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={{flex: 1}}/>
      </TouchableWithoutFeedback>
    );
  }
}

/**
 * 等待提示 Modal
 * **/

export class ActivityIndicatorModal2 extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {visible: false}
  }

  show() {
    this.setState({
      visible: true
    });
  }

  hide() {
    this.setState({
      visible: false
    });
  }

  render() {
    return this.state.visible ? <View
      style={[{
        flex: 1,
        position: 'absolute',
        top: 0,
        height: this.props.height,
        width: WINDOW_WIDTH,
        backgroundColor: 'rgba(255,255,255,0.65)',
        justifyContent: 'center',
        alignItems: 'center'
      }, this.props.style]}>
      <ActivityIndicator
        color={"#c0c0c0"}
        size="large"/>
    </View> : null
  }
}

/**
 * 等待提示
 * **/
export class ActivityIndicatorInlineBlock extends PureComponent {
  render() {
    return (
      <View style={{height: 100, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator
          size="large"
          color={this.props.color}
          style={{opacity: this.props.visible ? 1 : 0}}
          animating={true}
        />
      </View>
    );
  }
}

IndicatorView.propTypes = {
  visible: PropTypes.bool
};

IndicatorView.defaultProps = {
  visible: true
};

const FooterView = styled.View`
  padding-vertical:10;
  align-items:center;
`;
export class Footer extends PureComponent {
  render() {
    return this.props.visible ?
      (
        <FooterView>
          <ActivityIndicator size="small" color="#3e9ce9"/>
          <StyledText color="#B8B8B8" size="13">
            正在加载更多
          </StyledText>
        </FooterView>
      ) : <View style={{height: 10}}/>;
  }
}
export class NoData extends PureComponent {
  render() {
    return this.props.visible ?
      (
        <CenterView>
          <StyledText top="130" color="#999999">{this.props.text || '暂无数据'}</StyledText>
        </CenterView>
      ) : null;
  }
}
export const StyledText = styled.Text.attrs({
  allowFontScaling: false,
})`
  font-size:${props => props.size || 13};
  color:${props => props.color || '#ffffff'};
  text-align:${props => props.align || 'left'};
  background-color:transparent;
  font-weight:${props => props.weight || 'normal'};
  margin-top:${props => props.top || 0};
  margin-bottom:${props => props.bottom || 0};
  margin-left:${props => props.left || 0};
  ${props => props.lh && "line-height:" + props.lh};
`;
export const StyledButtom = styled(Touchable).attrs({})`
  background-color:${props => props.color || color.background.userBlue};
  border-radius:${props => props.radius || 5};
  margin-top:${props => props.top || 20};
  margin-bottom:${props => props.bottom || 0};
  width:${props => props.width || WINDOW_WIDTH - 40};
  height:${props => props.height || 46};
  flex-direction:row;
  justify-content:center;
  align-items:center;
`;
export const ScrollLayout = styled.ScrollView.attrs({
  keyboardShouldPersistTaps: 'handled',
  color: props => props.color || "#ffffff",
})`
  background-color:${props => props.color};
`;
export const BetweenView = styled.View`
  align-items:center;
  justify-content:space-between;
  flex-direction:row;
`;
export const AroundView = styled.View`
  align-items:center;
  justify-content:space-around;
  flex-direction:row;
`;
export const RowView = styled.View`
  flex-direction:row;
`;
export const CenterView = styled.View`
  align-items:center;
`;
export const CenterRow = styled.View`
  align-items:center;
  flex-direction:row;
`;
export const MiddleView = styled.View`
  align-items:center;
  justify-content:center;
  ${props => props.width && "width:" + props.width};
`;
export const HeaderButton = styled(Touchable)`
  padding-horizontal:15;
  padding-vertical:15;
  width:60;
`;
export const FlexView = styled.View`
  flex:1;
`;
const TypeView = CenterView.extend.attrs({
  color: props => props.color
})`
  padding-horizontal:4;
  height:16;
  justify-content:center;
  border-radius:8;
  margin-horizontal:2;
  background-color:${props => props.color};
`;
const IconText = styled.Text`
  font-size:10;
  color:#ffffff;
`;
export class IconView extends PureComponent {
  render() {
    return (
      <TypeView color={this.props.color}>
        <IconText>{this.props.text}</IconText>
      </TypeView>
    );
  }
}
export const NormalView = styled.View``;
export const Header = BetweenView.extend`
  height:${44 + (STATUS_HEIGHT || 12)};
  padding-top:${STATUS_HEIGHT || 12};
  background-color:${props => props.color || color.background.userBlue};
  ${props => props.center && "justify-content:center"};
`;
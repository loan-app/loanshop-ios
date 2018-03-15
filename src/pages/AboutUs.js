import React, {Component} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {NativeModules, Linking, Clipboard} from 'react-native';
import {
  StyledText,
  CenterView,
  BetweenView,
} from '../components/UtilLib';
import DeviceInfo from 'react-native-device-info';
import {BORDER_WIDTH, WINDOW_WIDTH, Channel, InnerVersion} from '../config/constants';
import Touchable from "../components/Touchable";

const Image = styled.Image`
  margin-top:40;
  margin-bottom:10;
`;
const Items = BetweenView.extend.attrs({
  marginTop: props => props.marginTop || 0
})`
  background-color:#ffffff;
  padding-horizontal:20;
  width:${WINDOW_WIDTH};
  padding-vertical:10;
  border-bottom-width:${BORDER_WIDTH};
  border-bottom-color:#eeeeee;
  margin-top:${props => props.marginTop};
`;

class AboutUs extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '关于我们',
  });

  constructor(props) {
    super(props);
    this.count = 0;
    this.state = {Channel: ''};
  }

  _click() {
    this.count++;
    if (this.count > 3) {
      this.setState({Channel});
    }
  }

  _tel(url) {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.log('call tel error', err));
  }

  render() {
    return (
      <CenterView>
        <Touchable feedback={false} onPress={() => this._click()}>
          <Image source={require("../resources/imgs/logo.png")}/>
        </Touchable>
        <StyledText color="#999999"
                    size="14">{global.codePushVersion ? (global.codePushVersion + "_") : "v"}{DeviceInfo.getVersion()} {this.state.Channel}</StyledText>
        <Touchable onPress={() => this._tel("http://www.liqun888.com")}>
          <Items marginTop={35}>
            <StyledText color="#333333">网址</StyledText>
            <StyledText color="#999999">www.liqun888.com</StyledText>
          </Items>
        </Touchable>
        <Touchable onPress={() => {
          this.context.callToast("复制成功", true);
          Clipboard.setString("liqun88d");
        }}>
          <Items>
            <StyledText color="#333333">官方微信</StyledText>
            <StyledText color="#999999">liqun88d</StyledText>
          </Items>
        </Touchable>
        <Items>
          <StyledText color="#333333">客服邮箱</StyledText>
          <StyledText color="#999999">postmaster@xinyijinf.com</StyledText>
        </Items>
        <Touchable onPress={() => this._tel("tel:400-871-3088")}>
          <Items>
            <StyledText color="#333333">客服热线</StyledText>
            <StyledText color="#999999">400-871-3088</StyledText>
          </Items>
        </Touchable>
      </CenterView>
    );
  }
}

AboutUs.contextTypes = {
  callToast: PropTypes.func.isRequired
};

export default AboutUs;

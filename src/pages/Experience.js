import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import imgs from '../resources/imgs';
import color from '../styles/color';
import {ActivityIndicatorModal, StyledText, BetweenView, ScrollLayout, CenterView} from '../components/UtilLib';
import Touchable from '../components/Touchable';

import {STATUS_HEIGHT, WINDOW_WIDTH} from '../config/constants';
import colors from '../styles/color';

const View = styled.View``;
const HBgView = styled.View`
  background-color: ${colors.background.userBlue};
  padding-top: ${12 + STATUS_HEIGHT};
  padding-bottom: 15;
  padding-horizontal:15;
`;
const MoneyView = CenterView.extend`
  margin-top:30;
  margin-bottom:10;
`;
const MiddleView = styled.View`
  flex-direction:row;
  justify-content:space-around;
  background-color:#9ECBFC;
  padding-top:6;
`;
const RightView = styled(Touchable)`
  width:${WINDOW_WIDTH * 0.86};
  alignSelf:flex-end;
  margin-top:31;
  border-left-width:8;
  border-top-left-radius:5;
  border-bottom-left-radius:5;
  border-color:${color.border.blue};
  background-color:#ffffff;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  padding-horizontal:15;
`;

export default class Experience extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <ScrollLayout color="transparent">
        <ActivityIndicatorModal visible={this.state.loading}/>
        <HBgView>
          <BetweenView>
            <Touchable onPress={() => this.props.navigation.goBack()}>
              {imgs.leftArrowWhite({marginRight: 20})}
            </Touchable>
            <StyledText size="16">我的体验金</StyledText>
            <Touchable onPress={() => this.props.navigation.navigate("WebView", {url: 'http://www.baidu.com'})}>
              <StyledText size="14">说明</StyledText>
            </Touchable>
          </BetweenView>
          <MoneyView>
            <StyledText size="14">当前体验金</StyledText>
            <StyledText height="70" size="44">1,000.00</StyledText>
          </MoneyView>
        </HBgView>
        <MiddleView>
          <CenterView>
            <StyledText height="30" size="11">累计收益</StyledText>
            <StyledText height="24" size="18">0.00</StyledText>
          </CenterView>
          <CenterView>
            <StyledText height="30" size="11">历史年化收益率</StyledText>
            <StyledText height="28" size="18">6.60%</StyledText>
          </CenterView>
        </MiddleView>
        <RightView onPress={() => this.props.navigation.navigate("ExperienceDetail")}>
          <View>
            <StyledText height="30" size="11" color="#333333">累计获得体验金</StyledText>
            <StyledText height="28" size="16" color="#333333">1,000.00</StyledText>
          </View>
          {imgs.rightArrowGary({height: 15, width: 8})}
        </RightView>
      </ScrollLayout>
    )
  }

}

Experience.contextTypes = {
  callToast: PropTypes.func.isRequired
};
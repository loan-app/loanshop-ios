import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {
  View,
  ScrollView,
  RefreshControl
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as userCreator from '../actions/userActions';
import * as workingTableCreator from '../actions/workingTableActions';
import * as bonusListCreator from '../actions/bonusListActions';

import imgs from '../resources/imgs';

import {ActivityIndicatorModal, StyledText, FlexView, CenterRow, AroundView, CenterView} from '../components/UtilLib';
import Touchable from '../components/Touchable';
import {createH5Url, createApiUrl} from '../requests/http';

import {STATUS_HEIGHT, BORDER_WIDTH, WINDOW_WIDTH} from '../config/constants';
import colors from '../styles/color';
import FloatFormatter from '../utils/Float';
import AuthCheck from '../utils/Check';

const HBgView = styled.ImageBackground`
  padding-top: ${20 + STATUS_HEIGHT};
  padding-horizontal:15;
  width:${WINDOW_WIDTH};
  height:${WINDOW_WIDTH * 0.92};
`;
const BetweenView = styled.View`
  flex-direction: row;
  justify-content:space-between;
`;
const MoneyView = AroundView.extend`
`;
const BMoneyView = BetweenView.extend`
  padding-horizontal:15;
  padding-vertical:15;
  margin-bottom:5;
`;
const Button = styled(Touchable)`
  border-radius:21px;
  width:125px;
  height:45px;
  align-items:center;
  justify-content:center;
  padding-bottom:2;
`;
const BlueBgButton = Button.extend`
  background-color:#4285F4;
`;
const BlueBdButton = Button.extend`
  border-width:1;
  border-color:#4285F4;
  margin-left:15;
`;
const MenuButton = styled(Touchable).attrs({
  borderRight: props => props.br ? 1 : 0,
  borderBottom: props => props.bb ? 1 : 0
})`
  border-right-width:${props => props.borderRight};
  border-color:#eeeeee;
  border-bottom-width:${props => props.borderBottom};
  width:${WINDOW_WIDTH / 2};
  padding-vertical:30;
  background-color:#ffffff;
  padding-left:${(WINDOW_WIDTH / 2 - 130) / 2};
`;
const icon = {marginRight: 15};

class UserInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eyeOpen: true
    };
  }

  static navigationOptions = ({navigation, screenProps}) => ({
    header: null,
  });

  _navigate = (router, params) => {
    this.props.navigation.navigate(router, params);

  };

  _toWebView(url) {
      console.log('global.token: ' + global.token);
      this.props.navigation.navigate("WebView", {url});
  }

  _navigateCheck(level, route, params, toast) {
    const routers = AuthCheck(this.props.user.check, level, route, params);
    if (routers[0]) {
      this._navigate(routers[0], routers[1]);
    } else {
      toast && this.context.callToast(toast);
    }
  }

  _onRefresh() {
    if (!this.props.user.loading) {
      const {userActions} = this.props;
      userActions.userProfile(true);
      this.props.workingTableAction.getAds();
    }
  }

  _toBonus(type, params) {
    this.props.bonusListActions.getData(false, false, false, type, null, null, true);
    this._navigate("BonusList", params);
  }

  componentDidMount() {
    const {userActions} = this.props;
    userActions.userProfile(false);
    !this.props.ads && this.props.workingTableAction.getAds();
    setTimeout(() => global.userInfoLoaded = true, 500);
  }

  render() {
    let {loading, userInfo} = this.props.user;
    const bonusCount = userInfo ? (userInfo.coupons + userInfo.hikeOutTickets) : 0;
    return (
      <FlexView>
        <ScrollView removeClippedSubviews={false} refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => this._onRefresh()}
          />
        }>
          <ActivityIndicatorModal visible={loading}/>
          <HBgView source={require("../resources/imgs/me-bg.png")}>
            <BetweenView>
              <Touchable onPress={() => this._navigate("Setting")}>
                {imgs.shezhi({marginRight: 20})}
              </Touchable>
              {/*<IconTouch onPress={() => this._navigate("Setting")} >*/}
              <CenterView>
                {imgs.touxiang({width: 60, height: 60})}
                <StyledText top="8" size="16">
                  {userInfo.mobile && userInfo.mobile.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")}
                </StyledText>
              </CenterView>
              {/*</IconTouch>*/}
              <Touchable onPress={() => this._navigate("MessageList")}>
                {imgs.message({marginLeft: 20})}
              </Touchable>
            </BetweenView>
            <CenterView>
              <CenterRow style={{marginTop: 28}}>
                <StyledText size="32">{FloatFormatter(userInfo.totleProperty)}</StyledText>
              </CenterRow>
              <StyledText size="14" color="#F0DCCE" top="10" bottom="20">总资产（元）</StyledText>
            </CenterView>
            <MoneyView>
              <Touchable onPress={() => this._navigate("Asset")}>
                <CenterView>
                  <View>
                    <StyledText size="22">{FloatFormatter(userInfo.balance)}</StyledText>
                    <StyledText size="14" top="4" color="#F0DCCE">可用余额（元）</StyledText>
                  </View>
                </CenterView>
              </Touchable>
              <CenterView>
                <View>
                  <StyledText size="22">{FloatFormatter(userInfo.total)}</StyledText>
                  <StyledText size="14" top="4" color="#F0DCCE">累计收益（元）</StyledText>
                </View>
              </CenterView>
            </MoneyView>
          </HBgView>
          <BMoneyView>
            <BlueBdButton onPress={() => this._navigateCheck(2, "Cash", {hideHeader: true})}>
              <StyledText color="#5bb9ff" size="14">提现</StyledText>
            </BlueBdButton>
            <BlueBgButton onPress={() => this._navigateCheck(2, "Recharge",{hideHeader:true})}>
              <StyledText size="14">充值</StyledText></BlueBgButton>
          </BMoneyView>
          <BetweenView>
            <MenuButton bb br onPress={() => this._navigate("CapitalList")}>
              <CenterRow>
                {imgs.touzi(icon)}
                <View>
                  <StyledText color="#333333" size="16">我的投资</StyledText>
                  <StyledText color="#999999" size="11" top="4">查看投资记录明细</StyledText>
                </View>
              </CenterRow>
            </MenuButton>
            <MenuButton bb onPress={() => this._navigate("CapitalRecord")}>
              <CenterRow>
                {imgs.liushui(icon)}
                <View>
                  <StyledText color="#333333" size="16">资金流水</StyledText>
                  <StyledText color="#999999" size="11" top="4">查看账户资金流动</StyledText>
                </View>
              </CenterRow>
            </MenuButton>
          </BetweenView>
          <BetweenView>
            <MenuButton br onPress={() => this._toBonus("1", {title: "我的福利"})}>
              <CenterRow>
                {imgs.hongbao(icon)}
                <View>
                  <StyledText color="#333333" size="16">我的福利</StyledText>
                  <StyledText color="#999999" size="11" top="4">
                    {bonusCount ? ( bonusCount + '份可用') : '暂无'}
                  </StyledText>
                </View>
              </CenterRow>
            </MenuButton>
            <MenuButton onPress={() => this._toWebView(createH5Url("/user/invitation?t=" + global.token))}>
              <CenterRow>
                {imgs.haoyou(icon)}
                <View>
                  <StyledText color="#333333" size="16">邀请好友</StyledText>
                  <StyledText color="#999999" top="4" size="11">邀请好友，坐享收益</StyledText>
                </View>
              </CenterRow>
            </MenuButton>
          </BetweenView>
          <View style={{height: 5}}/>
        </ScrollView>
      </FlexView>
    )
  }

}

UserInfo.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const {user} = state;
  return {user};
};

const mapDispatchToProps = (dispatch) => {
  const userActions = bindActionCreators(userCreator, dispatch);
  const workingTableAction = bindActionCreators(workingTableCreator, dispatch);
  const bonusListActions = bindActionCreators(bonusListCreator, dispatch);
  return {userActions, workingTableAction, bonusListActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
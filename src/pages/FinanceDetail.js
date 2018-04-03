import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import ImageViewer from 'react-native-image-zoom-viewer';
import GuideMenu from '../components/GuideMenu';
import colors from '../styles/color';
import imgs from '../resources/imgs';
import {
  View,
  WebView,
  RefreshControl, Text, KeyboardAvoidingView
} from 'react-native';

import * as financeDetailCreator from '../actions/financeDetailActions';
import * as userCreator from '../actions/userActions';
import {createApiUrl} from '../requests/http';

import {
  ActivityIndicatorModal,
  StyledText,
  FlexView,
  RowView,
  CenterView,
  BetweenView,
  StyledButtom,
  ScrollLayout,
  HeaderButton,
  NormalView,
  CenterRow
} from '../components/UtilLib';
import Touchable from '../components/Touchable';
import Modal from 'react-native-modalbox';

import {STATUS_HEIGHT, WINDOW_HEIGHT, WINDOW_WIDTH, OS} from '../config/constants';
import FloatFormatter from '../utils/Float';
import AuthCheck from '../utils/Check';
import color from '../styles/color';
import TextInputCustomized from "../components/TextInputCustomized";
import HtmlFormatter from "../utils/HTML2";

const progressWidth = WINDOW_WIDTH / 2 - 40;
const itemWidth = (WINDOW_WIDTH - 45) / 2;
const HBgView = styled.View`
  padding-vertical:15;
  padding-horizontal:10;
`;
const DetailView = CenterView.extend`
  justify-content:center;
  padding-top:20;
  padding-bottom:10;
  background-color:#fff;
  border-radius:5;
`;
const CellView = NormalView.extend`
  padding-vertical:25;
  padding-horizontal:10;
`;
const SubmitButton = styled(StyledButtom).attrs({
  radius: '0',
  width: WINDOW_WIDTH,
  height: 49,
  top: '0'
})`
`;
const ProgressBg = styled.View`
  height:8;
  background-color:#F0F0F0;
  border-radius:4;
  width:${progressWidth};
`;
const ProgressView = styled.View.attrs({
  progress: props => props.progress || 0,
})`
  height:8;
  background-color:#FBA558;
  width:${props => props.progress * progressWidth};
  border-radius:4;
`;
const FilterView = styled(Touchable).attrs({})`
  margin-top:10;
  width:${WINDOW_WIDTH / 3};
  height:40;
  justify-content:center;
  align-items:center;
  background-color:#fff;
  border-top-width:1;
  border-top-color:#F0F0F0;
  border-bottom-width:1;
  border-bottom-color:#F0F0F0;
`;
const Content = styled.View`
  padding-horizontal:15;
  padding-vertical:20;
  background-color:#fff;
  margin-bottom:15;
`;
const Content3 = RowView.extend`
  padding-left:15;
  padding-vertical:20;
  background-color:#fff;
  margin-bottom:15;
  flex-wrap:wrap;
`;
const ItemView = BetweenView.extend`
  margin-top:15;
`;
const BottomView = styled.View`
  border-top-width:1;
  border-top-color:#F0F0F0;
  padding-top:16;
  background-color:#fff;
  margin-top:20;
`;
const ItemImg = styled.Image`
  width:${itemWidth};
  height:${itemWidth * 1.35};
  margin-bottom:15;
  margin-right:15;
`;
const Content2 = styled.View`
  border-top-width:1;
  border-bottom-width:1;
  border-color:#F0F0F0;
  background-color:#fff;
  margin-bottom:15;
`;
const JLItem = BetweenView.extend`
  padding-vertical:10;
  padding-horizontal:15;
  border-bottom-width:1;
  border-color:#F0F0F0;
`;
const SubTitle = BetweenView.extend`
  padding-vertical:10;
  padding-horizontal:15;
  background-color:#fff;
`;
const SubTitle2 = BetweenView.extend`
  padding-vertical:10;
  padding-horizontal:15;
  background-color:#fff;
  border-top-width:1;
  border-color:#F0F0F0;
  border-bottom-width:1;
  margin-top:10;
`;
const Bar = styled.View`
  padding-left:4.5;
`;
const BarView = styled.View`
  border-left-width:1;
  border-color:${props => props.color || "#999999"};
  padding-left:15;
  justify-content:space-between;
`;
const Cicle = styled.View`
  width:10;
  height:10;
  border-radius:5;
  position:absolute;
  top:${props => (props.idx - 1) * 34.2};
  left:0;
  background-color:${props => props.color || "#999999"};
`;
const BarText = StyledText.extend.attrs({
  color: props => props.color || "#999999",
})`
  line-height:13;
`;
const StatusView = BetweenView.extend`
  padding-horizontal:20;
  padding-bottom:15;
`;
const StatusCirle = styled.View`
  background-color:${props => props.complete ? '#FBA558' : "#D8D8D8"};
  height:10;
  width:10;
  border-radius:5;
  margin-horizontal:2;
  margin-top:4;
`;

class FinanceDetail extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: "详情"
  });

  constructor(props) {
    super(props);
    this.state = {
      income: 0,
      webHeight: 10,
      type: 1,
    };
    const patchPostMessageFunction = function () {
      var originalPostMessage = window.postMessage;

      var patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
      };

      patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
      };
      setTimeout(() => {
        window.postMessage(document.body.scrollHeight)
      }, 500);

      window.postMessage = patchedPostMessage;
    };
    this.patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';
  }

  _navigateCheck(level, route, params) {
    const routers = AuthCheck(this.props.check, level, route, params);
    if (routers[0]) {
        console.log('---------routers[0] = ' + routers[0] + 'routers[1] = ' + routers[1]);
        this.props.navigation.navigate(routers[0], routers[1]);
    }
  }

  _onRefresh() {
    if (!this.props.financeDetail.isRefreshing) {
      const {financeDetailActions, navigation, userActions} = this.props;
      global.token && userActions.userProfile(false);
      navigation.state.params && navigation.state.params.id && financeDetailActions.getData(false, true, navigation.state.params.id);
    }
  }

  _changeType(type) {
    this.state.type !== type && this.setState({type: type}, () => {
    });
  }

  _changeHeight(data) {
    if (data && data.data > 0) {
      const height = parseInt(data.data);
      if (this.state.webHeight != height) {
        this.setState({webHeight: height});
      }
    }
  }

  _renderDetail() {
    const detail = this.props.financeDetail.detail || {};
    const isRefreshing = this.props.financeDetail.isRefreshing;
    const progress = detail && (detail.investedMoney / detail.financeMoney) || 0;
    const residueMoney = detail.financeMoney && (detail.financeMoney - detail.investedMoney) || 0;
    let investedProgress;
    if (progress < 0.9) {
      investedProgress = Math.ceil(progress * 100);
    } else {
      investedProgress = Math.floor(progress * 100);
    }
    return (
      <ScrollLayout color="transparent"
                    refreshControl={
                      <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => this._onRefresh()}
                      />
                    }>
        <View>
          <HBgView>
            <CenterView>
              <StyledText size="16" color="#4A4A4A" bottom="20" top="5">{detail.title}</StyledText>
            </CenterView>
            <DetailView>
              <BetweenView style={{width:WINDOW_WIDTH-40,alignItems:'flex-end'}}>
                <NormalView style={{marginLeft: 20}}>
                  <StyledText size="30" color="#FBA558">
                    {((detail.rate - detail.rateExt) * 100).toFixed(1)}%
                  </StyledText>
                  <StyledText size="12" color="#333333" top="4">预期年化率</StyledText>
                </NormalView>
                <CenterView>
                  <ProgressBg>
                    <ProgressView progress={progress}/>
                  </ProgressBg>
                  <StyledText color="#999999" top="10">投资进度{investedProgress + "%"}</StyledText>
                </CenterView>
              </BetweenView>
              <RowView>
                <CellView>
                  <StyledText size="15" color="#333333">
                    {FloatFormatter(detail.financeMoney && detail.financeMoney)}
                  </StyledText>
                  <StyledText color="#999999" top="7">项目总额(元)</StyledText>
                </CellView>
                <CellView style={{flex: 1, alignItems: "center"}}>
                  <NormalView>
                    <StyledText size="15" color="#333333">
                      {detail.isEnd ? "募集结束" : (residueMoney > 100 ? `${FloatFormatter(residueMoney / 10000)}万` : `${FloatFormatter(residueMoney)}元`)}
                    </StyledText>
                    <StyledText color="#999999" top="7">剩余可投(元)</StyledText>
                  </NormalView>
                </CellView>
                <CellView>
                  <StyledText size="15" color="#333333">{detail.deadLine}</StyledText>
                  <StyledText color="#999999" top="7">项目期限(天)</StyledText>
                </CellView>
              </RowView>
              <BetweenView style={{width:WINDOW_WIDTH-40}}>
                <StyledText color="#999999" size="10">起投金额:￥{detail.minInvestMoney}</StyledText>
                <StyledText color="#999999" size="10">起息方式:{detail.beginInterestType}</StyledText>
                <StyledText color="#999999" size="10">还款方式:{detail.repaymentType}</StyledText>
              </BetweenView>
            </DetailView>
          </HBgView>
          <StatusView>
            <RowView>
              <StatusCirle complete={true}/>
              <NormalView>
                <StyledText color="#333333" size="14">募集开始</StyledText>
                <StyledText color="#999999" size="11" top="4">{detail.beginAtStr}</StyledText>
              </NormalView>
            </RowView>
            <RowView>
              <StatusCirle complete={detail.showStatus > 1}/>
              <NormalView>
                <StyledText color="#333333" size="14">开始计息</StyledText>
                <StyledText color="#999999" size="11" top="4">{detail.beginInterestAtStr}</StyledText>
              </NormalView>
            </RowView>
            <RowView>
              <StatusCirle complete={detail.showStatus > 2}/>
              <NormalView>
                <StyledText color="#333333" size="14">到期回款</StyledText>
                <StyledText color="#999999" size="11" top="4">{detail.endAtStr}</StyledText>
              </NormalView>
            </RowView>
          </StatusView>
          <BetweenView>
            <FilterView color={this.state.type === 1 && color.font.blue} onPress={this._changeType.bind(this, 1)}>
              <StyledText size="15" color={this.state.type === 1 ? color.font.blue : '#333333'}>项目信息</StyledText>
            </FilterView>
            <FilterView color={this.state.type === 2 && color.font.blue} onPress={this._changeType.bind(this, 2)}>
              <StyledText size="15" color={this.state.type === 2 ? color.font.blue : '#333333'}>安全保障</StyledText>
            </FilterView>
            <FilterView color={this.state.type === 3 && color.font.blue} onPress={this._changeType.bind(this, 3)}>
              <StyledText size="15" color={this.state.type === 3 ? color.font.blue : '#333333'}>购买记录</StyledText>
            </FilterView>
          </BetweenView>
          {this._renderMore(this.state.type)}
        </View>
      </ScrollLayout>
    );
  }

  _renderMore(i) {
    const {detail} = this.props.financeDetail;
    if (!detail) {
      return null
    }
    switch (i) {
      case 1:
        return (
          <Content>
            <StyledText color="#333333" size="15">借款人信息</StyledText>
            <ItemView>
              <StyledText color="#9B9B9B">借款人姓名</StyledText>
              <StyledText color="#404040">{detail.borrowerName}</StyledText>
            </ItemView>
            <ItemView>
              <StyledText color="#9B9B9B">借款人身份证号</StyledText>
              <StyledText color="#404040">{detail.borrowerIdCardNo}</StyledText>
            </ItemView>
            <ItemView>
              <StyledText color="#9B9B9B">借款人性别</StyledText>
              <StyledText color="#404040">{detail.borrowerGender}</StyledText>
            </ItemView>
            <ItemView>
              <StyledText color="#9B9B9B">借款人住所地</StyledText>
              <StyledText color="#404040">{detail.borrowerLocation}</StyledText>
            </ItemView>
            <ItemView>
              <StyledText color="#9B9B9B">借款人年龄</StyledText>
              <StyledText color="#404040">{detail.borrowerAge}</StyledText>
            </ItemView>
            <ItemView>
              <StyledText color="#9B9B9B">借款用途</StyledText>
              <StyledText color="#404040">{detail.borrowerPurposeDesc}</StyledText>
            </ItemView>
            <BottomView>
              <StyledText color="#333333" size="15">借款描述</StyledText>
              <NormalView style={{height: this.state.webHeight}}>
                <WebView
                  style={{flex: 1}}
                  bounces={false}
                  onMessage={(event) => this._changeHeight(event.nativeEvent)}
                  injectedJavaScript={this.patchPostMessageJsCode}
                  source={{html: detail.contentStr ? HtmlFormatter(detail.contentStr) : ''}}
                  domStorageEnabled={true}
                  javaScriptEnabled={true}
                />
              </NormalView>
            </BottomView>
          </Content>
        );
      case 2:
        return (
          <Content3>
            {
              detail && detail.financePicList && detail.financePicList.map((item, i) => {
                return <Touchable key={i} onPress={() => this.modal.open()}>
                  <ItemImg source={{uri: item.picPath}}/>
                </Touchable>
              })
            }
          </Content3>
        );
      case 3:
        return (
          <NormalView>
            <SubTitle>
              <StyledText color="#999999">投资人</StyledText>
              <StyledText color="#999999">投资金额(元)</StyledText>
            </SubTitle>
            <Content2>
              {
                detail.investList && detail.investList.map((item, i) => {
                  return <JLItem key={i}>
                    <NormalView>
                      <StyledText color="#333333">{item.investerName}</StyledText>
                      <StyledText color="#999999" top="4">{item.investAt}</StyledText>
                    </NormalView>
                    <StyledText color="#EE5C2B" size="17">{item.investMoney}</StyledText>
                  </JLItem>
                })
              }
            </Content2>
          </NormalView>
        );
      case 4:
        const status = detail.showStatus + 1;
        return (
          <Content>
            <Bar>
              <BarView color={status > 1 && "#2574CA"}>
                <BarText color="#2574CA">{detail.beginAtStr}</BarText>
                <BarText color={status > 1 && "#2574CA"} top="20">{detail.beginInterestAtStr}</BarText>
              </BarView>
              <BarView color={status > 2 && "#2574CA"}>
                <BarText color={status > 2 && "#2574CA"} top="20">{detail.descStr}</BarText>
                <BarText color={status > 2 && "#2574CA"} top="20">{detail.endAtStr}</BarText>
              </BarView>
              <Cicle idx="1" color="#2574CA"/>
              <Cicle idx="2" color={status > 1 && "#2574CA"}/>
              <Cicle idx="4" color={status > 2 && "#2574CA"}/>
            </Bar>
          </Content>
        );
    }
  }

  componentDidMount() {
    const {financeDetailActions, navigation, userActions} = this.props;
    global.token && userActions.userProfile(false);
    navigation.state.params && navigation.state.params.id && financeDetailActions.getData(true, false, navigation.state.params.id);
    !navigation.state.params && financeDetailActions.getData(true, false, 73);
  }

  render() {
    const {loading, detail} = this.props.financeDetail;
    let btn;
    if (detail) {
      if (detail.isEnd) {
        btn = "已售罄";
      } else if (detail.isForeshow) {
        btn = "暂未开标";
      } else {
        btn = "立即投资";
      }
    }
    const canTouch = detail && !detail.isEnd && !detail.isForeshow ? true : false;
    return (
      <FlexView>
        <ActivityIndicatorModal visible={loading}/>
        {this._renderDetail()}
        {detail &&
        <SubmitButton color={!canTouch ? "#B6B6B6" : "#FBA558"} feedback={canTouch}
                      onPress={() => canTouch && this._navigateCheck(2, "FinanceBuy")}>
          <StyledText size="19">{btn}</StyledText>
        </SubmitButton>}
        {detail && detail.financePicList && detail.financePicList.length > 0 &&
        <Modal ref={ref => this.modal = ref} backButtonClose={true}>
          <ImageViewer saveToLocalByLongPress={false} imageUrls={detail.financePicList || []}/>
          <Touchable style={{position: 'absolute', top: 32, right: 15, padding: 10}}
                     onPress={e => this.modal.close()}>
            {imgs.guan()}
          </Touchable>
        </Modal>}
      </FlexView>
    )
  }

}

FinanceDetail.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const {financeDetail} = state;
  const check = state.user.check;
  const userInfo = state.user.userInfo;
  return {financeDetail, check, userInfo};
};

const mapDispatchToProps = (dispatch) => {
  const userActions = bindActionCreators(userCreator, dispatch);
  const financeDetailActions = bindActionCreators(financeDetailCreator, dispatch);
  return {financeDetailActions, userActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(FinanceDetail);
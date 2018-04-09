import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import styled from 'styled-components/native';
import codePush from "react-native-code-push";

import {RefreshControl, Linking, AppState} from 'react-native';
import imgs from '../resources/imgs';
import Swiper from 'react-native-swiper';
import Notification from '../components/Notification';
import {
  ScrollLayout,
  StyledText,
  CenterView,
  RowView,
  NormalView,
  BetweenView,
  IconView,
  CenterRow
} from '../components/UtilLib';
import {initCookie, logoutUser, register403Callback, registerNetWorkErrorCallback} from '../requests/axios';
import {createApiUrl, checkUpdate} from '../requests/http.js';
import * as workingTableCreator from '../actions/workingTableActions';

import {WINDOW_WIDTH, BORDER_WIDTH, OS, Channel, ItunesId} from '../config/constants';
import Touchable from "../components/Touchable";
import MessageBox from '../components/MessageBox';
import moment from 'moment';
import * as Update from '../utils/Update';
import FloatFormatter from '../utils/Float';

const height = WINDOW_WIDTH / 1.7;
const cell = 3;
const margin = 10;
const width = (WINDOW_WIDTH - 10) / cell - (margin * 2);
const icon = {marginTop: 2, marginRight: 5};
const progressWidth = WINDOW_WIDTH - 60;

const SwipreView = styled.View`
  height:185;
`;
const AdImage = styled.Image`
  height:185;
  width:${WINDOW_WIDTH};
`;
const AboutContainer = CenterRow.extend`
  padding-vertical:35;
  background-color:#ffffff;
`;
const AboutView = styled(Touchable)`
   width:${WINDOW_WIDTH / 2};
   padding-horizontal:5;
   align-items:center;
`;
const Dot = styled.View`
  height:5;
  width:5;
  border-radius:2.5;
  background-color:rgba(255,255,255,0.2);
  margin-right:3;
`;
const ActiveDot = Dot.extend`
  background-color:rgba(255,255,255,0.6);
  border-radius:2.5;
  height:5;
  width:15;
`;
const SafeView = CenterView.extend`
  flex-direction:row;
  justify-content:space-around;
  padding-vertical:12;
`;
const ItemView = styled(Touchable)`
  background-color:#ffffff;
  padding-bottom:20;
  margin-top:10;
`;
const ColumnView = CenterView.extend`
  border-right-width:1;
  border-color:#eeeeee;
  width:${WINDOW_WIDTH / 3};
  padding-left:2;
  margin-top:6;
  justify-content:center;
`;
const TitleView = styled.View`
  flex-direction:row;
  align-items:center;
  padding-bottom:4;
  margin-left:10;
  height:50;
`;
const ErrorView = styled(Touchable)`
  height:100;
  align-items:center;
  justify-content:center;
`;
const UpdateView = styled.View`
`;
const UpdateDesc = styled.View`
  padding-left:10;
`;
const Type = CenterView.extend`
  padding-vertical:4;
  width:56;
  background-color:#FC9657;
  position:absolute;
  right:0;
  top:0;
`;
const AdsView = styled(Touchable)`
`;
const AdsImage = styled.Image`
  height:${WINDOW_WIDTH * 0.26};
  width:${WINDOW_WIDTH};
`;

const types = ["新手专享", "超短项目", "爆款项目", "精选项目", "体验项目"];
class Home extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      user: {},
      logged: false,
      messageBox: {
        visible: false,
        content: '',
        button: null
      }
    };
  }

  _showOptionModal(msg, onCancel, onConfirm) {
    this.setState({
      messageBox: {
        visible: true,
        content: null,
        button: [
          {
            text: '以后再说',
            onPress: onCancel
          },
          {
            text: '立即更新',
            onPress: onConfirm
          }
        ]
      }
    });
  }

  _toItunes() {
    const url = `itms-apps://itunes.apple.com/cn/app/id${ItunesId}`;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  _showOptionModal2(msg) {
    this.setState({
      messageBox: {
        visible: true,
        content: null,
        button: {
          text: '立即更新',
          onPress: () => {
            this._toItunes();
          }
        }
      }
    });
  }

  _showUpdate(isForce, updateInfo) {
    this.setState({updateInfo});
    if (isForce) {
      this._showOptionModal2(updateInfo);
    } else {
      this._showOptionModal(updateInfo, () => {
        this.setState({messageBox: {visible: false}});
      }, () => {
        this.setState({messageBox: {visible: false}}, () => {
          this._toItunes();
        });
      });
    }
  }

  _checkCodePush() {
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
      updateDialog: {
        appendReleaseDescription: false,//是否显示更新description，默认为false
        descriptionPrefix: "更新内容：",//更新说明的前缀。 默认是” Description:
        mandatoryContinueButtonLabel: "立即更新",//强制更新的按钮文字，默认为continue
        mandatoryUpdateMessage: "有新版本了，是否更新？",//- 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
        optionalIgnoreButtonLabel: '稍后',//非强制更新时，取消按钮文字,默认是ignore
        optionalInstallButtonLabel: '立即更新',//非强制更新时，确认文字. Defaults to “Install”
        optionalUpdateMessage: '有新版本了，是否更新？',//非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
        title: '更新提示'//要显示的更新通知的标题. Defaults to “Update available”.
      },
    });
  }

  _getUpdateMeta() {
    codePush.getUpdateMetadata().then((update) => {
      if (update) {
        global.codePushVersion = update.label;
      }
    });
  }

  _checkUpdate() {
    global.hasChecked = true;
    checkUpdate({os: OS}).then(data => {
      if (data.data.code === 0) {
        global.warnTime = data.data.data.warnTime;
        global.checkTime = moment();
        if (OS === "ios") {
          if (data.data.data.versionIos && global.version && data.data.data.versionIos > global.version) {
            this._showUpdate(data.data.data.isForce, data.data.data.des);
          } else {
            data.data.data.isCodePush && this._checkCodePush();
          }
        } else {
          if (data.data.data.version && global.version && data.data.data.version > global.version) {
            Update.autoUpdate(createApiUrl(`/app/version/info?os=${OS}`), createApiUrl(`/download/${Channel}.apk`).replace("api", "m"));
          } else {
            data.data.data.isCodePush && this._checkCodePush();
          }
        }
      } else {
        this.context.callToast(data.data.msg);
      }
    });
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      if (!global.checkTime) {
        this._checkUpdate();
      } else {
        const diff = moment().diff(global.checkTime, "hours");
        console.log(diff);
        if (diff > 0 && diff >= global.warnTime) {
          this._checkUpdate();
        }
      }
    }
  }

  _resetRouter() {
    const navigateAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({routeName: 'Main'}),
        NavigationActions.navigate({routeName: 'Login'})
      ]
    });
    this.props.navigation.dispatch(navigateAction);
  }

  _init() {
    initCookie();

    register403Callback(() => {
      console.log('403---');
      logoutUser();
      this.context.callToast("登录已失效，请重新登录");
      this._resetRouter();
    });

    registerNetWorkErrorCallback(() => {
      this.context.callToast("网络异常，请检查网络设置");
    });

  }

  _toWebView(url) {
    this.props.navigation.navigate("WebView", {url});
  }

  _renderAds() {
    let {banner} = this.props.workingTable;
    return (
      <SwipreView>
        {
          banner &&
          <Swiper removeClippedSubviews={false} autoplay={true} showsPagination={true}
                  paginationStyle={{bottom: 12}}
                  dot={<Dot/>} activeDot={<ActiveDot/>}>
            {
              banner.map((item, i) => {
                return (
                  <Touchable key={i} feedback={false}
                             onPress={() => item.link && this._toWebView(item.link)}>
                    <AdImage source={{uri: item.url}}/>
                  </Touchable>
                )
              })
            }
          </Swiper>
        }
      </SwipreView>
    )
  }

  _onRefresh() {
    if (!this.props.workingTable.loading) {
      this.props.workingTableAction.getData(true);
      this.props.workingTableAction.getBanner();
      this.props.workingTableAction.getAds();
      this.props.workingTableAction.getNotification();
    }
  }

  componentWillMount() {
    if (global.initRouter) {
      this.props.navigation.navigate("UserInfo");
      global.initRouter = null;
    } else {
      this.time = setTimeout(() => {
        !global.hasChecked && this._checkUpdate();
      }, 5000);
    }
  }

  componentDidMount() {
    this._init();
    this.props.workingTableAction.getBanner();
    this.props.workingTableAction.getAds();
    this.props.workingTableAction.getNotification();
    this.props.workingTableAction.getData(false);
    AppState.addEventListener('change', this._handleAppStateChange);
    this._getUpdateMeta();
    // setTimeout(() => this.props.navigation.navigate("CapitalList"), 300)
    // setTimeout(() => this.props.navigation.navigate("FinanceDetail",{id:164,type:1}), 300)
  }

  componentWillUnmount() {
    this.time && clearTimeout(this.time);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    const {navigate} = this.props.navigation;
    const {loading, error, list, ads, notification} = this.props.workingTable;
    return (
      <ScrollLayout color="transparent"
                    removeClippedSubviews={false}
                    refreshControl={
                      <RefreshControl
                        refreshing={loading}
                        onRefresh={() => this._onRefresh()}
                      />
                    }>
        {this._renderAds()}

        <AboutContainer>
          <AboutView
            onPress={() => this._toWebView(createApiUrl(`/h5/activity/platform-introduction/index`))}>
            <CenterRow>
              {imgs.we()}
              <StyledText color="#333333" size="16" left="10">信息披露</StyledText>
            </CenterRow>
            <StyledText color="#B7B7B7" top="4" size="10" left="6">多年行业经验从未违约</StyledText>
          </AboutView>
          <AboutView
            onPress={() => this._toWebView(createApiUrl(`/h5/activity/platform-introduction/about`))}>
            <CenterRow>
              {imgs.information()}
              <StyledText color="#333333" size="16" left="10">关于我们</StyledText>
            </CenterRow>
            <StyledText color="#B7B7B7" top="4" size="10">多重保障投资零风险</StyledText>
          </AboutView>
        </AboutContainer>
        {ads && ads[0] && ads[0].position === "pic3" ?
          <AdsView feedback={ads[0].link ? true : false}
                   onPress={() => ads[0].link && this.props.navigation.navigate("WebView", {url: ads[0].link})}>
            <AdsImage source={{uri: ads[0].url}}/>
          </AdsView> : null}
        {
          !list && error ? <ErrorView onPress={() => this._onRefresh()}>
            <StyledText color="#999999" size="13">点击重新加载</StyledText>
          </ErrorView> : null
        }
        {
          list && list.map((item, i) => {
            let residueMoney = item.financeMoney - item.investedMoney;
            let str;
            if (residueMoney > 100) {
              residueMoney = residueMoney / 10000;
              str = "万元";
            } else {
              str = "元";
            }
            const textcolor = (!item.isEnd ? "#333333" : "#999999");
            return (
              <ItemView key={i}
                        onPress={() => this.props.navigation.navigate("FinanceDetail", {id: item.id})}>
                <TitleView>
                  <StyledText color="#333333" size="14">{item.title}</StyledText>
                  {item.isGuarantee ? <IconView text="担保" color="#ffa30f"/> : null}
                  {item.financeGoodsId ? <IconView text="抵押" color="#6295fd"/> : null}
                </TitleView>
                <RowView>
                  <ColumnView>
                    <NormalView style={{alignItems: 'flex-end'}}>
                      <StyledText size="24" color="#F1BE64">{FloatFormatter(item.rate * 100)}%</StyledText>
                      <StyledText size="12" color="#999999" top="10">预期年化</StyledText>
                    </NormalView>
                  </ColumnView>
                  <ColumnView>
                    <NormalView style={{alignItems: 'flex-end'}}>
                      <StyledText size="24" color="#F1BE64">{item.deadLine.replace("天", "")}
                        <StyledText color="#333333">天</StyledText>
                      </StyledText>
                      <StyledText size="12" color="#999999" top="10">项目期限</StyledText>
                    </NormalView>
                  </ColumnView>
                  <ColumnView>
                    <NormalView style={{alignItems: 'flex-end'}}>
                      {item.isEnd ? <StyledText size="18" color={textcolor}>募集结束</StyledText> :
                        <StyledText size="24" color="#333333">{FloatFormatter(residueMoney)}
                          <StyledText color="#333333">{str}</StyledText>
                        </StyledText>
                      }
                      <StyledText size="12" color="#999999" top="10">剩余可投</StyledText>
                    </NormalView>
                  </ColumnView>
                </RowView>
                <Type>
                  <StyledText size="12">{types[item.isNewuserOnly]}</StyledText>
                </Type>
              </ItemView>
            )
          })
        }

        <SafeView>
          <CenterRow>
            {imgs.shijian(icon)}
            <StyledText color="#999999" size="10" lh="14">用户本息{`\n`}
              3年0逾期</StyledText>
          </CenterRow>
          <CenterRow>
            {imgs.safe(icon)}
            <StyledText color="#999999" size="10" lh="14">第三方托管{`\n`}
              资金保障</StyledText>
          </CenterRow>
          <CenterRow>
            {imgs.icp(icon)}
            <StyledText color="#999999" size="10" lh="14">ICP许可证{`\n`}
              安全合规</StyledText>
          </CenterRow>
        </SafeView>

          {/*<SafeView>*/}
              {/*<CenterRow>*/}
                  {/*<StyledText color="#999999" size="10" lh="0">利群理财的基金销售服务由北京兴辉投资管理有限公司提供</StyledText>*/}
              {/*</CenterRow>*/}
          {/*</SafeView>*/}

        <MessageBox
          style={{height: 195}}
          boxStyle={{height: 150, alignItems: 'flex-start'}}
          visible={this.state.messageBox.visible}
          content={this.state.messageBox.content}
          button={this.state.messageBox.button}>
          <UpdateView>
            <StyledText size="16" bottom="10" color="#333333">应用更新</StyledText>
            <StyledText size="14" bottom="6" color="#333333">更新内容:</StyledText>
            <UpdateDesc>
              <StyledText color="#333333">{this.state.updateInfo}</StyledText>
            </UpdateDesc>
          </UpdateView>
        </MessageBox>
      </ScrollLayout>
    )
  }

}

Home.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const {workingTable} = state;
  return {workingTable};
};

const mapDispatchToProps = (dispatch) => {
  const workingTableAction = bindActionCreators(workingTableCreator, dispatch);
  return {workingTableAction};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

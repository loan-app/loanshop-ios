import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';

import Touchable from '../components/Touchable';
import GuideMenu from '../components/GuideMenu';
import MessageBox from '../components/MessageBox';
import {
  BlockWrapper,
  GrayBottomRowWrapper,
  RowWrapper,
  StyledText
} from '../components/UtilLib';
import color from '../styles/color';
import {WINDOW_WIDTH} from '../config/constants';

import * as userCreator from '../actions/userActions';
import AuthCheck from '../utils/Check';

class Setting extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '设置'
  });

  constructor(props) {
    super(props);
    this.state = {
      messageBox: {
        visible: false,
        content: '',
        button: null
      }
    };
    this.second = 59;
  }

  _showOptionModal(msg, onCancel, onConfirm) {
    this.props.navigation.setParams({
      gesturesEnabled: false
    });
    this.setState({
      messageBox: {
        visible: true,
        content: msg,
        button: [
          {
            text: '取消',
            onPress: onCancel
          },
          {
            text: '确定',
            onPress: onConfirm
          }
        ]
      }
    });
  }

  _logout() {
    this._showOptionModal('确认退出登录？', () => {
      this.setState({messageBox: {visible: false}}, () => {
        this.props.navigation.setParams({
          gesturesEnabled: true
        });
      });
    }, () => {
      this.setState({messageBox: {visible: false}}, () => {
        this.context.callToast("已退出登录");
        this.props.userActions.userLogout();
        global.financeListoLoaded = false;
        global.userInfoLoaded = false;
        const navigateAction = NavigationActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({routeName: 'Main'}),
            NavigationActions.navigate({routeName: 'Login'})
          ]
        })
        this.props.navigation.dispatch(navigateAction);
      });
    });
  }

  _navigateCheck(level, route, params, toast) {
    const routers = AuthCheck(this.props.user.check, level, route, params);
    if (routers[0]) {
      this.props.navigation.navigate(routers[0], routers[1]);
    } else {
      toast && this.context.callToast(toast);
    }
  }

  componentDidMount() {
    const {userActions, user} = this.props;
    userActions.userProfile(!user.userInfo.mobile);
  }

  render() {
    const {navigate} = this.props.navigation;
    let {userInfo, check} = this.props.user;
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <BlockWrapper marginType="top">
            <GrayBottomRowWrapper>
              <GuideMenu title="绑定手机号"
                         iconComment={`${userInfo.mobile && userInfo.mobile.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")}`}
                         onPress={() => navigate("PhoneBind")}/>
            </GrayBottomRowWrapper>
            <GrayBottomRowWrapper>
              <GuideMenu title="实名认证" iconComment={userInfo.idCard || "未认证"}
                         commentTextColor={!userInfo.idCard && "#4285F4"}
                         onPress={() => this._navigateCheck(0, null, null, "已实名认证")}/>
            </GrayBottomRowWrapper>
            <GrayBottomRowWrapper>
              <GuideMenu title="我的银行卡" iconComment={userInfo.bankCard || "未绑定"}
                         commentTextColor={!userInfo.bankCard && "#4285F4"}
                         onPress={() => this._navigateCheck(1, "BankCardDetail")}/>
            </GrayBottomRowWrapper>
            <GrayBottomRowWrapper>
              <GuideMenu title="交易密码" iconComment={userInfo.isSetTradingPassword ? "修改" : "未设置"}
                         commentTextColor={!userInfo.isSetTradingPassword && "#4285F4"}
                         onPress={() => this._navigateCheck(2, 'PayPasswordModify')}/>
            </GrayBottomRowWrapper>
            <RowWrapper>
              <GuideMenu title="登录密码" iconComment="修改"
                         onPress={() => navigate('ModifyPassword')}/>
            </RowWrapper>
          </BlockWrapper>
          <BlockWrapper marginType="both">
            <RowWrapper>
              <GuideMenu title="关于"
                         onPress={() => navigate("AboutUs")}/>
            </RowWrapper>
          </BlockWrapper>
          <MessageBox
            visible={this.state.messageBox.visible}
            content={this.state.messageBox.content}
            button={this.state.messageBox.button}/>
        </ScrollView>
        <BlockWrapper style={{position: 'absolute', bottom: 0, left: 0, width: WINDOW_WIDTH}}>
          <Touchable
            style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 15}}
            onPress={this._logout.bind(this)}>
            <StyledText color={color.font.blue} size="14">安全退出</StyledText>
          </Touchable>
        </BlockWrapper>
      </View>
    )
  }

}


Setting.propTypes = {};

Setting.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  let {user} = state;
  return {user};
};

const mapDispatchToProps = (dispatch) => {
  const userActions = bindActionCreators(userCreator, dispatch);
  return {userActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
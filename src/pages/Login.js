import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import DeviceInfo from 'react-native-device-info';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {View} from 'react-native';

import formStyles from '../styles/formStyles';
import color from '../styles/color';

import Touchable from '../components/Touchable';
import imgs from '../resources/imgs';
import MessageBox from '../components/MessageBox';
import TextInputCustomized from '../components/TextInputCustomized';
import {
  ActivityIndicatorModal,
  FlexView,
  StyledButtom,
  StyledText,
  CenterView,
  BetweenView,
  HeaderButton,
  RowView
} from '../components/UtilLib';

import {loginUser as initUser} from '../requests/axios';
import {login as _login} from '../requests/http';
import * as userCreator from '../actions/userActions';
import * as workingTableCreator from '../actions/workingTableActions';
import {OS, WINDOW_WIDTH, STATUS_HEIGHT} from '../config/constants';
import * as RNTD from '../utils/TD';

const LInputView = styled.View`
  width:${WINDOW_WIDTH - 40};
  margin-top:14;
`;
const Input = styled(TextInputCustomized)`
  border-width:1;
  border-color:#E0E0E0;
  margin-top:24;
  height:50;
  border-radius:5;
`;
const CloseButton = HeaderButton.extend`
  margin-top:${STATUS_HEIGHT};
  align-self:flex-end;
`;
const Image = styled.Image`
  margin-top:20;
  margin-bottom:20;
`;
const GiteView = styled.View`
  flex-direction:row;
  justify-content:space-between;
  margin-top:10;
  width:${WINDOW_WIDTH - 40};
 `;
const textInputIcon = {
  width: 40,
  height: 40,
  resizeMode: 'center',
};


class Login extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '登录'
  });

  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      password: '',
      loginErr: '',
      loading: false,
      messageBox: {
        visible: false,
        content: '',
        onCancel: () => {
        }
      }
    };
  }

  _loginUser() {
    if (!this.state.mobile) {
      this.context.callToast('请输入手机号码');
    } else if (!this.state.password) {
      this.context.callToast('请输入密码');
    } else if (!/^[1][34578][0-9]{9}$/.test(this.state.mobile)) {
      this.context.callToast('请输入正确的手机号码');
    } else {
      let data = {
        mobile: this.state.mobile,
        password: this.state.password,
        deviceName: DeviceInfo.getModel(),
        osName: OS,
        deviceId: global.rid || ''
      };
      this.setState({loading: true});
      _login(data).then(data => {
        this.setState({loading: false});
        if (data.data.code === 0) {
          initUser(data.data.data.token);
          this.props.userActions.userProfile(false);
          RNTD.onLogin(this.state.mobile);
          this._loginSuccess();
        } else {
          this.context.callToast(data.data.msg);
        }
      }).catch(() => {
        this.setState({loading: false});
        this.context.callToast('提交失败');
      });
    }
  }

  _loginSuccess() {
    if (global.initRouter) {
      this.context.callToast('登录成功');
      const navigateAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({routeName: 'Main'}),
        ]
      });
      this.props.navigation.dispatch(navigateAction);
      // this.props.navigation.navigate("UserInfo");
    } else {
      // this.context.callToast('登录成功');
      this.props.navigation.goBack();
    }
  }

  render() {
    let {navigate, goBack} = this.props.navigation;
    return (
      <FlexView>
        <CloseButton onPress={() => goBack()}>
          {imgs.cha({height: 20, width: 20, marginRight: 5, tintColor: "#B6B6B6"})}
        </CloseButton>
        {/*<Wave*/}
        {/*type={"rectangular"}*/}
        {/*proportion={0.8}*/}
        {/*surfaceWidth={WINDOW_WIDTH}*/}
        {/*surfaceHeigth={40}*/}
        {/*superViewBackgroundColor={"rgba(0,0,0,0)"}*/}
        {/*style={{backgroundColor: '#4688F1'}}/>*/}
        {/*rgba(255,255,255,0.5)*/}

        <CenterView>
          <LInputView>
            <CenterView>
              <Image source={require("../resources/imgs/logo.png")}/>
            </CenterView>
            <Input
              icon={imgs.mobile(textInputIcon)}
              value={this.state.mobile}
              onChangeText={text => {
                this.setState({mobile: text})
              }}
              keyboardType="numeric"
              placeholder="请输入手机号码"
              textInputStyle={{height: 30}}
              onClear={() => {
                this.setState({mobile: ''})
              }}
            />
            <Input
              icon={imgs.password(textInputIcon)}
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={text => {
                this.setState({password: text})
              }}
              placeholder="请输入密码"
              textInputStyle={{height: 30}}
              onClear={() => {
                this.setState({password: ''})
              }}
            />
          </LInputView>

          <StyledButtom onPress={this._loginUser.bind(this)} top="46"
                        width={WINDOW_WIDTH - 40} height="45">
            <StyledText size="17">登录</StyledText>
          </StyledButtom>
          <GiteView>
            <Touchable onPress={() => navigate('ForgetPassword')}>
              <StyledText size="16" color="#4A4A4A">忘记密码？</StyledText>
            </Touchable>
            <Touchable onPress={() => {
              global.loginRouter = this.props.navigation.state.key;
              navigate('Register');
            }}>
              <StyledText color="#B5B5B5" size="16">没有账号？<StyledText color="#F1BE64"
                                                                     size="16">马上注册</StyledText></StyledText>
            </Touchable>
          </GiteView>
        </CenterView>
        <MessageBox
          visible={this.state.messageBox.visible}
          content={this.state.messageBox.content}
          button={this.state.messageBox.button}/>
        <ActivityIndicatorModal visible={this.state.loading}/>
      </FlexView>
    );
  }
}

Login.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  const userActions = bindActionCreators(userCreator, dispatch);
  const workingTableAction = bindActionCreators(workingTableCreator, dispatch);
  return {userActions, workingTableAction};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

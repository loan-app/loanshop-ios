import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {NavigationActions} from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import {OS, PackageName, Channel, WINDOW_WIDTH} from '../config/constants';
import {View, Image} from 'react-native';
import {loginUser as initUser} from '../requests/axios';

import TextInputCustomized from '../components/TextInputCustomized';
import Touchable from '../components/Touchable';
import {
  CenterView,
  ActivityIndicatorModal,
  StyledText,
  StyledButtom,
  ScrollLayout,
  BetweenView,
  RowView
} from '../components/UtilLib';
import color from '../styles/color';
import imgs from '../resources/imgs';
import {sendCode, checkCode, register, createApiUrl} from '../requests/http';
import * as modalCreator from '../actions/modalActions';
import * as userCreator from '../actions/userActions';
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
const DescView = styled.View`
  align-self:flex-start;
  margin-left:15;
  margin-top:10;
`;

const textInputIcon = {
  width: 40,
  height: 40,
  resizeMode: 'center',
};
class Register extends Component {
  static navigationOptions = {
    title: '注册'
  };

  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      pwd: '',
      code: '',
      mode: 1,
      second: '',
      loading: false,
      sending: false,
      canSend: true
    };
    this.second = 59;
  }

  _submit() {
    if (!this.state.mobile) {
      this.context.callToast('请输入手机号');
    } else if (!this.state.code) {
      this.context.callToast('请输入验证码');
    } else if (!/^[1][34578][0-9]{9}$/.test(this.state.mobile)) {
      this.context.callToast('请输入正确的手机号');
    } else {
      this.setState({loading: true});
      checkCode({mobile: this.state.mobile, code: this.state.code, type: 1}).then(data => {
        this.setState({loading: false});
        if (data.data.code === 0) {
          this.setState({mode: 2});
        } else {
          this.context.callToast(data.data.msg);
        }
      }).catch(() => {
        this.setState({loading: false});
        this.context.callToast('提交失败');
      });
    }
  }

  _sendCode() {
    if (!this.state.sending && this.state.canSend) {
      if (!this.state.mobile) {
        this.context.callToast('请输入手机号');
      } else if (!/^[1][34578][0-9]{9}$/.test(this.state.mobile)) {
        this.context.callToast('请输入正确的手机号');
      } else {
        this.setState({sending: true});
        sendCode({mobile: this.state.mobile, type: 1}).then(data => {
          if (data.data.code === 0) {
            this.context.callToast('验证码发送成功');
            this.setState({second: this.second, canSend: false, sending: false}, () => {
              this.interval = setInterval(() => {
                if (this.state.second == 1) {
                  clearInterval(this.interval);
                  this.setState({canSend: true, second: ''});
                } else {
                  this.setState({second: --this.state.second});
                }
              }, 1000);
            });
          } else {
            this.setState({sending: false});
            this.context.callToast(data.data.msg);
          }
        }).catch(() => {
          this.setState({sending: false});
          this.context.callToast('发送失败');
        });
      }
    }
  }

  _register() {
    if (!this.state.pwd) {
      this.context.callToast('请输入登录密码');
    } else if (!/^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,20}$/.test(this.state.pwd)) {
      this.context.callToast('密码格式有误');
    } else if (this.state.pwd !== this.state.repwd) {
      this.context.callToast('两次密码输入不一致');
    } else {
      let data = {
        mobile: this.state.mobile,
        password: this.state.pwd,
        code: this.state.code,
        deviceName: DeviceInfo.getModel(),
        deviceId: global.rid || '',
        registerFrom: OS === 'ios' ? 3 : 2,
        osName: OS,
        sid: Channel,
        packageName: PackageName
      };
      this.setState({loading: true});
      register(data).then(data => {
        this.setState({loading: false});
        if (data.data.code === 0) {
          this.context.callToast('注册成功', true);
          initUser(data.data.data.token);
          this.props.userActions.userProfile(true);
          this.props.navigation.dispatch(NavigationActions.back({key: global.loginRouter}));
          // this.props.modalActions.toggleModal(this._renderBonus(), false, 800);
          RNTD.onRegister(this.state.mobile);
        } else {
          this.context.callToast(data.data.msg);
        }
      }).catch(() => {
        this.setState({loading: false});
        this.context.callToast('提交失败');
      });
    }
  }

  _renderReg() {
    return (
      <CenterView style={{flex: 1, backgroundColor: "#fff"}}>
        <LInputView>
          <Input
            icon={imgs.mobile(textInputIcon)}
            value={this.state.mobile}
            onChangeText={text => {
              this.setState({mobile: text})
            }}
            keyboardType="numeric"
            placeholder="请输入手机号码"
            textInputStyle={{height: 44}}
            onClear={() => {
              this.setState({mobile: ''})
            }}
          />
          <Input
            icon={imgs.code(textInputIcon)}
            value={this.state.code}
            onChangeText={text => {
              this.setState({code: text})
            }}
            hideClear={true}
            placeholder="请输入短信验证码"
            keyboardType="numeric"
            textInputStyle={{height: 44}}
            onClear={() => {
              this.setState({code: ''})
            }}
            flag={this.state.canSend + this.state.second + this.state.sending}
            rightLabel={
              <StyledButtom width="100" height="50" top="-1" radius="0"
                            style={{
                              borderTopRightRadius: 4,
                              borderBottomRightRadius: 4,
                            }}
                            color={!this.state.canSend || this.state.sending ? "#BBBBBB" : "#FD863F"}
                            feedback={this.state.canSend && !this.state.sending}
                            onPress={this._sendCode.bind(this)}>
                <StyledText size="14">{this.state.second ? `${this.state.second}S后重发` : '获取验证码'}</StyledText>
              </StyledButtom>
            }
          />
          <RowView style={{marginTop: 20}}>
            <StyledText color="#999999">注册即表示您已同意</StyledText>
            <Touchable
              onPress={() => this.props.navigation.navigate("WebView", {url: createApiUrl('/user/h5/register-protocol')})}>
              <StyledText color="#ED7148">《注册协议》</StyledText>
            </Touchable>
          </RowView>
          <StyledButtom onPress={this._submit.bind(this)}>
            <StyledText size="17">下一步</StyledText>
          </StyledButtom>
        </LInputView>
        <ActivityIndicatorModal visible={this.state.loading}/>
      </CenterView>
    );
  }

  _renderPwd() {
    return (
      <CenterView style={{flex: 1, backgroundColor: "#fff"}}>
        <LInputView>
          <Input
            secureTextEntry={true}
            icon={imgs.password(textInputIcon)}
            labelWidth={105}
            value={this.state.pwd}
            onChangeText={text => {
              this.setState({pwd: text})
            }}
            placeholder="请输入登录密码"
            onClear={() => {
              this.setState({pwd: ''})
            }}
          />
          <Input
            secureTextEntry={true}
            icon={imgs.password(textInputIcon)}
            labelWidth={105}
            value={this.state.repwd}
            onChangeText={text => {
              this.setState({repwd: text})
            }}
            placeholder="再次输入登录密码"
            onClear={() => {
              this.setState({repwd: ''})
            }}
          />
          <DescView>
            <StyledText color="#9b9b9b">请使用6～20位由数字、字母组成的密码</StyledText>
          </DescView>
          <StyledButtom onPress={this._register.bind(this)}>
            <StyledText size="17">提交</StyledText>
          </StyledButtom>
        </LInputView>
        <ActivityIndicatorModal visible={this.state.loading}/>
      </CenterView>
    );
  }

  _bonusNavigate() {
    this._bonusClose();
    this.props.navigation.navigate("WebView", {url: createApiUrl("/h5/activity/ad-operations/new")});
  }

  _bonusClose() {
    this.props.modalActions.toggleModal();
  }

  // _renderBonus() {
  //   return (
  //     <BonusView>
  //       <View>
  //         <Image source={require("../resources/imgs/hb.png")}/>
  //         <BonusButton>
  //           <Touchable onPress={() => this._bonusNavigate()}>
  //             <Image source={require("../resources/imgs/hbck.png")}/>
  //           </Touchable>
  //           <Touchable onPress={() => this._bonusClose()}>
  //             <Image source={require("../resources/imgs/hbtz.png")}/>
  //           </Touchable>
  //         </BonusButton>
  //       </View>
  //     </BonusView>
  //   );
  // }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  render() {
    return this.state.mode === 1 ? this._renderReg() : this._renderPwd();
  }
}

Register.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  const modalActions = bindActionCreators(modalCreator, dispatch);
  const userActions = bindActionCreators(userCreator, dispatch);
  return {modalActions, userActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
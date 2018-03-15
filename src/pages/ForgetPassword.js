import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import {NavigationActions} from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import {View} from 'react-native';

import Touchable from '../components/Touchable';
import TextInputCustomized from '../components/TextInputCustomized';
import {
  CenterView,
  ActivityIndicatorModal,
  StyledText,
  StyledButtom,
  ScrollLayout,
} from '../components/UtilLib';
import imgs from '../resources/imgs';
import {WINDOW_WIDTH} from '../config/constants';

import {sendCode, checkCode, forget} from '../requests/http';

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
const PwdInput = styled(TextInputCustomized)`
  background-color:#ffffff;
  margin-top:10;
  padding-left:15;
`;
const CodeButton = styled(Touchable)`
  margin-right:15;
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
export default class ForgetPassword extends Component {
  static navigationOptions = {
    title: '忘记密码'
  };

  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      code: '',
      mode: 2,
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
      this.context.callToast('请输入短信验证码');
    } else if (!/^[1][34578][0-9]{9}$/.test(this.state.mobile)) {
      this.context.callToast('请输入正确的手机号');
    } else {
      this.setState({loading: true});
      checkCode({mobile: this.state.mobile, code: this.state.code, type: 2}).then(data => {
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
        sendCode({mobile: this.state.mobile, type: 2}).then(data => {
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
      this.context.callToast('请输入新的登录密码');
    } else if (!/^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,20}$/.test(this.state.pwd)) {
      this.context.callToast('密码格式有误');
    } else if (this.state.pwd !== this.state.repwd) {
      this.context.callToast('两次密码输入不一致');
    } else {
      this.setState({loading: true});
      forget({mobile: this.state.mobile, password: this.state.pwd, code: this.state.code}).then(data => {
        this.setState({loading: false});
        if (data.data.code === 0) {
          this.context.callToast('密码修改成功', true);
          this.props.navigation.goBack();
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
                            color={!this.state.canSend || this.state.sending}
                            feedback={this.state.canSend && !this.state.sending}
                            onPress={this._sendCode.bind(this)}>
                <StyledText size="14">{this.state.second ? `${this.state.second}S后重发` : '获取验证码'}</StyledText>
              </StyledButtom>
            }
          />
        </LInputView>

        <StyledButtom onPress={this._submit.bind(this)}>
          <StyledText size="17">下一步</StyledText>
        </StyledButtom>
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
            placeholder="请输入新的登录密码"
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
            placeholder="再次输入新的登录密码"
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

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  render() {
    return this.state.mode === 1 ? this._renderReg() : this._renderPwd()
  }
}

ForgetPassword.contextTypes = {
  callToast: PropTypes.func.isRequired
};
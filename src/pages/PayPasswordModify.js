import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import TextInputCustomized from '../components/TextInputCustomized';
import GuideMenu from '../components/GuideMenu';
import {
  ActivityIndicatorModal,
  StyledText,
  StyledButtom,
  ScrollLayout,
  FlexView,
  CenterView
} from '../components/UtilLib';
import {WINDOW_WIDTH, BORDER_WIDTH} from '../config/constants';

import Touchable from '../components/Touchable';
import * as bankCardDetailCreator from '../actions/bankCardDetailActions';
import {sendCode, modifyPayPassword, checkCode} from '../requests/http';

const View = styled.View`
  background-color:#ffffff;
  padding-left:15;
  margin-top:10;
  width:${WINDOW_WIDTH};
`;
const BorderInput = styled(TextInputCustomized)`
  border-bottom-width:${BORDER_WIDTH};
  border-bottom-color:#eeeeee;
`;
const CodeButton = styled(Touchable)`
  margin-right:15;
`;
const Icon = styled.Image`
  width:18;
  height:18;
  margin-right:20;
`;
const DescView = styled.View`
  align-self:flex-start;
  margin-left:15;
  margin-top:10;
`;

class PayPasswordModify extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: '修改交易密码',
  });

  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      code: '',
      bankCard: '',
      mode: 1,
      second: '',
      loading: false,
      sending: false,
      canSend: true
    };
    this.second = 59;
  }

  _sendCode() {
    const {detail} = this.props.bankCardDetail;
    if (!this.state.sending && this.state.canSend) {
      if (!detail || !detail.mobile) {
        this.context.callToast('请输入手机号');
      } else if (!/^[1][34578][0-9]{9}$/.test(detail.mobile)) {
        this.context.callToast('请输入正确的手机号');
      } else {

        this.setState({sending: true});
        sendCode({mobile: detail.mobile, type: 7}).then(data => {
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
              }, 900);
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

  _submit() {
    const {detail} = this.props.bankCardDetail;
    if (!this.state.bankCard) {
      this.context.callToast('请输入银行卡号');
    } else if (this.state.bankCard !== detail.number) {
      this.context.callToast('银行卡号错误');
    } else if (!detail.mobile) {
      this.context.callToast('请输入手机号');
    } else if (!/^[1][34578][0-9]{9}$/.test(detail.mobile)) {
      this.context.callToast('请输入正确的手机号');
    } else if (!this.state.code) {
      this.context.callToast('请输入验证码');
    } else {
      this.setState({loading: true});
      checkCode({mobile: detail.mobile, code: this.state.code, type: 7}).then(res => {
        this.setState({loading: false});
        let data = res.data;
        if (0 === data.code) {
          this.setState({mode: 2});
        } else {
          this.context.callToast(data.msg);
        }
      }).catch(err => {
        this.setState({loading: false});
        this.context.callToast("提交失败");
      });
    }
  }

  _register() {
    if (!this.state.password) {
      this.context.callToast('请输入交易密码');
    } else if (!this.state.rePassword) {
      this.context.callToast('请输入确认交易密码');
    } else if (!/^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,20}$/.test(this.state.password)) {
      this.context.callToast('密码格式有误');
    } else if (!this.state.rePassword) {
      this.context.callToast('请输入确认交易密码');
    } else if (this.state.password !== this.state.rePassword) {
      this.context.callToast('两次输入不一致');
    } else {
      this.setState({loading: true});
      modifyPayPassword({
        cardNo: this.state.bankCard,
        code: this.state.code,
        password: this.state.password
      }).then(res => {
        this.setState({loading: false});
        let data = res.data;
        if (0 === data.code) {
          this.context.callToast('交易密码设置成功', 'success');
          this.props.navigation.goBack();
        } else {
          this.context.callToast(data.msg);
        }
      }).catch(err => {
        this.setState({loading: false});
        this.context.callToast("提交失败");
      });
    }
  }

  _renderBind() {
    const {detail, loading} = this.props.bankCardDetail;
    return (
      <FlexView>
        <ScrollLayout color="transparent">
          <View>
            <BorderInput
              label="银行卡"
              labelWidth={90}
              value={this.state.bankCard}
              keyboardType="numeric"
              onChangeText={text => {
                this.setState({bankCard: text})
              }}
              placeholder={`请输入尾号${(detail && detail.number.substr(-4)) || ''}完整卡号`}
              rightLabel={detail && detail.icon ? <Icon source={{uri: detail.icon}}/> : ''}
              hideClear
            />
            <GuideMenu
              style={{paddingRight: 24}}
              feedback={false}
              bottomBorder
              titleWidth={100}
              title={'预留手机号'}
              content={detail && detail.mobile.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")}
              contentColor="#333333"
              hideArrow
            />
            <BorderInput
              label="验证码"
              labelWidth={90}
              value={this.state.code}
              keyboardType="numeric"
              onChangeText={text => {
                this.setState({code: text})
              }}
              placeholder="请输入短信验证码"
              hideClear
              flag={this.state.canSend + this.state.second + this.state.sending}
              rightLabel={
                <CodeButton feedback={this.state.canSend && !this.state.sending}
                            onPress={this._sendCode.bind(this)}>
                  <StyledText
                    color={(!this.state.canSend || this.state.sending) ? '#979797' : '#EE5C2B'}>{this.state.second ? `${this.state.second}S后重发` : '获取验证码'}</StyledText>
                </CodeButton>
              }
            />
          </View>
          <CenterView>
            <StyledButtom onPress={this._submit.bind(this)}>
              <StyledText size="17">完 成</StyledText>
            </StyledButtom>
          </CenterView>
        </ScrollLayout>
        <ActivityIndicatorModal visible={this.state.loading || loading}/>
      </FlexView>
    )
      ;
  }

  _renderPassword() {
    return (
      <ScrollLayout color="transparent">
        <View>
          <BorderInput
            label="交易密码"
            secureTextEntry={true}
            labelWidth={135}
            value={this.state.password}
            onChangeText={text => {
              this.setState({password: text})
            }}
            placeholder="请输入交易密码"
            onClear={() => {
              this.setState({password: ''})
            }}
          />
          <TextInputCustomized
            label="确认交易密码"
            secureTextEntry={true}
            labelWidth={135}
            value={this.state.rePassword}
            onChangeText={text => {
              this.setState({rePassword: text})
            }}
            placeholder="请输入确认交易密码"
            onClear={() => {
              this.setState({rePassword: ''})
            }}
          />
        </View>
        <DescView>
          <StyledText color="#9b9b9b">请使用6～20位由数字、字母组成的密码</StyledText>
        </DescView>
        <CenterView>
          <StyledButtom onPress={this._register.bind(this)} color="#EE5C2B">
            <StyledText size="17">确 定</StyledText>
          </StyledButtom>
        </CenterView>
        <ActivityIndicatorModal visible={this.state.loading }/>
      </ScrollLayout>
    );
  }

  componentDidMount() {
    this.props.bankCardDetailActions.getData(!this.props.bankCardDetail.detail);
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  render() {
    return this.state.mode === 1 ? this._renderBind() : this._renderPassword();
  }
}

PayPasswordModify.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const {bankCardDetail} = state;
  return {bankCardDetail};
};

const mapDispatchToProps = (dispatch) => {
  const bankCardDetailActions = bindActionCreators(bankCardDetailCreator, dispatch);
  return {bankCardDetailActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(PayPasswordModify);
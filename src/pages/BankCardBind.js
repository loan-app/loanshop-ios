import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from "react-navigation";

import * as userCreator from '../actions/userActions';

import color from '../styles/color';
import imgs from '../resources/imgs';
import TextInputCustomized from '../components/TextInputCustomized';
import GuideMenu from '../components/GuideMenu';
import {
  InputView,
  ActivityIndicatorModal,
  StyledText,
  StyledButtom,
  ScrollLayout,
  FlexView,
  HeaderButton
} from '../components/UtilLib';
import {WINDOW_WIDTH, BORDER_WIDTH} from '../config/constants';

import {sendCode, tiedCard, setPayPassword} from '../requests/http';

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
const CenterView = styled.View`
  align-items:center;
  flex:1;
`;
const CodeButton = styled(StyledButtom)`
  position:absolute;
  bottom:14;
  right:20;
`;
const SubmitButton = styled(StyledButtom).attrs({
  radius: 5,
  width: WINDOW_WIDTH - 40,
  height: 45,
})`
   
`;
const BottomView = styled(CenterView)`
  width:${WINDOW_WIDTH};
  background-color:#ffffff;
  margin-top:22;
  padding-top:25;
`;
const DescView = styled.View`
  align-self:flex-start;
  margin-left:20;
  margin-top:10;
`;
const PwdInput = styled(TextInputCustomized)`
  margin-top:14;
  height:40;
  width:${WINDOW_WIDTH - 40};
  background-color:#FBFBFB;
  border-width:${BORDER_WIDTH};
  border-color:#EDEDED;
  padding-left:10;
`;

class BankCardBind extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: '我的银行卡',
    headerRight: navigation.state.params && navigation.state.params.headerRight
  });

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      card: '',
      mobile: '',
      code: '',
      bankNo: '',
      bankName: '',
      bankCode: '',
      mode: 1,
      second: '',
      loading: false,
      sending: false,
      canSend: true
    };
    this.second = 59;
  }

  _submit() {
    this.setState({mode: 2}, () => {
      const headerRight = (
        <HeaderButton onPress={() => {
          goBack();
        }}>
          <StyledText color={color.font.blue} align="center">先逛逛</StyledText>
        </HeaderButton>
      );
      this.props.navigation.setParams({
        headerRight: headerRight
      });
    });
    return;
    if (!this.state.mobile) {
      this.context.callToast('请输入手机号');
    } else if (!this.state.code) {
      this.context.callToast('请输入验证码');
    } else if (!/^[1][34578][0-9]{9}$/.test(this.state.mobile)) {
      this.context.callToast('请输入正确的手机号');
    } else {
      this.setState({loading: true});
      register().then(data => {
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
    if (!this.state.mobile) {
      this.context.callToast('请输入手机号');
    } else if (!/^[1][34578][0-9]{9}$/.test(this.state.mobile)) {
      this.context.callToast('请输入正确的手机号');
    } else {
      if (!this.state.sending && this.state.canSend) {
        this.setState({sending: true});
        sendCode({mobile: this.state.mobile, type: 3}).then(data => {
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

  _selectBank(bank) {
    this.setState({bankName: bank.name, bankCode: bank.code});
  }

  _submit() {
    // if (!this.state.name) {
    //   this.context.callToast('请输入姓名');
    // } else if (!this.state.card) {
    //   this.context.callToast('请输入身份证号');
    // } else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.state.card)) {
    //   this.context.callToast('身份证号格式有误');
    // } else
    if (!this.state.bankCode) {
      this.context.callToast('请选择银行');
    } else if (!this.state.bankNo) {
      this.context.callToast('请输入本人储蓄卡号');
    } else if (!this.state.mobile) {
      this.context.callToast('请输入银行预留手机号');
    } else if (!/^[1][34578][0-9]{9}$/.test(this.state.mobile)) {
      this.context.callToast('请输入正确的手机号');
    } else if (!this.state.code) {
      this.context.callToast('请输入短信验证码');
    } else {
      this.setState({loading: true});
      tiedCard({
        // name: this.state.name,
        // idCardNo: this.state.card,
        bankId: this.state.bankCode,
        bankCardNo: this.state.bankNo,
        mobile: this.state.mobile,
        code: this.state.code
      }).then(res => {
        this.setState({loading: false});
        let data = res.data;
        if (0 === data.code) {
          this.props.userActions.userProfile(false);
          const {goBack} = this.props.navigation;
          this.setState({mode: 2, setCode: data.data.firstSetCode}, () => {
            // const headerRight = (
            //   <HeaderButton onPress={() => {
            //     goBack();
            //   }}>
            //     <StyledText color={color.font.blue} align="center">先逛逛</StyledText>
            //   </HeaderButton>
            // );
            // this.props.navigation.setParams({
            //   headerRight: headerRight
            // });
          });
        } else {
          this.context.callToast(data.msg);
        }
      }).catch(err => {
        this.setState({loading: false});
        this.context.callToast("提交失败");
      });
    }
  }

  _submitPwd() {
    if (!this.state.password) {
      this.context.callToast('请输入新密码');
    } else if (!/^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,20}$/.test(this.state.password)) {
      this.context.callToast('密码格式有误');
    } else {
      setPayPassword({
        password: this.state.password,
        firstSetCode: this.state.setCode
      }).then(res => {
        this.setState({loading: false});
        let data = res.data;
        if (0 === data.code) {
          this.context.callToast("交易密码设置成功", true);
          this.props.userActions.userProfile(false);
          this.props.navigation.dispatch(NavigationActions.back({key: global.backRouter}));
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
    return (
      <FlexView>
        <ScrollLayout color="transparent">
          <StyledText color="#999999" top="15" left="15" bottom="3">请添加持卡本人的银行卡</StyledText>
          <View>
            {/*<BorderInput*/}
            {/*label="真实姓名"*/}
            {/*labelWidth={90}*/}
            {/*value={this.state.name}*/}
            {/*onChangeText={text => {*/}
            {/*this.setState({name: text})*/}
            {/*}}*/}
            {/*placeholder="请输入真实姓名"*/}
            {/*onClear={() => {*/}
            {/*this.setState({name: ''})*/}
            {/*}}*/}
            {/*/>*/}
            {/*<BorderInput*/}
            {/*label="证件号码"*/}
            {/*labelWidth={90}*/}
            {/*value={this.state.card}*/}
            {/*onChangeText={text => {*/}
            {/*this.setState({card: text})*/}
            {/*}}*/}
            {/*placeholder="请输入证件号码"*/}
            {/*onClear={() => {*/}
            {/*this.setState({card: ''})*/}
            {/*}}*/}
            {/*/>*/}
            <GuideMenu
              style={{paddingRight: 24}}
              bottomBorder
              titleWidth={100}
              title={'开户行'}
              content={this.state.bankName}
              contentColor="#000"
              defaultContent={'请选择开户银行'}
              onPress={() => {
                this.props.navigation.navigate("BankList", {onSelect: this._selectBank.bind(this)})
              }}/>
            <BorderInput
              label="银行卡"
              labelWidth={90}
              value={this.state.bankNo}
              keyboardType="numeric"
              onChangeText={text => {
                this.setState({bankNo: text})
              }}
              placeholder="请输入银行卡号"
              onClear={() => {
                this.setState({bankNo: ''})
              }}
            />
            <BorderInput
              label="手机号"
              labelWidth={90}
              value={this.state.mobile}
              keyboardType="numeric"
              onChangeText={text => {
                this.setState({mobile: text})
              }}
              placeholder="请输入银行预留手机号"
              onClear={() => {
                this.setState({mobile: ''})
              }}
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
            />
            <CodeButton top="0" radius="6" width="80" height="28"
                        color={(!this.state.canSend || this.state.sending) && '#979797'}
                        feedback={this.state.canSend || this.state.sending}
                        onPress={this._sendCode.bind(this)}>
              <StyledText height="24" size="13">{this.state.second ? `${this.state.second}S后重发` : '获取验证码'}</StyledText>
            </CodeButton>
          </View>
          <StyledText color="#999999" top="15" left="15" bottom="3">信息加密处理，仅用于银行验证</StyledText>
          <CenterView>
            <SubmitButton onPress={this._submit.bind(this)}>
              <StyledText size="17">确  定</StyledText>
            </SubmitButton>
          </CenterView>
          {/*<StyledText color="#999999" lh="20" top="10" left="15" size="12" style={{paddingRight:15}}>*/}
            {/*快捷支付仅支持以下商业银行(13家）：*/}
            {/*{`\n`}中国银行、农业银行、工商银行、建设银行、兴业银行、光大银行、民生银行、中信银行、平安银行、浦发银行、广发银行、招商银行（单笔2万元，当日限额5万元）*/}
            {/*{`\n`}各商业银行支付限额以银监会及各行公告为准！</StyledText>*/}
        </ScrollLayout>
        <ActivityIndicatorModal visible={this.state.loading}/>
      </FlexView>
    );
  }

  _renderSuccess() {
    return (
      <InputView>
        <CenterView>
          {imgs.operSuccess({margin: 18})}
          <StyledText color="#999999">
            恭喜你已绑定银行卡（{this.state.bankName} 尾号{this.state.bankNo.substr(-4)}）成功
          </StyledText>
          <BottomView>
            <StyledText color="#333333">请设置交易密码</StyledText>
            <PwdInput label="输入交易密码" labelWidth={106}
                      secureTextEntry={true}
                      value={this.state.password}
                      onChangeText={text => {
                        this.setState({password: text})
                      }}
                      placeholder="请输入交易密码"
                      onClear={() => {
                        this.setState({password: ''})
                      }}/>
            <DescView>
              <StyledText color="#9b9b9b">请使用6～20位由数字、字母组成的密码</StyledText>
            </DescView>
            <StyledButtom onPress={this._submitPwd.bind(this)} top="60" radius="20" width="153" height="38">
              <StyledText size="14">确定</StyledText>
            </StyledButtom>
          </BottomView>
        </CenterView>
      </InputView>
    );
  }

  render() {
    return this.state.mode === 1 ? this._renderBind() : this._renderSuccess();
  }
}

BankCardBind.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  const userActions = bindActionCreators(userCreator, dispatch);
  return {userActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(BankCardBind);
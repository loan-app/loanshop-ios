import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  View
} from 'react-native';

import {
  ActivityIndicatorModal,
  StyledText,
  CenterView,
  BetweenView,
  StyledButtom,
  ScrollLayout,
  HeaderButton,
  NormalView
} from '../components/UtilLib';
import {OS, STATUS_HEIGHT, BORDER_WIDTH, WINDOW_WIDTH} from '../config/constants';
import Touchable from '../components/Touchable';
import TextInputCustomized from '../components/TextInputCustomized';
import GuideMenu from '../components/GuideMenu';
import color from '../styles/color';
import imgs from '../resources/imgs';
import FloatFormatter from '../utils/Float';

import {sendCode, cashRequest, cash, createApiUrl} from '../requests/http';
import * as userCreator from '../actions/userActions';
import * as bankCardDetailCreator from '../actions/bankCardDetailActions';

const HBgView = styled.View`
  background-color: ${color.background.userBlue};
  padding-top: ${STATUS_HEIGHT || 10};
`;
const DescButton = styled(Touchable)`
  align-self:flex-end;
  margin-top:8;
  margin-right:20;
`;
const InputView = styled.View`
  background-color:#ffffff;
  padding-horizontal:20;
`;
const PwdView = styled.View`
  margin-vertical:10;
  padding-left:20;
  background-color:#ffffff;
`;
const BorderInput = styled(TextInputCustomized)`
  border-bottom-width:${BORDER_WIDTH};
  border-bottom-color:#eeeeee;
`;
const CodeButton = styled(StyledButtom)`
  margin-right:20;
`;
const RowView = BetweenView.extend.attrs({
  marginTop: props => props.marginTop || 0
})`
  background-color:#ffffff;
  padding-horizontal:20;
  width:${WINDOW_WIDTH};
  padding-vertical:10;
  border-bottom-width:${BORDER_WIDTH};
  border-bottom-color:#eeeeee;
  margin-top:${props => props.marginTop};
`;
const MoneyView = CenterView.extend`
  margin-top:15;
  margin-bottom:30;
`;
const DescView = styled.View`
  height:32;
  justify-content:center;
  padding-left:20;
`;
const icon = {width: 28, height: 28, resizeMode: 'center'};

class Cash extends Component {

  static navigationOptions = ({navigation}) => ({
    hideHeader: navigation.state.params.hideHeader
  });

  constructor(props) {
    super(props);
    this.state = this._initState();
    this.second = 59;
  }

  _initState(flag) {
    flag && this.props.navigation.setParams({
      hideHeader: true,
      title: ''
    });
    return {
      money: '',
      code: '',
      password: '',
      msg: '',
      handleFee: '',
      mode: 1,
      canTouch: false,
      second: '',
      loading: false,
      sending: false,
      canSend: true
    };
  }

  _next() {
    if (isNaN(this.state.money)) {
      this.context.callToast('请输入合法金额');
    } else if (!this.props.userInfo.balance || this.props.userInfo.balance < this.state.money) {
      this.context.callToast('提现金额超出余额');
    } else {
      cashRequest({amount: this.state.money}).then(data => {
        this.setState({loading: false});
        if (data.data.code === 0) {
          this.setState({mode: 2, handleFee: data.data.data.handleFee});
          this.props.navigation.setParams({
            hideHeader: false,
            title: '提现'
          });
        } else {
          this.context.callToast(data.data.msg);
        }
      }).catch(() => {
        this.setState({loading: false});
        this.context.callToast('提交失败');
      });
    }
  }

  _submit() {
    if (!this.state.code) {
      this.context.callToast('请输入验证码');
    } else if (!this.state.password) {
      this.context.callToast('请输入交易密码');
    } else {
      this.setState({loading: true});
      cash({
        amount: this.state.money,
        code: this.state.code,
        tradingPassword: this.state.password,
        clientType: OS === 'ios' ? 3 : 2
      }).then(data => {
        this.setState({loading: false});
        if (data.data.code === 0) {
          this.context.callToast("提现成功", true);
          this.props.userActions.userProfile(false);
          this.setState({mode: 3}, () => {
            this.props.navigation.setParams({
              title: "提现成功"
            });
          });
        } else {
          // this.setState({mode: 4, msg: data.data.msg}, () => {
          //   this.props.navigation.setParams({
          //     title: "提现失败"
          //   });
          // });
          this.context.callToast(data.data.msg);
        }
      }).catch(() => {
        this.setState({loading: false});
        this.context.callToast('提交失败');
      });
    }
  }

  _sendCode() {
    if ((!this.state.sending && this.state.canSend) || !this.props.userInfo.mobile) {
      this.setState({sending: true});
      sendCode({mobile: this.props.userInfo.mobile, type: 5}).then(data => {
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

  _renderCash() {
    let {userInfo} = this.props;
    const {detail, loading} = this.props.bankCardDetail;
    return (
      <ScrollLayout color="transparent">
        <ActivityIndicatorModal visible={loading}/>
        <HBgView>
          <NormalView>
            <HeaderButton onPress={() => this.props.navigation.goBack()}>
              {imgs.leftArrowWhite({marginRight: 20})}
            </HeaderButton>
            <CenterView
              style={{width: WINDOW_WIDTH / 2, position: "absolute", bottom: 15, left: WINDOW_WIDTH / 4}}>
              <StyledText size="17">提现</StyledText>
            </CenterView>
          </NormalView>
          <MoneyView>
            <StyledText size="30">{FloatFormatter(userInfo.balance)}</StyledText>
            <StyledText color="#F0DCCE">可用余额(元)</StyledText>
          </MoneyView>
        </HBgView>
        <GuideMenu
          style={{marginTop: 10, paddingLeft: 20}}
          feedback={false}
          bottomBorder
          title={`${detail && detail.bankName || ''}（尾号${(detail && detail.number.substr(-4)) || ''}）`}
          hideArrow
        />
        <DescView>
          <StyledText color="#999999">
            该卡本次最高可提现金额
            <StyledText color="#FDA12D">{FloatFormatter(userInfo.balance)}元</StyledText>
          </StyledText>
        </DescView>
        <InputView>
          <TextInputCustomized label="金额"
                               labelWidth={40}
                               value={this.state.money}
                               rightLabel={
                                 <Touchable onPress={() => this.setState({money: userInfo.balance,canTouch: (userInfo.balance > 0 ? true : false)})}>
                                   <StyledText size="15" color="#EE5C2B">全部</StyledText>
                                 </Touchable>
                               }
                               placeholder="请输入提现金额"
                               keyboardType="numeric"
                               hideClear
                               onChangeText={text => {
                                 if (text) {
                                   if (!isNaN(text)) {
                                     this.setState({money: text, canTouch: (text > 0 ? true : false)});
                                   } else {
                                     this.setState({money: '', canTouch: false});
                                   }
                                 } else {
                                   this.setState({money: text, canTouch: false});
                                 }
                               }}/>
        </InputView>
        <DescButton
          onPress={() => this.props.navigation.navigate("WebView", {url: createApiUrl('/user/h5/withdraw-rule')})}>
          <StyledText color={color.font.blue} size="12">提现规则说明</StyledText>
        </DescButton>
        <CenterView>
          <StyledButtom feedback={this.state.canTouch}
                        color={this.state.canTouch ? "#EE5C2B" : '#dddddd'}
                        onPress={() => this.state.canTouch && this._next()}>
            <StyledText size="17">确  定</StyledText>
          </StyledButtom>
        </CenterView>
        <StyledText color="#999999" lh="20" top="15" left="15" size="12" style={{paddingRight: 15}}>
          温馨提示：{`\n`}
          1.提现限额单笔5万元，工作日提现手续费为1元/笔，法定节假日手续费为：提现金额×0.005元/笔，提现手续费以实际到账日为准；{`\n`}
          2.提现到账时间为T＋1，双休日或法定节假日顺延，实际到账时间可能会受各银行工作时间影响，请根据银行实际到账为准；{`\n`}
          3.如体现资金在48小时后还未到账，请联系在线客服或联系客服热线：400-871-3088；{`\n`}
        </StyledText>
      </ScrollLayout>
    )
  }

  _renderPwd() {
    const {detail} = this.props.bankCardDetail;
    const canSubmit = (this.state.password && this.state.code) ? true : false;
    return (
      <ScrollLayout color="transparent">
        <PwdView>
          <GuideMenu
            feedback={false}
            bottomBorder
            titleWidth={112}
            title={'提现银行'}
            content={`${detail && detail.bankName}（尾号${(detail && detail.number.substr(-4)) || ''}）`}
            contentColor="#333333"
            hideArrow
          />
          <GuideMenu
            feedback={false}
            bottomBorder
            titleWidth={112}
            title={'提现金额'}
            content={`${FloatFormatter(this.state.money)}元`}
            contentColor="#333333"
            hideArrow
          />
          <GuideMenu
            style={{marginLeft: -20, paddingLeft: 20}}
            feedback={false}
            bottomBorder
            titleWidth={112}
            title={'手续费'}
            content={`${FloatFormatter(this.state.handleFee)}元${this.state.handleFee == 0 ? '（每日首次免提现费）' : ''}`}
            contentColor="#333333"
            hideArrow
          />
          <GuideMenu
            style={{borderBottomColor: '#fff'}}
            feedback={false}
            bottomBorder
            titleWidth={112}
            title={'实际到账'}
            content={`${FloatFormatter(this.state.money - this.state.handleFee || 0)}元`}
            contentColor="#ffa30f"
            hideArrow
          />
        </PwdView>
        <PwdView>
          <BorderInput
            icon={imgs.keyboard(icon)}
            labelWidth={100}
            value={this.state.code}
            keyboardType="numeric"
            flag={this.state.canSend + this.state.second + this.state.sending}
            onChangeText={text => {
              this.setState({code: text})
            }}
            placeholder="验证码"
            hideClear
            rightLabel={
              <CodeButton top="0" radius="6" width="80" height="28"
                          color={(!this.state.canSend || this.state.sending) && '#979797'}
                          feedback={this.state.canSend || this.state.sending}
                          onPress={this._sendCode.bind(this)}>
                <StyledText>{this.state.second ? `${this.state.second}S后重发` : '获取验证码'}</StyledText>
              </CodeButton>
            }
          />
          <BorderInput
            style={{borderBottomColor: '#fff'}}
            icon={imgs.loginPwd(icon)}
            secureTextEntry={true}
            labelWidth={100}
            value={this.state.password}
            onChangeText={text => {
              this.setState({password: text})
            }}
            placeholder="请输入交易密码"
            onClear={() => {
              this.setState({password: ''})
            }}
          />
        </PwdView>
        <DescButton onPress={() => this.props.navigation.navigate("PayPasswordModify")} style={{marginTop: -2}}>
          <StyledText color={color.font.blue} size="10">忘记交易密码</StyledText>
        </DescButton>
        <CenterView>
          <StyledButtom feedback={canSubmit} height="38" radius="19"
                        color={canSubmit ? color.background.blue : '#dddddd'} top="40" width="153"
                        onPress={() => canSubmit && this._submit()}>
            <StyledText size="13">确认提现</StyledText>
          </StyledButtom>
        </CenterView>
      </ScrollLayout>
    );
  }

  _renderSuccess() {
    return (
      <CenterView>
        {imgs.operSuccess({margin: 18})}
        <StyledText color="#333333">提现成功</StyledText>
        <StyledText size="11" color="#999999">
          预计到账时间
          <StyledText size="11" color="#FCBE63" height="28">1-3个工作日</StyledText>
        </StyledText>
        <RowView marginTop={20}>
          <StyledText color="#333333">提现金额</StyledText>
          <StyledText color="#333333">{FloatFormatter(this.state.money)}元</StyledText>
        </RowView>
        <RowView>
          <StyledText color="#333333">手续费</StyledText>
          <StyledText color="#333333">{FloatFormatter(this.state.handleFee)}元</StyledText>
        </RowView>
        <RowView>
          <StyledText color="#333333">实际到账</StyledText>
          <StyledText color="#333333">{FloatFormatter(this.state.money - this.state.handleFee || 0)}元</StyledText>
        </RowView>
        <StyledButtom height="38" radius="19" top="40" width="153"
                      onPress={() => this.props.navigation.goBack()}>
          <StyledText size="14">我知道了</StyledText>
        </StyledButtom>
      </CenterView>
    );
  }

  _renderError() {
    return (
      <CenterView>
        {imgs.operSuccess({marginTop: 40, marginBottom: 18})}
        <StyledText color="#333333">交易已关闭</StyledText>
        <StyledText color="#999999" height="26">{this.state.msg}</StyledText>
        <StyledButtom height="38" radius="19" top="40" width="153"
                      onPress={() => this.setState(this._initState(true))}>
          <StyledText size="14">重试提现</StyledText>
        </StyledButtom>
      </CenterView>
    );
  }

  componentWillMount() {
    this.props.navigation.setParams({
      hideHeader: true
    });
    this.interval && clearInterval(this.interval);
  }

  componentDidMount() {
    const {userActions} = this.props;
    userActions.userProfile(false);
    this.props.bankCardDetailActions.getData(!this.props.bankCardDetail.detail);
  }

  render() {
    if (this.state.mode === 1) {
      return this._renderCash();
    } else if (this.state.mode === 2) {
      return this._renderPwd();
    } else if (this.state.mode === 3) {
      return this._renderSuccess();
    } else if (this.state.mode === 4) {
      return this._renderError();
    }
  }
}

Cash.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const userInfo = state.user.userInfo;
  const bankCardDetail = state.bankCardDetail;
  return {userInfo, bankCardDetail};
};

const mapDispatchToProps = (dispatch) => {
  const userActions = bindActionCreators(userCreator, dispatch);
  const bankCardDetailActions = bindActionCreators(bankCardDetailCreator, dispatch);
  return {userActions, bankCardDetailActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(Cash);
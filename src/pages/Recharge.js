import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {View, NativeModules, findNodeHandle, StatusBar} from 'react-native';
import {
  ScrollLayout,
  StyledText,
  StyledButtom,
  CenterView,
  BetweenView,
  ActivityIndicatorModal,
  NormalView,
  HeaderButton,
  FlexView,
  RowView
} from '../components/UtilLib';
import MessageBox from '../components/MessageBox';
import Touchable from '../components/Touchable';
import TextInputCustomized from '../components/TextInputCustomized';
import GuideMenu from '../components/GuideMenu';
import color from '../styles/color';
import imgs from '../resources/imgs';
import {WINDOW_WIDTH, BORDER_WIDTH, WINDOW_HEIGHT, OS, STATUS_HEIGHT} from '../config/constants';

import * as bankCardDetailCreator from '../actions/bankCardDetailActions';
import * as userCreator from '../actions/userActions';
import {sendCode, recharge, deposit} from '../requests/http';
import PayView from  '../components/PayView';
import FloatFormatter from '../utils/Float';
import * as RNTD from '../utils/TD';
const PayManager = NativeModules.MyViewManager;
const FyPay = NativeModules.FyPay;

const HBgView = styled.View`
  background-color: ${color.background.userBlue};
  padding-top: ${STATUS_HEIGHT || 10};
`;
const ItemView = styled.View`
  margin-vertical:10;
  padding-left:20;
  background-color:#ffffff;
  height:51;
  flex-direction:row;
  align-items:center;
`;
const Image = styled.Image`
   margin-right:10;
   margin-top:10;
   align-self:flex-start;
   width:18;
   height:18;
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
const Info = styled.View`
  padding-vertical:4;
  padding-left:20;
`;
const PwdView = styled.View`
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
const RowView1 = BetweenView.extend.attrs({
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

class Recharge extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '快捷充值',
      header: null,
  });

  constructor(props) {
    super(props);
    this.state = this._initState();
    this.second = 59;
  }

  _initState(flag) {
    flag && this.props.navigation.setParams({
      title: "快捷充值"
    });
    return {
      money: '',
      mobile: '',
      code: '',
      password: '',
      msg: '',
      mode: 1,
      canTouch: false,
      second: '',
      loading: false,
      sending: false,
      canSend: true,
      messageBox: {
        visible: false,
        content: '',
        button: null
      },
    };
  }

  _showOptionModal(msg, onCancel, onConfirm) {
    this.props.navigation.setParams({
      gesturesEnabled: false
    });
    this.setState({
      messageBox: {
        visible: true,
        content: msg,
        button: {
          text: '确认',
          onPress: () => {
            this.props.navigation.setParams({
              gesturesEnabled: true
            });
            this.setState({
              messageBox: {
                visible: false
              }
            });
          }
        }
      }
    });
  }

  _next() {
    if (isNaN(this.state.money) && this.state.money > 0) {
      this.context.callToast('请输入合法金额');
    } else if (!/^[0-9]+$/.test(this.state.money)) {
      this.context.callToast('充值金额为整数');
    } else {
      this.setState({loading: true});
      deposit({money: this.state.money, clientType: (OS === "ios" ? 3 : 2)}).then(rdata => {
        if (rdata.data.code === 0) {
          if (OS === "ios") {
            setTimeout(() => {
              this.setState({loading: false});
            }, 2000);
            PayManager && PayManager.pay(findNodeHandle(this.refs.payView), rdata.data.data.requestParamList[0], (err, data) => {
              this.setState({loading: false});
              if (data) {
                if (data.RESPONSECODE === '0000') {
                  this.context.callToast('充值成功', true);
                  this.props.userActions.userProfile(false, 2000);
                  this.setState({mode: 3, createdAt: rdata.data.data.createdAt, number: rdata.data.data.number});
                  this.props.navigation.setParams({
                    title: "充值成功",
                    hideHeader: false
                  });
                  RNTD.onPay(this.props.user.userInfo.mobile, this.state.number, this.state.money * 100, '富友支付');
                } else if (data.RESPONSECODE !== "-2") {
                  this._showOptionModal(`充值失败，M${data.RESPONSEMSG}C${data.RESPONSECODE}`);
                }
              } else {
                this._showOptionModal(`${data.RESPONSEMSG}，C${data.RESPONSECODE}`);
              }
            });
          } else {
            setTimeout(() => {
              this.setState({loading: false});
            }, 2000);
            FyPay && FyPay.pay(rdata.data.data.requestParamList[0], (data) => {
              this.setState({loading: false});
              if (data.indexOf("xml") > -1) {
                data = {
                  RESPONSECODE: data.substring(data.indexOf("<RESPONSECODE>") + 14, data.indexOf("</RESPONSECODE>")),
                  RESPONSEMSG: data.substring(data.indexOf("<RESPONSEMSG>") + 13, data.indexOf("</RESPONSEMSG>")),
                };
                if (data.RESPONSECODE === '0000') {
                  this.context.callToast('充值成功', true);
                  this.props.userActions.userProfile(false, 2000);
                  this.setState({mode: 3, createdAt: rdata.data.data.createdAt, number: rdata.data.data.number});
                  this.props.navigation.setParams({
                    title: "充值成功",
                    hideHeader: false
                  });
                  RNTD.onPay(this.props.user.userInfo.mobile, this.state.number, this.state.money * 100, '富友支付');
                } else if (data.RESPONSECODE !== "-2") {
                  this._showOptionModal(`充值失败，M${data.RESPONSEMSG}C${data.RESPONSECODE}`);
                }
              } else if (data) {
                this._showOptionModal("FYPay: " + data);
              }
            });
          }
        } else {
          this.setState({loading: false});
          this.context.callToast(rdata.data.msg);
        }
      }).catch((e) => {
        this.setState({loading: false});
        this.context.callToast('提交失败,请检查网络');
        console.log(e);
      });
    }
  }

  _submit() {
    return;
    if (!this.state.mobile) {
      this.context.callToast('请输入手机号');
    } else if (!/^[1][34578][0-9]{9}$/.test(this.state.mobile)) {
      this.context.callToast('请输入正确的手机号');
    } else if (!this.state.code) {
      this.context.callToast('请输入验证码');
    } else if (!this.state.password) {
      this.context.callToast('请输入交易密码');
    } else {
      this.setState({loading: true});
      recharge().then(data => {
        this.setState({loading: false});
        if (data.data.code === 0) {
          this.setState({mode: 3}, () => {
            this.props.navigation.setParams({
              title: "充值成功"
            });
          });
        } else {
          this.setState({mode: 4, msg: data.data.msg}, () => {
            this.props.navigation.setParams({
              title: "充值失败"
            });
          });
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
        sendCode({mobile: this.state.mobile}).then(data => {
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

  _renderRecharge() {
    const {detail} = this.props.bankCardDetail;
    return (
      <ScrollLayout color="transparent">
        <FlexView style={{height: WINDOW_HEIGHT}}>
          <ActivityIndicatorModal visible={this.state.loading}/>
          <HBgView>
            <NormalView>
              <HeaderButton onPress={() => this.props.navigation.goBack()}>
                {imgs.leftArrowWhite({marginRight: 20})}
              </HeaderButton>
              <CenterView
                style={{width: WINDOW_WIDTH / 2, position: "absolute", bottom: 15, left: WINDOW_WIDTH / 4}}>
                <StyledText size="17">快捷充值</StyledText>
              </CenterView>
            </NormalView>
            <MoneyView>
              <StyledText size="30">{FloatFormatter(this.props.user.userInfo.balance)}</StyledText>
              <StyledText color="#F0DCCE">可用余额(元)</StyledText>
            </MoneyView>
          </HBgView>
          {detail &&
          <ItemView>
            {detail.icon && <Image source={{uri: detail.icon}}/>}
            <View>
              <StyledText color="#333333" size="14">{detail.bankName}（尾号{detail.number.substr(-4)}）</StyledText>
              <StyledText color="#999999" size="12">
                单笔限额{detail.singleLimit},日累计限额{detail.dailyAccumulativeLimit},月累计限额{detail.monthlyAccumulativeLimit}
              </StyledText>
            </View>
          </ItemView>
          }
          <InputView>
            <TextInputCustomized label="充值金额"
                                 labelWidth={90}
                                 value={this.state.money}
                                 placeholder="请输入充值金额(元)"
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
          <DescButton onPress={() => this.props.navigation.navigate("BankList")}>
            <StyledText color={color.font.blue}>限额说明</StyledText>
          </DescButton>
          <CenterView>
            <StyledButtom feedback={this.state.canTouch} top="40" radius="5" width={WINDOW_WIDTH - 40} height="45"
                          color={this.state.canTouch ? "#EC5D35" : '#dddddd'}
                          onPress={() => this.state.canTouch && this._next()}>
              <StyledText size="17">确 定</StyledText>
            </StyledButtom>
          </CenterView>
          <StyledText color="#999999" lh="20" top="15" left="15" size="12" style={{paddingRight: 15}}>
            温馨提示：{`\n`}
            1.充值实时到账，如有疑问请联系客服热线400-6683-878；{`\n`}
            2.请注意您的银行卡充值限额，以免造成不便；{`\n`}
            3.如需使用大额充值，请登录贷款喵官网(www.chengzilicai.com)使用网银充值；{`\n`}
          </StyledText>
          {/*<FlexView/>*/}
          {/*<CenterView>*/}
          {/*<RowView>*/}
          {/*{imgs.anquan({marginRight:5})}*/}
          {/*<StyledText color="#B6B6B6" size="12" bottom="15">投资资金全程由宜宾银行存管</StyledText>*/}
          {/*</RowView>*/}
          {/*</CenterView>*/}
        </FlexView>
        <PayView ref="payView" value={0} num={0} isTest1={false} infoDict={{}}/>
        <MessageBox
          visible={this.state.messageBox.visible}
          content={this.state.messageBox.content}
          button={this.state.messageBox.button}/>
      </ScrollLayout>
    );
  }

  _renderPwd() {
    const canSubmit = (this.state.mobile && this.state.password && this.state.code) ? true : false;
    return (
      <ScrollLayout color="transparent">
        <ItemView>
          <View>
            <StyledText color="#333333" size="14">{this.state.money}元</StyledText>
            <StyledText color="#999999" size="10">单笔限额20万，单日限额50万</StyledText>
          </View>
        </ItemView>
        <Info>
          <StyledText color="#999999">
            订单号：B71544887412554411{`\n`}
            姓名：张四德{`\n`}
            所属平台：钱市网{`\n`}
            平台公司名称：杭州乾市电子商务有限公司
          </StyledText>
        </Info>
        <PwdView>
          <GuideMenu
            style={{paddingRight: 24}}
            feedback={false}
            bottomBorder
            titleWidth={112}
            title={'银行卡'}
            content={'建行银行（尾号9897）'}
            contentColor="#333333"
            hideArrow
          />
          <BorderInput
            label="预留手机号"
            labelWidth={100}
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
            labelWidth={100}
            value={this.state.code}
            keyboardType="numeric"
            onChangeText={text => {
              this.setState({code: text})
            }}
            placeholder="请输入短信验证码"
            hideClear
            rightLabel={
              <CodeButton top="0" radius="6" width="70" height="28"
                          color={(!this.state.canSend || this.state.sending) && '#979797'}
                          feedback={this.state.canSend || this.state.sending}
                          onPress={this._sendCode.bind(this)}>
                <StyledText>{this.state.second ? `${this.state.second}S后重发` : '获取验证码'}</StyledText>
              </CodeButton>
            }
          />
          <BorderInput
            label="交易密码"
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
        <CenterView>
          <StyledButtom feedback={canSubmit} height="38" radius="19"
                        color={canSubmit ? color.background.blue : '#dddddd'} top="40" width="153"
                        onPress={() => canSubmit && this._submit()}>
            <StyledText size="13">下一步</StyledText>
          </StyledButtom>
        </CenterView>
      </ScrollLayout>
    );
  }

  _renderSuccess() {
    return (
      <CenterView>
        <StatusBar barStyle="dark-content" hidden={false} showHideTransition='fade'
                   animated={true}/>
        {imgs.operSuccess({margin: 18})}
        <StyledText color="#333333">充值成功</StyledText>
        <RowView1 marginTop={20}>
          <StyledText color="#333333">充值金额</StyledText>
          <StyledText color="#333333">{FloatFormatter(this.state.money)}元</StyledText>
        </RowView1>
        <RowView1>
          <StyledText color="#333333">充值时间</StyledText>
          <StyledText color="#333333">{this.state.createdAt}</StyledText>
        </RowView1>
        <RowView1>
          <StyledText color="#333333">资金流水号</StyledText>
          <StyledText color="#333333">{this.state.number}</StyledText>
        </RowView1>
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
        <StyledText color="#999999" height="28">{this.state.msg}</StyledText>
        <StyledButtom height="38" radius="19" top="40" width="153"
                      onPress={() => this.setState(this._initState(true))}>
          <StyledText size="13">重试充值</StyledText>
        </StyledButtom>
      </CenterView>
    );
  }

  componentDidMount() {
    this.props.bankCardDetailActions.getData(!this.props.bankCardDetail);
  }

  render() {
    if (this.state.mode === 1) {
      return this._renderRecharge();
    } else if (this.state.mode === 2) {
      return this._renderPwd();
    } else if (this.state.mode === 3) {
      return this._renderSuccess();
    } else if (this.state.mode === 4) {
      return this._renderError();
    }
  }
}

Recharge.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const {bankCardDetail, user} = state;
  return {bankCardDetail, user};
};

const mapDispatchToProps = (dispatch) => {
  const bankCardDetailActions = bindActionCreators(bankCardDetailCreator, dispatch);
  const userActions = bindActionCreators(userCreator, dispatch);
  return {bankCardDetailActions, userActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(Recharge);

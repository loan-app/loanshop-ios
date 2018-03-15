import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Modal from 'react-native-modalbox';
import MessageBox from '../components/MessageBox';
const dismissKeyboard = require('dismissKeyboard');

import imgs from '../resources/imgs';
import {StyleSheet, KeyboardAvoidingView} from 'react-native';

import * as financeDetailCreator from '../actions/financeDetailActions';
import * as userCreator from '../actions/userActions';

import {
  ActivityIndicatorModal2,
  StyledText,
  FlexView,
  RowView,
  CenterView,
  BetweenView,
  StyledButtom,
  InputView,
  NormalView,
  CenterRow
} from '../components/UtilLib';
import Touchable from '../components/Touchable';
import TextInputCustomized from '../components/TextInputCustomized';
import GuideMenu from '../components/GuideMenu';

import {OS, BORDER_WIDTH, WINDOW_WIDTH, WINDOW_HEIGHT} from '../config/constants';
import colors from '../styles/color';
import FloatFormatter from '../utils/Float';
import {sendCode, invest, getBonusListForBuy} from '../requests/http';

const Container = styled.View`
  padding-left:15;
  padding-right:20;
  padding-top:8;
  padding-bottom:25;
  margin-top:10;
  background-color:#ffffff;
`;
const Input = styled(TextInputCustomized).attrs({
  labelStyle: {
    color: "#999999",
    fontSize: 20
  }
})`
  border-bottom-width:1;
  border-bottom-color:#eeeeee;
  width:${WINDOW_WIDTH - 110};
  margin-horizontal:10;
  margin-top:26;
  align-self:flex-end;
`;
const ItemView = BetweenView.extend`
  padding-horizontal:14;
  padding-vertical:10;
  background-color:#ffffff;
  margin-top:10;
`;
const Bar = BetweenView.extend`
  height:50;
  border-bottom-width:${BORDER_WIDTH};
  border-color:#eeeeee;
`;
const PayView = CenterView.extend`
  padding-horizontal:12;
  padding-top:15;
`;
const InfoView = BetweenView.extend`
  width:${WINDOW_WIDTH - 24};
  margin-top:10;
  margin-bottom:15;
`;
const BorderInput = styled(TextInputCustomized)`
  padding-top:4;
  border-bottom-width:${BORDER_WIDTH};
  border-bottom-color:#eeeeee;
`;
const BDescView = BetweenView.extend`
  width:${WINDOW_WIDTH};
  padding-right:14;
  justify-content:flex-end;
`;
const Content = styled.View`
  margin-vertical:40;
  padding-horizontal:40;
`;
const SuccessContent = CenterView.extend`
  padding-top:48;
  padding-bottom:30;
  background-color:#fff;
  margin-top:10;
`;
const Bg = styled.ImageBackground.attrs({
  source: require("../resources/imgs/beijing.png"),
})`
  width:${WINDOW_WIDTH};
  height:${WINDOW_WIDTH * 0.32};
  margin-top:10;
  padding-bottom:10;
  padding-top:6;
  align-items:center;
`;
const BonusView = CenterView.extend`
  flex:1;
  justify-content:center;
  padding-bottom：10;
`;

class FinanceBuy extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '投资信息'
  });

  constructor(props) {
    super(props);
    const detail = this.props.detail;
    this.state = {
      money: '',
      min: detail && detail.minInvestMoney || 0,
      residueMoney: detail && detail.financeMoney && (detail.financeMoney - detail.investedMoney) || 0,
      code: '',
      pwd: '',
      bonusCount: 0,
      mode: 1,
      loading: false,
      enabled: true,
      second: '',
      sending: false,
      canSend: true,
      messageBox: {
        visible: false,
        content: '',
        button: null
      },
      success: {}
    };
    this.second = 59;
  }

  _showOptionModal(msg) {
    this.setState({
      messageBox: {
        visible: true,
        content: msg,
        button: {
          text: '确认',
          onPress: () => {
            this.setState({
              messageBox: {
                visible: false
              }
            }, () => {
              this.props.navigation.setParams({
                gesturesEnabled: true
              });
            });
          }
        }
      }
    }, () => {
      this.props.navigation.setParams({
        gesturesEnabled: false
      });
    });
  }

  _showOptionModal2(msg, onCancel, onConfirm) {
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
    }, () => {
      this.props.navigation.setParams({
        gesturesEnabled: false
      });
    });
  }

  _counter(count) {
    if (count < 0) {
      if (!isNaN(this.state.money) && this.state.money > 10000) {
        this.setState({
          bonusMoney: '',
          bonusId: '',
          bonusName: '',
          money: parseFloat(this.state.money) - 10000
        }, () => {
          this._getBonusList();
        });
      }
    } else {
      if (!isNaN(this.state.money)) {
        this.setState({
          bonusMoney: '',
          bonusId: '',
          bonusName: '',
          money: parseFloat(this.state.money || 0) + 10000
        }, () => {
          this._getBonusList();
        });
      }
    }
  }

  _submit() {
    if (!isNaN(this.state.money) && this.state.money > 0) {
      if (this.state.money < this.state.min) {
        this.context.callToast("起投金额最低" + this.state.min);
      } else if (this.state.money > this.props.userInfo.balance) {
        this._showOptionModal2('余额不足是否快捷支付？', () => {
          this.setState({messageBox: {visible: false}}, () => {
            this.props.navigation.setParams({
              gesturesEnabled: true
            });
          });
        }, () => {
          this.setState({messageBox: {visible: false}}, () => {
            this.props.navigation.setParams({
              gesturesEnabled: true
            });
            setTimeout(() => this.props.navigation.navigate("Recharge",{hideHeader:true}));
          });
        });
      } else {
        this.refs.modal.open();
        this.props.navigation.setParams({
          gesturesEnabled: false
        });
      }
    }
  }

  _sendCode() {
    if (!this.state.sending && this.state.canSend) {
      this.setState({sending: true});
      sendCode({mobile: this.props.userInfo.mobile, type: 4}).then(data => {
        if (data.data.code === 0) {
          this.context.callToast('验证码发送成功');
          this.setState({second: this.second, canSend: false, sending: false}, () => {
            this.interval = setInterval(() => {
              if (this.state.second <= 1) {
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

  _pay() {
    // dismissKeyboard();
    const {detail} = this.props;
    // if (!this.state.code) {
    //   this.context.callToast('请输入验证码');
    // } else
    if (!this.state.pwd) {
      this.context.callToast('请输入交易密码');
    } else {
      this.indicator.show();
      invest({
        fid: detail.id,
        investMoney: this.state.money,
        couponId: this.state.bonusId || '',
        code: this.state.code,
        tradingPassword: this.state.pwd,
        clientType: OS === "ios" ? 3 : 2
      }).then(data => {
        this.indicator.hide();
        if (data.data.code === 0) {
          this._closeModal();
          this.context.callToast('投资成功', true);
          this.props.userActions.userProfile(false);
          this.props.financeDetailActions.getData(false, false, this.props.detail.id);
          this.setState({mode: 2, success: data.data.data}, () => {
            this.props.navigation.setParams({
              title: "投资成功"
            });
          });
        } else {
          this._showOptionModal(data.data.msg, () => {
            this.props.navigation.setParams({
              gesturesEnabled: true
            });
          });
          // this.context.callToast(data.data.msg);
        }
      }).catch(() => {
        this.indicator.hide();
        this.context.callToast('提交失败');
      });
    }
  }

  _closeModal() {
    this.setState({code: '', pwd: ''}, () => {
      this.props.navigation.setParams({
        gesturesEnabled: true
      });
    });
    this.refs.modal.close();
  }

  _selectBonus(bonus) {
    const data = {
      bonusMoney: bonus.money,
      bonusType: bonus.type,
      bonusRate: bonus.rate,
      bonusId: bonus.id,
      bonusName: bonus.name
    };
    const {rate, deadLine} = this.props.detail;
    if (bonus.type && bonus.rate) {
      data.income = (this.state.money * (rate + bonus.rate) / 365) * parseInt(deadLine);
    } else {
      data.income = (this.state.money * rate / 365) * parseInt(deadLine);
    }
    this.setState(data);
  }

  _getBonusList() {
    if (!isNaN(this.state.money) && this.state.money >= this.state.min) {
      getBonusListForBuy({investMoney: this.state.money, fid: this.props.detail.id}).then(data => {
        if (data.data.code === 0) {
          let bonusList = data.data.data.memberCouponList;
          const cantList = data.data.data.notUseCouponList;
          cantList.map(item => item.cantUse = true);
          bonusList = bonusList.concat(cantList);
          this.setState({
            bonusCount: data.data.data.memberCouponList.length,
            bonusList,
            cantCount: cantList.length
          });
        } else {
          this.context.callToast(data.data.msg);
        }
      }).catch(() => {
        this.context.callToast('红包获取失败');
      });
    }
  }

  _buyAll() {
    if (this.state.min > this.props.userInfo.balance) {
      this.context.callToast('账户余额小于起投金额');
    } else {
      let money;
      if (this.state.min > this.props.userInfo.balance) {
        money = this.state.min;
      } else if (this.state.residueMoney < this.props.userInfo.balance) {
        money = this.state.residueMoney;
      } else {
        money = this.props.userInfo.balance;
      }
      this.setState({
        bonusMoney: '',
        bonusType: '',
        bonusRate: '',
        bonusId: '',
        cantCount:0,
        cantList:[],
        bonusList: [],
        bonusName: '',
        money: FloatFormatter(money),
        income: (money * this.props.detail.rate) / 365 * parseInt(this.props.detail.deadLine)
      }, () => {
        this._getBonusList();
      });
    }
  }

  _renderBuy() {
    const {navigate} = this.props.navigation;
    let {userInfo, detail} = this.props;
    const residueMoney = detail && detail.financeMoney && (detail.financeMoney - detail.investedMoney) || 0;
    if (residueMoney !== this.state.residueMoney) {
      this.setState({residueMoney});
    }
    const canTouch = (!isNaN(this.state.money) && this.state.money >= this.state.min) ? true : false;
    let desc = "暂无可用福利";
    if (this.state.bonusMoney && this.state.bonusType === 1) {
      desc = `${this.state.bonusMoney}元 ${this.state.bonusName}`;
    } else if (this.state.bonusRate && this.state.bonusType === 4) {
      desc = `${FloatFormatter(this.state.bonusRate && this.state.bonusRate * 100)}% ${this.state.bonusName}`;
    } else if (this.state.bonusCount > 0) {
      desc = `${this.state.bonusCount}个可用福利`;
    } else if (this.state.cantCount > 0) {
      desc = `${this.state.cantCount}个不可用福利`;
    }

    // console.log(this.state.money);
    // if (detail && detail.rate && !isNaN(this.state.money) && this.state.money > 0) {
    //   const income = (this.state.money * detail.rate) / 365 * parseInt(detail.deadLine);
    //   income !== this.state.income && this.setState({income});
    // }
    return (
      <InputView>
        <FlexView>
          <KeyboardAvoidingView behavior="position" style={{zIndex: 1, backgroundColor: "#F9F9F9"}}>
            <ItemView>
              <StyledText color="#333333">剩余可投 ： {FloatFormatter(this.state.residueMoney)}元</StyledText>
            </ItemView>
            <ItemView>
              <StyledText color="#333333">账户余额 ： {FloatFormatter(userInfo.balance)}元</StyledText>
              <Touchable onPress={() => navigate("Recharge")} style={{paddingHorizontal: 10}}>
                <StyledText color="#6195ff">充值</StyledText>
              </Touchable>
            </ItemView>
            <Container>
              <StyledText color="#333333">
                预期收益：
                <StyledText color="#FD8E5A">{FloatFormatter(this.state.income)}</StyledText>元
              </StyledText>
              <Input
                label="￥"
                value={this.state.money || 0}
                onChangeText={text => {
                  if (detail.rate && !isNaN(text) && text > 0) {
                    this.setState({
                      money: text,
                      bonusMoney: '',
                      bonusType: '',
                      bonusRate: '',
                      bonusId: '',
                      bonusName: '',
                      bonusCount: 0,
                      cantCount:0,
                      cantList:[],
                      bonusList: [],
                      income: (text * detail.rate) / 365 * parseInt(detail.deadLine)
                    }, () => {
                      this._getBonusList();
                    });
                  } else {
                    this.setState({money: text, income: 0});
                  }
                }}
                placeholder="请输入金额，100元起投"
                hideClear={true}
                keyboardType="numeric"
                textInputStyle={{
                  height: 30,
                  textAlign: 'center',
                  fontSize: !isNaN(this.state.money) && this.state.money !== '' ? 24 : 13,
                  color: '#ff8e53'
                }}
                textInputWrapper={{paddingRight: 12}}
                onClear={() => {
                  this.setState({money: ''})
                }}
                rightLabel={
                  <Touchable onPress={() => this._buyAll()}>
                    <StyledText color="#6195ff">余额全投</StyledText>
                  </Touchable>
                }
              />
            </Container>
            <GuideMenu
              style={{paddingHorizontal: 14, marginTop: 10}}
              titleStyle={{fontSize: 13}}
              title={'使用福利'}
              iconComment={desc}
              feedback={this.state.bonusCount > 0}
              onPress={() => {
                (this.state.bonusCount > 0 || this.state.cantCount > 0) && navigate("BonusList", {
                  title: "选择福利",
                  onSelect: this._selectBonus.bind(this),
                  list: this.state.bonusList,
                  selectedId: this.state.bonusId
                })
              }}/>
          </KeyboardAvoidingView>
          <CenterView>
            <StyledButtom top="45" radius='19' width="153" height="38" feedback={canTouch}
                        onPress={() => canTouch && this._submit()}>
              <StyledText size="14">确认</StyledText>
            </StyledButtom>
          </CenterView>
          <Content>
            {detail && detail.showActivityInvestInfoList && detail.showActivityInvestInfoList.length > 0 && imgs.qb2()}
            {
              detail && detail.showActivityInvestInfoList.map((item, i) => {
                const dom = [];
                const arr = item.split("@");
                dom.push(<StyledText key={`lb1${i}`} color="#999999">{arr[0]}</StyledText>);
                if (arr.length > 1) {
                  dom.push(<StyledText key={`lb2${i}`} color="#FCA834">{arr[1]}</StyledText>);
                  arr[2] && dom.push(<StyledText key={`lb3${i}`} color="#999999">{arr[2]}</StyledText>);
                }
                return <CenterRow key={i} style={{marginTop: 4, flexWrap: "wrap"}}>
                  {dom}
                </CenterRow>
              })
            }
          </Content>

          <Modal swipeToClose={false} backdropPressToClose={false} style={styles.modal}
                 position={"bottom"} ref="modal">
            <Bar>
              <Touchable onPress={() => this._closeModal()} style={{padding: 15}}>
                {imgs.close()}
              </Touchable>
              <StyledText size="16" color="#333333">投资确认</StyledText>
              <CenterView style={{width: 27}}/>
            </Bar>
            <PayView>
              <StyledText size="18" color="#333333">¥{FloatFormatter(this.state.money)}</StyledText>
              <InfoView>
                <StyledText color="#333333">支付方式</StyledText>
                <StyledText color="#333333">
                  余额支付（{userInfo.mobile && userInfo.mobile.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")}）
                </StyledText>
              </InfoView>
              <BorderInput
                label="交易密码"
                labelWidth={100}
                secureTextEntry={true}
                value={this.state.pwd}
                onChangeText={text => {
                  this.setState({pwd: text})
                }}
                placeholder="请输入交易密码"
                textInputStyle={{height: 40}}
                onClear={() => {
                  this.setState({pwd: ''})
                }}
              />
              <BDescView>
                <Touchable onPress={() => navigate("PayPasswordModify")}>
                  <StyledText color={colors.font.blue} size="12">忘记交易密码？</StyledText>
                </Touchable>
              </BDescView>
              <StyledButtom top="60" width="300" height="40" radius="8" onPress={() => this._pay()}>
                <StyledText size='14'>完成支付</StyledText>
              </StyledButtom>
            </PayView>
            <ActivityIndicatorModal2 height={WINDOW_HEIGHT - 180} ref={ref => this.indicator = ref}/>
          </Modal>
          <MessageBox
            visible={this.state.messageBox.visible}
            content={this.state.messageBox.content}
            button={this.state.messageBox.button}/>
        </FlexView>
      </InputView>
    );
  }

  _complete(type) {
    global.financeListoLoaded = false;
    global.userInfoLoaded = false;
    global.initRouter = "FinanceList";
    if (type === 1) {
      const navigateAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({routeName: 'Main'}),
        ]
      });
      this.props.navigation.dispatch(navigateAction);
    } else {
      const navigateAction = NavigationActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({routeName: 'Main'}),
          NavigationActions.navigate({routeName: 'CapitalList'})
        ]
      });
      this.props.navigation.dispatch(navigateAction);
    }
  }

  _renderSuccess() {
    return (
      <FlexView style={{backgroundColor: "#fff"}}>
        <SuccessContent>
          {imgs.operSuccess2({marginBottom: 18})}
          <StyledText color="#333333">您已成功投资【{this.state.success.title}】</StyledText>
          <StyledText color="#333333" top="10">
            投资本金
            <StyledText color="#FDA22D"> {FloatFormatter(this.state.success.investMoney)} </StyledText>
            元，预期收益
            <StyledText color="#FDA22D"> {FloatFormatter(this.state.success.interestMoney)} </StyledText>
            元</StyledText>
          <RowView>
            <StyledButtom color="#6295fd" height="33" radius="20" top="40" width="115"
                        style={{borderWidth: 1, borderColor: "#6295fd"}}
                        onPress={() => this._complete(1)}>
              <StyledText size="14">再投一笔</StyledText>
            </StyledButtom>
            <StyledButtom color="#fff" height="33" radius="20" top="40" width="115"
                        style={{borderWidth: 1, borderColor: "#6295fd", marginLeft: 30}}
                        onPress={() => this._complete(2)}>
              <StyledText size="14" color="#6295fd">查看详情</StyledText>
            </StyledButtom>
          </RowView>
        </SuccessContent>
        { this.state.success.showActivityInvestInfoList && this.state.success.showActivityInvestInfoList.length > 0 && this._renderBonus()}
      </FlexView>
    );
  }

  _renderBonus() {
    return <NormalView style={{backgroundColor: "#F9F9F9"}}>
      <Bg>
        <BonusView>
          {
            this.state.success.showActivityInvestInfoList.map((item, i) => {
              return <StyledText key={i} size="14" top="4">{item}</StyledText>
            })
          }
        </BonusView>
        <StyledButtom color="transparent" height="23" radius="4" top="6" width="76"
                    style={{borderWidth: 1, borderColor: "#fff"}}
                    onPress={() => this.props.navigation.navigate("BonusList")}>
          <StyledText>查看红包</StyledText>
        </StyledButtom>
      </Bg>
    </NormalView>
  }

  componentDidMount() {
    const {userActions, financeDetailActions,navigation} = this.props;
    userActions.userProfile(false);
    navigation.state.params && financeDetailActions.getData(false, false, navigation.state.params.id);
    // this._getBonusList();
  }

  shouldComponentUpdate(nextProps) {
    let params = this.props.navigation.state.params;
    let _params = nextProps.navigation.state.params;
    if (_params && (!params || params.gesturesEnabled != _params.gesturesEnabled)) {
      return false;
    } else {
      return true;
    }
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  render() {
    return this.state.mode === 1 ? this._renderBuy() : this._renderSuccess();
  }
}

FinanceBuy.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const userInfo = state.user.userInfo;
  const detail = state.financeDetail.detail;
  return {userInfo, detail};
};

const mapDispatchToProps = (dispatch) => {
  const userActions = bindActionCreators(userCreator, dispatch);
  const financeDetailActions = bindActionCreators(financeDetailCreator, dispatch);
  return {userActions, financeDetailActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(FinanceBuy);

const styles = StyleSheet.create({
  modal: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT - 180,
  }
});
import React, {Component} from 'react';
import styled from 'styled-components/native';
import imgs from '../resources/imgs';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';

import {
  ScrollLayout,
  StyledButtom,
  StyledText,
  CenterView,
  NormalView
} from '../components/UtilLib';
import formStyles from '../styles/formStyles';
import TextInputCustomized from '../components/TextInputCustomized';
import Touchable from "../components/Touchable";
import {WINDOW_WIDTH, OS} from '../config/constants';
import * as userCreator from '../actions/userActions';
import {sendCode, checkPhone, getImageCode, modifyPhone} from '../requests/http';

const Input = styled(TextInputCustomized)`
  border-bottom-color:#F6F6F6;
  border-bottom-width:1;
  padding-left:15;
`;
const LInputView = CenterView.extend`
  width:${WINDOW_WIDTH};
  margin-top:10;
  background-color:#fff;
`;
const RightButton = styled(Touchable)`
  width:100;
  height:38;
  align-items:center;
  justify-content:center;
`;
const ImageCode = styled.Image.attrs({
  resizeMode: "contain"
})`
  width:${28 * 3};
  height:28;
`;

class PhoneBind extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '更改手机号码'
  });

  constructor(props) {
    super(props);
    this.state = {
      mode: 2,
      second: '',
      loading: false,
      sending: false,
      canSend: true
    };
    this.second = 59;
    this.sending = false;
  }

  _getImageCode = () => {
    if (!this.sending) {
      this.sending = true;
      getImageCode().then(data => {
        this.sending = false;
        if (data.data.code === 0) {
          this.setState({
            codeUrl: "data:image/gif;base64," + data.data.data.picCode,
            ticketId: data.data.data.ticketId
          });
        } else {
          this.setState({loading: false});
          this.context.callToast(data.data.msg);
        }
      }).catch(() => {
        this.sending = false;
        this.setState({loading: false});
        this.context.callToast('提交失败');
      });
    }
  };

  _next = () => {
    if (!this.state.mobile) {
      this.context.callToast('请输入原手机号');
    } else if (!/^[1][345678][0-9]{9}$/.test(this.state.mobile)) {
      this.context.callToast('请输入正确的手机号');
    } else if (!this.state.imageCode) {
      this.context.callToast('请输入图形验证码');
    } else if (!this.state.code) {
      this.context.callToast('请输入短信验证码');
    } else {
      this.setState({loading: true});
      checkPhone({
        mobile: this.state.mobile,
        code: this.state.code
      }).then(data => {
        if (data.data.code === 0) {
          this.setState({
            mode: 2,
            mobile: '',
            imageCode: '',
            code: '',
            loading: false,
            sending: false,
            canSend: true,
            second: ''
          }, () => {
            this.interval && clearInterval(this.interval);
            this._getImageCode();
          });
        } else {
          this.setState({loading: false});
          this.context.callToast(data.data.msg);
        }
      }).catch(() => {
        this.setState({loading: false});
        this.context.callToast('提交失败');
      });
    }
  };

  _submit = () => {
    if (!this.state.mobile) {
      this.context.callToast('请输入新手机号');
    } else if (!/^[1][345678][0-9]{9}$/.test(this.state.mobile)) {
      this.context.callToast('请输入正确的手机号');
    } else if (!this.state.imageCode) {
      this.context.callToast('请输入图形验证码');
    } else if (!this.state.code) {
      this.context.callToast('请输入短信验证码');
    } else {
      this.setState({loading: true});
      modifyPhone({mobile: this.state.mobile, code: this.state.code}).then(data => {
        this.setState({loading: false});
        if (data.data.code === 0) {
          this.context.callToast('修改成功', true);
          setTimeout(() => {
            const navigateAction = NavigationActions.reset({
              index: 1,
              actions: [
                NavigationActions.navigate({routeName: 'Main'}),
                NavigationActions.navigate({routeName: 'Login'})
              ]
            });
            this.props.navigation.dispatch(navigateAction);
          }, 300);
        } else {
          this.context.callToast(data.data.msg);
        }
      }).catch(() => {
        this.setState({loading: false});
        this.context.callToast('提交失败');
      });
    }
  };

  _sendCode = () => {
    if (!this.state.mobile) {
      this.context.callToast(`请输入${this.state.mode === 1 ? "原" : "新"}手机号`);
    } else if (!/^[1][345678][0-9]{9}$/.test(this.state.mobile)) {
      this.context.callToast('请输入正确的手机号');
    } else if (!this.state.imageCode) {
      this.context.callToast('请输入图形验证码');
    } else {
      if (!this.state.sending && this.state.canSend) {
        this.setState({sending: true});
        sendCode({
          mobile: this.state.mobile,
          type: this.state.mode === 1 ? 9 : 10,
          ticketId: this.state.ticketId,
          picCode: this.state.imageCode,
          clientType: OS === "ios" ? 3 : 2
        }).then(data => {
          if (data.data.code === 0) {
            this.context.callToast('验证码发送成功');
            this._getImageCode();
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
            // this._getImageCode();
            this.setState({sending: false});
            this.context.callToast(data.data.msg);
          }
        }).catch(() => {
          this.setState({sending: false});
          this.context.callToast('发送失败');
        });
      }
    }
  };

  _renderOld() {
    return (
      <NormalView>
        <LInputView>
          <Input
            value={this.state.mobile}
            onChangeText={text => {
              this.setState({mobile: text})
            }}
            borderBottom
            keyboardType="numeric"
            placeholder="请输入原手机号"
            textInputStyle={{height: 44}}
            onClear={() => {
              this.setState({mobile: ''})
            }}
          />
          <Input
            value={this.state.imageCode}
            onChangeText={text => {
              this.setState({imageCode: text})
            }}
            borderBottom
            hideClear
            placeholder="请输入图形验证码"
            textInputWrapper={{paddingRight: 0}}
            textInputStyle={{height: 44}}
            onClear={() => {
              this.setState({imageCode: ''})
            }}
            flag={this.state.codeUrl}
            rightLabel={
              <RightButton onPress={this._getImageCode}>
                <ImageCode source={this.state.codeUrl && {uri: this.state.codeUrl}}/>
              </RightButton>
            }
          />
          <Input
            value={this.state.code}
            onChangeText={text => {
              this.setState({code: text})
            }}
            borderBottom
            hideClear
            placeholder="请输入手机验证码"
            textInputWrapper={{paddingRight: 0}}
            textInputStyle={{height: 44}}
            onClear={() => {
              this.setState({code: ''})
            }}
            flag={this.state.canSend + this.state.second + this.state.sending}
            rightLabel={
              <RightButton feedback={this.state.canSend && !this.state.sending} onPress={this._sendCode}>
                <StyledText color={(!this.state.canSend || this.state.sending) ? '#979797' : "#4FCAD2"}
                            height="24">{this.state.second ? `${this.state.second}S后重发` : '获取验证码'}</StyledText>
              </RightButton>
            }
          />
        </LInputView>
        <CenterView>
          <StyledButtom onPress={this._next} radius="5">
            <StyledText size="14">下一步</StyledText>
          </StyledButtom>
        </CenterView>
      </NormalView>
    );
  }

  _renderNew() {
    return (
      <NormalView>
        <LInputView>
          <Input
            icon={imgs.phoneshouji(formStyles.textInputIcon)}
            value={this.state.mobile}
            onChangeText={text => {
              this.setState({mobile: text})
            }}
            borderBottom
            keyboardType="numeric"
            placeholder="请输入新手机号"
            textInputStyle={{height: 38}}
            onClear={() => {
              this.setState({mobile: ''})
            }}
          />
          <Input
            icon={imgs.phoneanquan(formStyles.textInputIcon)}
            value={this.state.imageCode}
            onChangeText={text => {
              this.setState({imageCode: text})
            }}
            borderBottom
            hideClear
            placeholder="请输入图形验证码"
            textInputStyle={{height: 38}}
            onClear={() => {
              this.setState({imageCode: ''})
            }}
            flag={this.state.codeUrl}
            rightLabel={
              <RightButton onPress={this._getImageCode}>
                <ImageCode source={this.state.codeUrl && {uri: this.state.codeUrl}}/>
              </RightButton>
            }
          />
          <Input
            icon={imgs.phoneanquan(formStyles.textInputIcon)}
            value={this.state.code}
            onChangeText={text => {
              this.setState({code: text})
            }}
            borderBottom
            hideClear
            placeholder="请输入手机验证码"
            textInputWrapper={{paddingRight: 0}}
            textInputStyle={{height: 38}}
            onClear={() => {
              this.setState({code: ''})
            }}
            flag={this.state.canSend + this.state.second + this.state.sending}
            rightLabel={
              <RightButton feedback={this.state.canSend || this.state.sending} onPress={this._sendCode}>
                <StyledText color="#4FCAD2"
                            height="24">{this.state.second ? `${this.state.second}S后重发` : '获取验证码'}</StyledText>
              </RightButton>
            }
          />
        </LInputView>
        <CenterView>
          <StyledButtom onPress={this._submit} radius="5">
            <StyledText size="14">下一步</StyledText>
          </StyledButtom>
        </CenterView>
      </NormalView>
    );
  }

  componentDidMount() {
    this._getImageCode();
  }

  render() {
    return (
      <ScrollLayout color="transparent">
        <CenterView>
          {this.state.mode === 1 ? this._renderOld() : this._renderNew()}
        </CenterView>
      </ScrollLayout>
    )
  }

}
PhoneBind.contextTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PhoneBind);

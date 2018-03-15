import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as userCreator from '../actions/userActions';

import imgs from '../resources/imgs';
import TextInputCustomized from '../components/TextInputCustomized';
import {WINDOW_WIDTH, BORDER_WIDTH} from '../config/constants';

import {authenticate} from '../requests/http';
import {
  ActivityIndicatorModal,
  StyledText,
  StyledButtom,
  ScrollLayout,
  CenterView,
  NormalView
} from '../components/UtilLib';

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

class Authentication extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '实名认证',
    headerRight: navigation.state.params && navigation.state.params.headerRight
  });

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      card: '',
      mode: 1,
      loading: false
    };
  }

  _submit() {
    if (!this.state.name) {
      this.context.callToast('请输入姓名');
    } else if (!this.state.card) {
      this.context.callToast('请输入身份证号');
    } else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.state.card)) {
      this.context.callToast('身份证号格式有误');
    } else {
      this.setState({loading: true});
      authenticate({
        name: this.state.name,
        idCardNo: this.state.card
      }).then(res => {
        this.setState({loading: false});
        let data = res.data;
        if (0 === data.code) {
          this.props.userActions.userProfile(false);
          const {goBack} = this.props.navigation;
          this.setState({mode: 2}, () => {
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

  _renderAuth() {
    return (
      <NormalView>
        <LInputView>
          <Input
            label="持卡人"
            labelWidth={90}
            value={this.state.name}
            onChangeText={text => {
              this.setState({name: text})
            }}
            placeholder="请输入持卡人姓名"
            onClear={() => {
              this.setState({name: ''})
            }}
          />
          <Input
            label="身份证"
            labelWidth={90}
            value={this.state.card}
            onChangeText={text => {
              this.setState({card: text})
            }}
            placeholder="请输入持卡人对应身份证号"
            onClear={() => {
              this.setState({card: ''})
            }}
          />
          <ActivityIndicatorModal visible={this.state.loading}/>
        </LInputView>
        <CenterView>
          <StyledButtom onPress={this._submit.bind(this)} top="40" radius="5" width={WINDOW_WIDTH - 40} height="45">
            <StyledText size="17">确认</StyledText>
          </StyledButtom>
        </CenterView>
      </NormalView>
    );
  }

  _renderSuccess() {
    return (
      <CenterView style={{backgroundColor: "#fff", flex: 1, marginTop: 5}}>
        {imgs.operSuccess({margin: 18})}
        <StyledText color="#999999" align="center" lh="16">
          恭喜您实名认证成功{"\n"}
          前去绑定银行卡可获得投资资格
        </StyledText>
        {
          !this.props.check[1].checked && <StyledButtom onPress={() => this._toBankCardBind()}
                                                        top="40" radius="20" width="153" height="38">
            <StyledText size="14">绑定银行卡</StyledText>
          </StyledButtom>
        }
      </CenterView>
    );
  }

  _toBankCardBind() {
    global.backRouter = this.props.navigation.state.key;
    this.props.navigation.navigate("BankCardBind")
  }

  componentWillUnmount() {
    global.backRouter = '';
  }

  render() {
    return this.state.mode === 1 ?
      <ScrollLayout color="transparent">{this._renderAuth()}</ScrollLayout> : this._renderSuccess()
  }
}

Authentication.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const check = state.user.check;
  return {check};
};

const mapDispatchToProps = (dispatch) => {
  const userActions = bindActionCreators(userCreator, dispatch);
  return {userActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);
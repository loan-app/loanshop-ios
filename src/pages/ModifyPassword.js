import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import TextInputCustomized from '../components/TextInputCustomized';
import {WINDOW_WIDTH, BORDER_WIDTH} from '../config/constants';

import {modifyPassword} from '../requests/http';
import {loginUser as initUser} from '../requests/axios';
import {
  CenterView,
  ActivityIndicatorModal,
  StyledText,
  StyledButtom,
  ScrollLayout,
} from '../components/UtilLib';

const View = styled.View`
  background-color:#ffffff;
  margin-top:10;
  width:${WINDOW_WIDTH};
`;
const BorderInput = styled(TextInputCustomized)`
  border-bottom-color:#F6F6F6;
  border-bottom-width:1;
  padding-left:15;
`;
const LInputView = CenterView.extend`
  width:${WINDOW_WIDTH};
  margin-top:10;
  background-color:#fff;
`;
const DescView = styled.View`
  align-self:flex-start;
  margin-left:25;
  margin-top:10;
`;

class ModifyPassword extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '修改密码',
  });

  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      rePassword: '',
      loading: false
    };
  }

  _submit() {
    if (!this.state.oldPassword) {
      this.context.callToast('请输入原密码');
    } else if (!this.state.newPassword) {
      this.context.callToast('请输入新密码');
    } else if (!/^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,20}$/.test(this.state.newPassword)) {
      this.context.callToast('密码格式有误');
    } else if (!this.state.rePassword) {
      this.context.callToast('请输入确认密码');
    } else if (this.state.newPassword !== this.state.rePassword) {
      this.context.callToast('两次输入不一致');
    } else {
      this.setState({loading: true});
      modifyPassword({
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword
      }).then(res => {
        this.setState({loading: false});
        let data = res.data;
        if (0 === data.code) {
          this.context.callToast('密码修改成功', 'success');
          initUser(data.data.token);
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


  render() {
    return (
      <ScrollLayout color="transparent">
        <CenterView>
          <View>
            <BorderInput
              secureTextEntry={true}
              value={this.state.oldPassword}
              onChangeText={text => {
                this.setState({oldPassword: text})
              }}
              placeholder="请输入原密码"
              onClear={() => {
                this.setState({oldPassword: ''})
              }}
            />
            <BorderInput
              secureTextEntry={true}
              value={this.state.newPassword}
              onChangeText={text => {
                this.setState({newPassword: text})
              }}
              placeholder="请输入新密码"
              onClear={() => {
                this.setState({newPassword: ''})
              }}
            />
            <BorderInput
              secureTextEntry={true}
              value={this.state.rePassword}
              onChangeText={text => {
                this.setState({rePassword: text})
              }}
              placeholder="请输入确认密码"
              onClear={() => {
                this.setState({rePassword: ''})
              }}
            />
          </View>
          <DescView>
            <StyledText color="#9b9b9b">请使用6～20位由数字、字母组成的密码</StyledText>
          </DescView>
          <StyledButtom onPress={this._submit.bind(this)}>
            <StyledText size="17">确 定</StyledText>
          </StyledButtom>
        </CenterView>
        <ActivityIndicatorModal visible={this.state.loading}/>
      </ScrollLayout>
    );
  }
}

ModifyPassword.contextTypes = {
  callToast: PropTypes.func.isRequired
};

export default ModifyPassword;

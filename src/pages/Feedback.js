import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import {TextInput} from 'react-native';
import color from '../styles/color';
import TextInputCustomized from '../components/TextInputCustomized';
import {
  ScrollLayout,
  CenterView,
  StyledButtom,
  StyledText,
  ActivityIndicatorInlineBlock
} from '../components/UtilLib';

import {
  uploadFeedback
} from '../requests/http';

const InputView = styled.View`
  background-color:#fff;
  margin-top:10;
  padding-horizontal:15;
  padding-vertical:10;
`;

class Feedback extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '意见反馈',
  });

  constructor(props) {
    super(props);
    this.state = {
      feedbackText: '',
      mobile: '',
      loading: false
    };
  }

  _submit() {
    if (!this.state.feedbackText) {
      this.context.callToast('请输入问题描述');
    } else {
      uploadFeedback({
        content: this.state.feedbackText,
        mobile: this.state.mobile
      }).then(data => {
        this.setState({loading: false});
        if (data.data.code === 0) {
          this.context.callToast("提交成功", true);
          setTimeout(() => {
            this.props.navigation.goBack();
          }, 500);
        } else {
          this.context.callToast(data.data.msg);
        }
      }).catch(() => {
        this.setState({loading: false});
        this.context.callToast('提交失败');
      });
    }
  }

  render() {
    return (
      <ScrollLayout color="transparent">
        <InputView>
          <TextInput
            value={this.state.feedbackText}
            placeholderTextColor="#999999"
            style={{height: 100, paddingVertical: 5, fontSize: 14, color: color.black}}
            placeholder="请详细描述您的问题或建议，我们将及时跟进解决"
            underlineColorAndroid='transparent'
            multiline={true}
            onChangeText={text => {
              this.setState({feedbackText: text});
            }}/>
        </InputView>
        <InputView style={{paddingVertical: 0}}>
          <TextInputCustomized
            value={this.state.mobile}
            keyboardType="numeric"
            onChangeText={text => {
              this.setState({mobile: text})
            }}
            placeholder="手机号／邮箱（选填，方便我们联系您）"
            onClear={() => {
              this.setState({mobile: ''})
            }}
          />
        </InputView>
        <CenterView>
          <StyledButtom feedback={this.state.feedbackText ? true : false} height="38" radius="19"
                        color={this.state.feedbackText ? color.background.blue : '#dddddd'} top="40" width="153"
                        onPress={() => this.state.feedbackText && this._submit()}>
            <StyledText size="13">确定</StyledText>
          </StyledButtom>
        </CenterView>
        <ActivityIndicatorInlineBlock visible={this.state.loading}/>
      </ScrollLayout>
    );
  }
}

export default Feedback;

Feedback.contextTypes = {
  callToast: PropTypes.func.isRequired
};

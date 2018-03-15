import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import imgs from '../resources/imgs';
import color from '../styles/color';
import * as bankCardDetailCreator from '../actions/bankCardDetailActions';
import {
  ActivityIndicatorModal,
  StyledText,
  ScrollLayout,
  FlexView,
  HeaderButton,
  CenterView,
  CenterRow,
  NormalView
} from '../components/UtilLib';
import MessageBox from '../components/MessageBox';
import {WINDOW_WIDTH} from '../config/constants';

const CardView = CenterRow.extend`
  background-color:#fff; 
  border-radius:8px;
  width:${WINDOW_WIDTH - 40};
  margin-top:25;
  margin-horizontal:20;
  justify-content:center;
  padding-vertical:15;
`;


class BankCardDetail extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: '我的银行卡',
    headerRight: (
      <HeaderButton style={{width: 80}} onPress={() => navigation.state.params && navigation.state.params.rightTouch()}>
        <StyledText color={color.font.blue} size="14">更换卡</StyledText>
      </HeaderButton>
    )
  });

  constructor(props) {
    super(props);
    this.state = {
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

  componentDidMount() {
    this.props.bankCardDetailActions.getData(!this.props.bankCardDetail);
    this.props.navigation.setParams({
      rightTouch: () => this._showOptionModal(`1）未充值的用户更换银行卡请拨打客服热线；\n2）有余额和投资中的用户不予更换银行卡；\n其他情况请拨打客服热线400-871-3088`)
    });
  }

  render() {
    const {loading, detail} = this.props.bankCardDetail;
    return (
      <FlexView>
        <ScrollLayout color="transparent">
          {detail &&
          <CardView>
            {imgs.bankCard({marginRight:10})}
            <NormalView>
              <StyledText color="#333">{detail.bankName}</StyledText>
              <StyledText top="15" color="#333">
                {`＊＊＊＊  ＊＊＊＊  ＊＊＊＊  `}{detail.number.substr(-4)}
              </StyledText>
            </NormalView>
          </CardView>
          }
        </ScrollLayout>
        <ActivityIndicatorModal visible={loading}/>
        <MessageBox
          style={{height: 190}}
          boxStyle={{height: 145}}
          contentStyle={{textAlign: "left"}}
          visible={this.state.messageBox.visible}
          content={this.state.messageBox.content}
          button={this.state.messageBox.button}/>
      </FlexView>
    );
  }
}

BankCardDetail.contextTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(BankCardDetail);
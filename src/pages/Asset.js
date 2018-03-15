import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as userCreator from '../actions/userActions';

import color from '../styles/color';
import {
  ActivityIndicatorModal,
  StyledText,
  BetweenView,
  ScrollLayout,
  CenterView,
  RowView,
  IconView
} from '../components/UtilLib';

import {WINDOW_WIDTH, BORDER_WIDTH} from '../config/constants';
import colors from '../styles/color';
import Pie from '../components/Pie';
import FloatFormatter from '../utils/Float';

const Container = CenterView.extend`
  margin-top:10;
  padding-vertical:30;
  background-color:#ffffff;
`;
const ChartView = styled.View``;
const MoneyView = CenterView.extend`
  position:absolute;
  top:10;
  left:0;
  height:200;
  width:167;
  justify-content:center;
`;
const BottomView = styled.View`
  background-color:#ffffff;
  padding-left:16;
  margin-top:13;
`;
const ItemView = BetweenView.extend.attrs({
  border: props => props.border ? BORDER_WIDTH : 0,
  pleft: props => props.pleft || 0
})`
  border-bottom-width:${props => props.border};
  border-bottom-color:#eeeeee;
  padding-vertical:${props => props.pleft ? 5 : 10};
  padding-right:15;
  padding-left:${props => props.pleft};
`;

class Asset extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '总资产'
  });

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {userActions, user} = this.props;
    userActions.userProfile(user.userInfo.mobile ? false : true);
  }

  render() {
    let {loading, userInfo} = this.props.user;
    let arr;
    if (userInfo.totleProperty > 0) {
      arr = [userInfo.freeze / userInfo.totleProperty * 100,
        userInfo.balance / userInfo.totleProperty * 100,
        (userInfo.receivableInvestMoney + userInfo.receivableInterestMoney) / userInfo.totleProperty * 100];
    }
    return (
      <ScrollLayout color="transparent">
        <ActivityIndicatorModal visible={loading}/>
        {
          arr ? <Container>
            <ChartView>
              <Pie
                radius={84}
                series={arr}
                colors={['#73ACFC', '#ff6262', '#ffb846']}/>
              <MoneyView>
                <StyledText size="16" height="30">{FloatFormatter(userInfo.totleProperty)}</StyledText>
                <StyledText>总资产(元)</StyledText>
              </MoneyView>
            </ChartView>
          </Container> : null
        }
        <BottomView>
          <ItemView border>
            <RowView>
              <IconView text="￥" color="#ff6262"/>
              <StyledText color="#333333"> 账户余额</StyledText>
            </RowView>
            <StyledText color="#333333">{FloatFormatter(userInfo.balance)}</StyledText>
          </ItemView>
          <ItemView>
            <RowView>
              <IconView text="代" color="#ffb846"/>
              <StyledText color="#333333"> 待收总额</StyledText>
            </RowView>
            <StyledText color="#333333">
              {FloatFormatter((userInfo.receivableInvestMoney || 0) + (userInfo.receivableInterestMoney || 0))}
            </StyledText>
          </ItemView>
          <ItemView pleft={35}>
            <StyledText color="#333333"> 待收本金</StyledText>
            <StyledText color="#333333">{FloatFormatter(userInfo.receivableInvestMoney)}</StyledText>
          </ItemView>
          <ItemView pleft={35} border>
            <StyledText color="#333333"> 待收收益</StyledText>
            <StyledText color="#333333">{FloatFormatter(userInfo.receivableInterestMoney)}</StyledText>
          </ItemView>
          <ItemView>
            <RowView>
              <IconView text="冻" color="#73ACFC"/>
              <StyledText color="#333333"> 冻结资金</StyledText>
            </RowView>
            <StyledText color="#333333">{FloatFormatter(userInfo.freeze)}</StyledText>
          </ItemView>
        </BottomView>
      </ScrollLayout>
    )
  }

}

Asset.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const {user} = state;
  return {user};
};

const mapDispatchToProps = (dispatch) => {
  const userActions = bindActionCreators(userCreator, dispatch);
  return {userActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(Asset);
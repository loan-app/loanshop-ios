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

class Income extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '累计收益'
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {userActions, user} = this.props;
    userActions.userProfile(user.userInfo.mobile ? false : true);
  }

  render() {
    let {loading, userInfo} = this.props.user;
    let arr;
    if (userInfo.total > 0) {
      arr = [
        userInfo.totleInterestMoney / userInfo.total * 100,
        userInfo.redPacketMoney / userInfo.total * 100,
        userInfo.inviteRewards / userInfo.total * 100,
        userInfo.platformRewards / userInfo.total * 100
      ];
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
                colors={['#73ACFC', '#ff6262', '#ffb846', '#6ad1ff']}/>
              <MoneyView>
                <StyledText size="16" height="30">{userInfo.total || '0.00'}</StyledText>
                <StyledText>累计收益(元)</StyledText>
              </MoneyView>
            </ChartView>
          </Container> : null
        }
        <BottomView>
          <ItemView border>
            <RowView>
              <IconView text="红" color="#ff6262"/>
              <StyledText color="#333333"> 红包收益</StyledText>
            </RowView>
            <StyledText color="#333333">{FloatFormatter(userInfo.redPacketMoney)}</StyledText>
          </ItemView>
          <ItemView border>
            <RowView>
              <IconView text="邀" color="#ffb846"/>
              <StyledText color="#333333"> 邀请奖励</StyledText>
            </RowView>
            <StyledText color="#333333">{FloatFormatter(userInfo.inviteRewards)}</StyledText>
          </ItemView>
          <ItemView border>
            <RowView>
              <IconView text="奖" color="#6ad1ff"/>
              <StyledText color="#333333"> 平台奖励</StyledText>
            </RowView>
            <StyledText color="#333333">{FloatFormatter(userInfo.platformRewards)}</StyledText>
          </ItemView>
          <ItemView>
            <RowView>
              <IconView text="投" color="#73ACFC"/>
              <StyledText color="#333333"> 投资收益</StyledText>
            </RowView>
            <StyledText color="#333333">{FloatFormatter(userInfo.totleInterestMoney)}</StyledText>
          </ItemView>
        </BottomView>
      </ScrollLayout>
    )
  }

}

Income.contextTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Income);
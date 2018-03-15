import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import styled from 'styled-components/native';

import {
  ActivityIndicatorModal,
  StyledText,
  ScrollLayout,
  BetweenView,
} from '../components/UtilLib';
import Touchable from '../components/Touchable';
import color from '../styles/color';
import {BORDER_WIDTH, WINDOW_WIDTH} from '../config/constants';

const FilterView = styled(Touchable).attrs({
  color: props => props.color || '#ffffff'
})`
  width:${WINDOW_WIDTH / 2};
  height:40;
  justify-content:center;
  align-items:center;
  background-color:#fff;
  border-bottom-width:2;
  margin-top:10;
  border-color:${props => props.color};
`;
const ItemView = BetweenView.extend`
  padding-horizontal:20;
  background-color:#fff;
  border-bottom-width:${BORDER_WIDTH};
  border-bottom-color:#eeeeee;
  padding-vertical:6;
`;

export default class ExperienceDetail extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '体验金明细'
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      type: 1
    };
  }

  _changeType(type) {
    this.state.type !== type && this.setState({type: type}, () => {

    });
  }

  componentDidMount() {
  }

  render() {
    return (
      <ScrollLayout color="transparent">
        <BetweenView>
          <FilterView color={this.state.type === 1 && color.font.blue} onPress={this._changeType.bind(this, 1)}>
            <StyledText size="14" color={this.state.type === 1 ? color.font.blue : '#999999'}>生效中</StyledText>
          </FilterView>
          <FilterView color={this.state.type === 2 && color.font.blue} onPress={this._changeType.bind(this, 2)}>
            <StyledText size="14" color={this.state.type === 2 ? color.font.blue : '#999999'}>已过期</StyledText>
          </FilterView>
        </BetweenView>
        {
          [1, 2].map((item, i) => {
            return (
              <ItemView key={i}>
                <StyledText color='#333333'>注册赠送体验金</StyledText>
                <StyledText color='#999999'>
                  时间xxxxx-生效{`\n`}
                  时间yYYYY过期
                </StyledText>
                <StyledText color='#333333'>100.00</StyledText>
              </ItemView>
            )
          })
        }
        <ActivityIndicatorModal visible={this.state.loading}/>
      </ScrollLayout>
    );
  }

}

ExperienceDetail.contextTypes = {
  callToast: PropTypes.func.isRequired
};
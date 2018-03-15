import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  View
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled from 'styled-components/native';

import imgs from '../resources/imgs';
import {
  ActivityIndicatorModal,
  FlexView,
  StyledText,
  CenterView,
  NoData,
  BetweenView,
  Footer,
  IconView,
  RowView,
  NormalView,
  StyledButtom,
  CenterRow
} from '../components/UtilLib';
import Touchable from '../components/Touchable';
import color from '../styles/color';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../config/constants';

import * as capitalListCreator from '../actions/capitalListActions';
import * as userCreator from '../actions/userActions';
import FloatFormatter from '../utils/Float';
import {NavigationActions} from 'react-navigation';

const FilterView2 = styled(Touchable)`
  width:${WINDOW_WIDTH / 2};
  height:44;
  justify-content:center;
  align-items:center;
`;
const Line = styled.View.attrs({
  color: props => props.color || '#F7F7F7'
})`
  height:3;
  width:16;
  border-radius:1;
  background-color:${props => props.color};
  margin-top:4;
`;
const ItemView = CenterView.extend`
  padding-vertical:15;
  width:${props => WINDOW_WIDTH * props.rate};
  background-color:#fff;
`;
const ItemView2 = CenterView.extend`
  padding-vertical:10;
  width:${props => WINDOW_WIDTH * props.rate};
  background-color:#fff;
`;
const InnerView = RowView.extend`
  padding-left:20;
  padding-right:26;
  padding-vertical:15;
`;
const TextView = BetweenView.extend`
  padding-top:4;
`;
const CarIcon = styled.Image.attrs({
  resizeMode: 'center'
})`
  width:18;
  height:18;
  margin-right:5;
`;

let page = 1;
class CapitalList extends Component {

  static navigationOptions = {
    title: '我的投资'
  };

  constructor(props) {
    super(props);
    this.state = {
      type: 1
    };
  }

  _changeType(type) {
    this.state.type !== type && this.setState({type: type}, () => {
      page = 1;
      this.props.capitalListActions.getData(false, false, false, type);
    });
  }

  _renderItems(item) {
    return (
      <RowView>
        <ItemView rate={0.27}>
          <StyledText color="#333333">{item.estimatePayAt}</StyledText>
        </ItemView>
        <ItemView rate={0.19}>
          <StyledText color="#333333">{item.deadline}天</StyledText>
        </ItemView>
        <ItemView rate={0.27}>
          <StyledText color="#FDA874" size="16">
            {FloatFormatter(item.interestMoney)}
            <StyledText color="#333333">元</StyledText>
          </StyledText>
        </ItemView>
        <ItemView rate={0.27}>
          <StyledText color="#333333" size="16">
            {FloatFormatter(item.investMoney)}
            <StyledText color="#333333">元</StyledText>
          </StyledText>
        </ItemView>
      </RowView>
    );
  }

  _onEndReached() {
    let {isLoadMore, noMore} = this.props.capitalList;
    if (!isLoadMore && !noMore) {
      const {capitalListActions} = this.props;
      capitalListActions.getData(false, true, false, this.state.type, ++page);
    } else {
      console.log("cd-----");
    }
  }

  _complete() {
    const {goBack, navigate} = this.props.navigation;
    global.financeListoLoaded = false;
    global.userInfoLoaded = false;
    global.initRouter = "FinanceList";
    const navigateAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'Main'}),
      ]
    });
    this.props.navigation.dispatch(navigateAction);
  }

  _renderNoData(visible) {
    if (visible) {
      return <CenterView style={{marginTop: WINDOW_HEIGHT / 3 - 40}}>
        <StyledText color="#999999">暂无项目记录，快去投资赚钱吧！</StyledText>
        {/*<StyledButtom color="transparent" height="35" radius="20" top="30" width="118"*/}
        {/*style={{borderWidth: 1, borderColor: "#6295fd"}}*/}
        {/*onPress={() => this._complete()}>*/}
        {/*<StyledText size="14" color="#6295fd">去投资</StyledText>*/}
        {/*</StyledButtom>*/}
      </CenterView>
    } else {
      return null;
    }
  }

  componentDidMount() {
    page = 1;
    const {capitalListActions} = this.props;
    capitalListActions.getData(false, false, true, this.state.type, page);
  }

  render() {
    const {loading, list, noMore, isLoadMore} = this.props.capitalList;
    const {userInfo} = this.props;
    return (
      <FlexView>
        <BetweenView>
          <FilterView2 onPress={this._changeType.bind(this, 1)}>
            <StyledText size="16" color={this.state.type === 1 ? "#3990FA" : "#4A4A4A"}>待还款</StyledText>
            <Line color={this.state.type === 1 && "#3990FA"}/>
          </FilterView2>
          <FilterView2 color={this.state.type === 2 && "#F4F4F4"}
                       onPress={this._changeType.bind(this, 2)}>
            <StyledText size="16" color={this.state.type === 2 ? "#3990FA" : "#4A4A4A"}>已还款</StyledText>
            <Line color={this.state.type === 2 && "#3990FA"}/>
          </FilterView2>
        </BetweenView>
        <RowView>
          <ItemView2 rate={0.27}>
            <StyledText color="#999999">还款日期</StyledText>
          </ItemView2>
          <ItemView2 rate={0.19}>
            <StyledText color="#999999">期限</StyledText>
          </ItemView2>
          <ItemView2 rate={0.27}>
            <StyledText color="#999999">预期收益</StyledText>
          </ItemView2>
          <ItemView2 rate={0.27}>
            <StyledText color="#999999">投资本金</StyledText>
          </ItemView2>
        </RowView>
        <FlatList data={list} initialNumToRender={20}
                  getItemLayout={(data, index) => ( {length: 94, offset: 94 * index, index} )}
                  renderItem={(item) => this._renderItems(item.item)}
                  onEndReached={() => this._onEndReached()}
                  ListEmptyComponent={() => this._renderNoData(!loading)}
                  onEndReachedThreshold={0.2}
                  keyExtractor={(item, index) => index}
                  ListFooterComponent={() => <Footer visible={!noMore && isLoadMore}/>}/>
        <ActivityIndicatorModal visible={loading}/>
      </FlexView>
    )
      ;
  }

}

CapitalList.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const {capitalList, user} = state;
  const {userInfo} = state.user;
  return {capitalList, userInfo};
};

const mapDispatchToProps = (dispatch) => {
  const capitalListActions = bindActionCreators(capitalListCreator, dispatch);
  const userActions = bindActionCreators(userCreator, dispatch);
  return {capitalListActions, userActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(CapitalList);
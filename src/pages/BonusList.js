import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled from 'styled-components/native';

import imgs from '../resources/imgs';
import {
  ActivityIndicatorModal,
  StyledText,
  FlexView,
  NoData,
  BetweenView,
  Footer,
  MiddleView,
  CenterRow,
  NormalView,
  CenterView
} from '../components/UtilLib';
import Touchable from '../components/Touchable';
import color from '../styles/color';
import {WINDOW_WIDTH, BORDER_WIDTH} from '../config/constants';
import {createApiUrl} from '../requests/http';

import * as bonusListCreator from '../actions/bonusListActions';
import FloatFormatter from '../utils/Float';

const width = WINDOW_WIDTH - 10;
const FilterView2 = styled(Touchable)`
  width:${WINDOW_WIDTH / 2};
  height:44;
  justify-content:center;
  align-items:center;
`;
const FilterView = styled(Touchable).attrs({
  color: props => props.color || '#ffffff'
})`
  width:${WINDOW_WIDTH / 3};
  height:40;
  justify-content:center;
  align-items:center;
  background-color:#fff;
  border-bottom-width:1;
  border-color:${props => props.color};
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
  margin-bottom:15;
`;
const RightButton = styled(Touchable)`
  padding-horizontal:16;
  flex-direction:row;
  justify-content:center;
  align-items:center;
`;
const BonusImage = styled.ImageBackground.attrs({
  resizeMode: 'stretch'
})`
  height:${width * 0.44};
  width:${width};
  flex-direction:row;
  padding-vertical:30;
  padding-horizontal:14;
`;

const bonusJxq = require("../resources/imgs/discount.png");
const bonusHb = require("../resources/imgs/discount.png");
const bonusJxqUsed = require("../resources/imgs/discount.png");
const bonusHbUsed = require("../resources/imgs/discount.png");
const over = require("../resources/imgs/discount.png");

let pageArr = {};
class BonusList extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '我的福利',
    headerRight: (
      <RightButton onPress={() => navigation.navigate("WebView", {url: createApiUrl("/user/h5/coupon-rule")})}>
        <StyledText size="16">使用说明</StyledText>
      </RightButton>
    )
  });

  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.state = {
      type: "0",
      list: null,
      onSelect: params && params.onSelect,
      selectedId: params && params.selectedId
    }
  }

  _changeType2(type) {
    if (this.props.ctype !== type) {
      pageArr[type] = 1;
      this.props.bonusListActions.getData(false, false, true, type, this.state.type, 1);
    }
  }

  _changeType(type) {
    const ctype = this.props.ctype;
    this.state.type !== type && this.setState({type: type}, () => {
      pageArr[ctype] = 1;
      this.props.bonusListActions.getData(false, false, true, this.props.ctype, type, pageArr[ctype]);
    });
  }

  _selectBonus(item) {
    const {state, goBack} = this.props.navigation;
    if (state.params && state.params.onSelect && !item.cantUse) {
      if (item.id === this.state.selectedId) {
        this.setState({selectedId: ''}, () => state.params.onSelect({money: '', rate: '', name: '', id: ''}));
        return;
      }
      state.params.onSelect({type: item.type, money: item.money, rate: item.rate, name: item.name, id: item.id});
      goBack();
    }
  }

  _renderItems(item) {
    let bonusImg;
    let right;
    let color = "#FC924D";
    let color2 = "#999999";
    let color3 = "#333333";
    // let tip;
    if (item.isUse) {
      bonusImg = item.type === 1 ? bonusHbUsed : bonusJxqUsed;
      right = <StyledText color={color} lh="18" size="16">已使用</StyledText>
    } else if (item.isOverdue === 2) {
      bonusImg = over;
      color = "#BBBBBB";
      right = <StyledText color={color} lh="18" size="16">已过期</StyledText>
    } else {
      if (item.cantUse) {
        bonusImg = over;
        color = "#BBBBBB";
        // tip = imgs.tip2({marginRight: 6, width: 14, height: 14});
      } else {
        bonusImg = item.type === 1 ? bonusHb : bonusJxq;
        if (this.state.onSelect) {
          if (item.id === this.state.selectedId) {
            right = imgs.checked({width: 24, height: 24});
          } else {
            right = imgs.unchecked({width: 24, height: 24});
          }
        } else {
          right = (<Touchable onPress={() => {
            DeviceEventEmitter.emit('navigateTab', "FinanceList");
            this.props.navigation.goBack();
          }}>
            <StyledText color={color} lh="18" size="16" style={{width: 16}}>立即使用</StyledText>
          </Touchable>);
        }
      }
    }
    let text;
    if (item.type === 4) {
      text = `${FloatFormatter(item.rate && item.rate * 100)}%`;
    } else {
      text = `￥${item.money}`;
    }
    let moneyText;
    let deadText;
    if (item.minInvestMoney > 0 && item.maxInvestMoney > 0) {
      moneyText = `投资${item.minInvestMoney}~${item.maxInvestMoney}元可用`;
    } else if (item.minInvestMoney > 0) {
      moneyText = `投资${item.minInvestMoney}元以上可用`;
    } else if (item.maxInvestMoney > 0) {
      moneyText = `投资${item.minInvestMoney}元以下可用`;
    } else {
      moneyText = '无投资金额限制';
    }
    if (item.minDeadline > 0 && item.maxDeadline > 0) {
      deadText = `投资${item.minDeadline}~${item.maxDeadline}${item.deadlineType}标可用`;
    } else if (item.minDeadline > 0) {
      deadText = `投资${item.minDeadline}${item.deadlineType}以上标可用`;
    } else if (item.maxDeadline > 0) {
      deadText = `投资${item.minDeadline}${item.deadlineType}以下标可用`;
    } else {
      deadText = '无标期限制';
    }
    return (
      <Touchable onPress={this._selectBonus.bind(this, item)}
                 feedback={this.state.onSelect && !item.cantUse ? true : false}>
        <ItemView>
          <BonusImage source={bonusImg}>
            <MiddleView width={0.2 * width}>
              <StyledText color={color} size="22">{text}</StyledText>
            </MiddleView>
            <MiddleView width={0.5 * width}>
              <NormalView style={{justifyContent: "space-between", flex: 1}}>
                <NormalView>
                  <StyledText color={color3} size="15">{item.name}</StyledText>
                  {/*<CenterRow>*/}
                  {/*{tip}*/}
                  <StyledText color={color3} size="15" top="8">
                    {moneyText}
                  </StyledText>
                </NormalView>
                <NormalView>
                  {/*</CenterRow>*/}
                  <StyledText color={color2} size="15">
                    {deadText}
                  </StyledText>
                  <StyledText color={color2} size="12">有效期至{item.endAt}</StyledText>
                </NormalView>
              </NormalView>
            </MiddleView>
            <MiddleView width={0.2 * width}>
              {right}
            </MiddleView>
          </BonusImage>
        </ItemView>
      </Touchable>
    );
  }

  _loadMore() {
    this.props.bonusListActions.getData(false, true, false, this.state.type, 1, true);
  }

  _renderFooter() {
    const {loading, list, isLoadMore, noMore} = this.props.bonusList;
    // if (!isLoadMore && !loading) {
    //   return (
    //     <FooterView>
    //       {list.length > 0 && <StyledText color="#999999">已无更多可用红包</StyledText>}
    //       {!this.state.onSelect && !noMore && <MoreButton onPress={() => this._loadMore()}>
    //         <StyledText color="#6295fd">查看已失效红包</StyledText>
    //       </MoreButton>}
    //     </FooterView>
    //   );
    // } else {
    return <Footer visible={isLoadMore && !loading}/>;
    // }
  }

  componentDidMount() {
    const {params} = this.props.navigation.state;
    if (params && params.onSelect) {
      this.setState({list: params.list});
    } else {
      const {bonusListActions, bonusList, ctype} = this.props;
      pageArr[ctype] = 1;
      const loading = !bonusList[ctype].list || bonusList[ctype].list.length === 0;
      bonusListActions.getData(false, false, loading, this.props.ctype, this.state.type, pageArr[ctype]);
    }
  }

  render() {
    const ctype = this.props.ctype;
    let {loading, list} = this.props.bonusList[ctype];
    this.state.list && (list = this.state.list);
    const text = ctype === "1" ? "红包" : (ctype === "4" ? "加息券" : "优惠");
    return (
      <FlexView>
        {
          this.state.list ? null : (
            <NormalView>
              <BetweenView>
                <FilterView2 onPress={this._changeType2.bind(this, "1")}>
                  <StyledText size="16" color={this.props.ctype === "1" ? "#3990FA" : "#4A4A4A"}>红包</StyledText>
                  <Line color={this.props.ctype === "1" && "#3990FA"}/>
                </FilterView2>
                <FilterView2 color={this.props.ctype === "4" && "#F4F4F4"}
                             onPress={this._changeType2.bind(this, "4")}>
                  <StyledText size="16" color={this.props.ctype === "4" ? "#3990FA" : "#4A4A4A"}>加息券</StyledText>
                  <Line color={this.props.ctype === "4" && "#3990FA"}/>
                </FilterView2>
              </BetweenView>
              {/*<BetweenView>*/}
              {/*<FilterView color={this.state.type === "0" && color.font.blue}*/}
              {/*onPress={this._changeType.bind(this, "0")}>*/}
              {/*<StyledText size="14" color={this.state.type === "0" ? color.font.blue : '#999999'}>可用</StyledText>*/}
              {/*</FilterView>*/}
              {/*<FilterView color={this.state.type === "1" && color.font.blue}*/}
              {/*onPress={this._changeType.bind(this, "1")}>*/}
              {/*<StyledText size="14" color={this.state.type === "1" ? color.font.blue : '#999999'}>已使用</StyledText>*/}
              {/*</FilterView>*/}
              {/*<FilterView color={this.state.type === "2" && color.font.blue}*/}
              {/*onPress={this._changeType.bind(this, "2")}>*/}
              {/*<StyledText size="14" color={this.state.type === "2" ? color.font.blue : '#999999'}>已过期</StyledText>*/}
              {/*</FilterView>*/}
              {/*</BetweenView>*/}
            </NormalView>
          )
        }
        <FlatList data={list} initialNumToRender={5}
                  renderItem={(item) => this._renderItems(item.item)}
                  ListEmptyComponent={() => <NoData visible={!loading} text={"暂无" + text}/>}
                  keyExtractor={(item, index) => index}
                  ListFooterComponent={() => this._renderFooter()}/>
        <ActivityIndicatorModal visible={loading}/>
      </FlexView>
    );
  }

}

BonusList.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const {bonusList} = state;
  const ctype = bonusList.ctype;
  return {bonusList, ctype};
};

const mapDispatchToProps = (dispatch) => {
  const bonusListActions = bindActionCreators(bonusListCreator, dispatch);
  return {bonusListActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(BonusList);
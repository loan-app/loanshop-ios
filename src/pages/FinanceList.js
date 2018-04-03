import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  View,
  RefreshControl
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled from 'styled-components/native';

import imgs from '../resources/imgs';
import Touchable from '../components/Touchable';
import {
  ActivityIndicatorModal,
  FlexView,
  StyledText,
  NoData,
  CenterView,
  BetweenView,
  Footer,
  IconView,
  Header,
  CenterRow,
  NormalView
} from '../components/UtilLib';
import {WINDOW_WIDTH, BORDER_WIDTH} from '../config/constants';
import FloatFormatter from '../utils/Float';
import {createApiUrl} from '../requests/http';

import * as financeListCreator from '../actions/financeListActions';
import * as workingTableCreator from '../actions/workingTableActions';

const progressWidth = WINDOW_WIDTH - 145;
const ItemView = styled(Touchable)`
  background-color:#ffffff;
  margin-top:10;
`;
const TitleView = styled.View`
  flex-direction:row;
  align-items:center;
  padding-bottom:4;
  margin-left:10;
  height:50;
`;
const FooterView = styled.View`
  margin-vertical:10;
  flex-direction:row;
  justify-content:center;
`;
const ProgressContainer = CenterRow.extend`
  align-items:center;
  justify-content:center;
  height:40;
`;
const ProgressBg = styled.View`
  background-color: #EEEEEE;
  width:${progressWidth};
  height:2;
  border-radius:1;
`;
const ProgressView = styled.View.attrs({
  progress: props => props.progress || 0,
})`
  height:2;
  border-radius:1;
  background-color:#2E8CFB;
  width:${props => props.progress * progressWidth};
`;
const ProgressText = StyledText.extend.attrs({
  size: 12,
  height: 12,
  bottom: 1
})`
  margin-left:10;
`;
const MiddleView = BetweenView.extend`
`;
const BlankView = styled.View`
  height:40;
`;
const Type = CenterView.extend`
  padding-vertical:4;
  width:56;
  background-color:#FC9657;
  position:absolute;
  right:0;
  top:0;
`;
const ColumnView = CenterView.extend`
  border-right-width:1;
  border-color:#eeeeee;
  width:${WINDOW_WIDTH / 3};
  padding-left:2;
  margin-top:6;
  justify-content:center;
`;
const AdsView = styled(Touchable)`
`;
const AdsImage = styled.Image`
  height:${WINDOW_WIDTH * 0.26};
  width:${WINDOW_WIDTH};
`;

let page = 1;
const types = ["新手专享", "超短项目", "爆款项目", "精选项目", "体验项目"];
class FinanceList extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    // headerRight: <RowView/>,
    // headerLeft: (
    //   <HeaderButton onPress={() => navigation.navigate("MessageList")}>
    //     {imgs.message()}
    //   </HeaderButton>
    // ),
    title: '项目列表',
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderItems(item) {
    const bcolor = (!item.isEnd ? "#ffa30f" : "#999999");
    const ycolor = (!item.isEnd ? "#6295fd" : "#999999");
    const textcolor = (!item.isEnd ? "#333333" : "#999999");
    const ncolor = (!item.isEnd ? "#F1BE64" : "#999999");
    const progress = item.investedMoney / item.financeMoney;
    let investedProgress;
    if (progress < 0.9) {
      investedProgress = Math.ceil(progress * 100);
    } else {
      investedProgress = Math.floor(progress * 100);
    }
    let residueMoney = item.financeMoney - item.investedMoney;
    let str;
    if (residueMoney > 100) {
      residueMoney = residueMoney / 10000;
      str = "万元";
    } else {
      str = "元";
    }
    (residueMoney + "").indexOf(".") > -1 && (residueMoney = residueMoney.toFixed(2));
    return (
      <ItemView onPress={() => this.props.navigation.navigate("FinanceDetail", {id: item.id})}>
        <TitleView>
          <StyledText color="#333333" size="16">{item.title}</StyledText>
          {item.isGuarantee ? <IconView text="担保" color={bcolor}/> : null}
          {item.financeGoodsId ? <IconView text="抵押" color={ycolor}/> : null}
        </TitleView>
        <MiddleView>
          <ColumnView>
            <NormalView style={{alignItems: 'flex-end'}}>
              <StyledText size="26" color={ncolor}>{FloatFormatter(item.rate * 100)}%</StyledText>
              <StyledText size="12" color="#999999" top="10">预期年化</StyledText>
            </NormalView>
          </ColumnView>
          <ColumnView>
            <NormalView style={{alignItems: 'flex-end'}}>
              <StyledText size="26" color={ncolor}>{item.deadLine.replace("天", "")}
                <StyledText color="#333333">天</StyledText>
              </StyledText>
              <StyledText size="12" color="#999999" top="10">项目期限</StyledText>
            </NormalView>
          </ColumnView>
          <ColumnView>
            <NormalView style={{alignItems: 'flex-end'}}>
              {item.isEnd ? <StyledText size="20" color={textcolor}>募集结束</StyledText> :
                <StyledText size="26" color="#333333">{FloatFormatter(residueMoney)}
                  <StyledText color="#333333">{str}</StyledText>
                </StyledText>
              }
              <StyledText size="12" color="#999999" top="10">剩余可投</StyledText>
            </NormalView>
          </ColumnView>
        </MiddleView>
        {!item.isEnd ?
          (<ProgressContainer>
              <ProgressBg>
                <ProgressView progress={progress}/>
              </ProgressBg>
              <ProgressText color="#333333">投资进度
                <StyledText color="#7AADFB" size="12">{investedProgress + "%"}</StyledText>
              </ProgressText>
            </ProgressContainer>
          ) : <BlankView/>
        }
        {!item.isEnd ? <Type>
          <StyledText size="12">{types[item.isNewuserOnly]}</StyledText>
        </Type> : null}
      </ItemView>
    );
  }

  _renderFooter() {
    const {loading, isLoadMore} = this.props.financeList;
    if (!loading && !isLoadMore) {
      return (
        <FooterView>
          <StyledText color="#999999"></StyledText>
        </FooterView>
      );
    } else {
      return <Footer visible={isLoadMore && !loading}/>;
    }
  }

  _onEndReached() {//list.length > 0 &&
    let {isLoadMore, noMore, list, isRefreshing, loading} = this.props.financeList;
    if (!isLoadMore && !noMore && !isRefreshing && !loading) {
      const {financeListActions} = this.props;
      financeListActions.getData(false, true, false, ++page);
    } else {
      console.log("cd-----");
    }
  }

  _onRefresh() {
    page = 1;
    const {financeListActions, financeList} = this.props;
    if (!financeList.isRefreshing) {
      financeListActions.getData(true, false, false, page);
      this.props.workingTableAction.getAds();
    }
  }

  _renderHeader() {
    const ads = this.props.ads;
    return (
      <View>
        {ads && ads[1] && ads[1].position === "pic4" ?
          <AdsView feedback={ads[1].link ? true : false}
                   onPress={() => ads[1].link && this.props.navigation.navigate("WebView", {url: ads[1].link})}>
            <AdsImage source={{uri: ads[1].url}}/>
          </AdsView> : null}
      </View>
    );
  }

  componentDidMount() {
    page = 1;
    global.didMount = true;
    const {financeListActions} = this.props;
    financeListActions.getData(false, false, true, page);
    !this.props.ads && this.props.workingTableAction.getAds();
  }

  render() {
    let {loading, isRefreshing, list} = this.props.financeList;
    return (
      <FlexView>
        <Header center color="#38373C">
          <StyledText size="17">理财列表</StyledText>
        </Header>
        <FlatList data={list} initialNumToRender={5}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={() => this._onRefresh()}
                    />
                  }
                  renderItem={({item}) => this._renderItems(item)}
                  onEndReached={() => this._onEndReached()}
                  ListEmptyComponent={() => <NoData visible={!loading}/>}
                  keyExtractor={item => item.id}
                  ListHeaderComponent={this._renderHeader()}
                  ListFooterComponent={() => this._renderFooter()}/>
        <ActivityIndicatorModal visible={loading}/>
      </FlexView>
    );
  }
}

FinanceList.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const {financeList} = state;
  const ads = state.workingTable.ads;
  return {financeList, ads};
};

const mapDispatchToProps = (dispatch) => {
  const financeListActions = bindActionCreators(financeListCreator, dispatch);
  const workingTableAction = bindActionCreators(workingTableCreator, dispatch);
  return {financeListActions, workingTableAction};
};

export default connect(mapStateToProps, mapDispatchToProps)(FinanceList);
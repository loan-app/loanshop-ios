import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  View,
  DeviceEventEmitter
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled from 'styled-components/native';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../config/constants';
import {ActivityIndicatorModal, FlexView, StyledText, NoData, BetweenView, Footer,CenterView,StyledButtom} from '../components/UtilLib';
import {BORDER_WIDTH} from '../config/constants';
import color from '../styles/color';

import * as capitalRecordCreator from '../actions/capitalRecordActions';

const ItemView = styled.View`
  background-color:#ffffff;
  border-top-width:${BORDER_WIDTH};
  border-color:#eeeeee;
  padding-left:20;
  padding-vertical:6;
`;
const InnerView = BetweenView.extend`
  padding-right:20;
`;

let page = 1;
class CapitalRecord extends Component {

  static navigationOptions = {
    title: '资金流水'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderItems(item) {
    return (
      <ItemView>
        <InnerView>
          <View>
            <StyledText color="#333333">{item.type}</StyledText>
            <StyledText color="#999999">{item.createdAt}</StyledText>
          </View>
          <StyledText
            color={item.cashStr.indexOf("-") > -1 ? "#333333" : color.font.blue }>{item.cashStr}</StyledText>
        </InnerView>
      </ItemView>
    );
  }
  _renderNoData(visible) {
        if (visible) {
            return <CenterView style={{marginTop: WINDOW_HEIGHT / 3 - 40}}>
              <StyledText color="#999999">暂无资金流水，快去投资赚钱吧！</StyledText>
              <StyledButtom color="transparent" height="35" radius="20" top="30" width="118"
                          style={{borderWidth: 1, borderColor: "#6295fd"}}
                            onPress={() => {
                              DeviceEventEmitter.emit('navigateTab', "FinanceList");
                              this.props.navigation.goBack();
                            }}>
                <StyledText size="14" color="#6295fd">去投资</StyledText>
              </StyledButtom>
            </CenterView>
        } else {
            return null;
        }
  }
  _onEndReached() {
    let {isLoadMore, noMore,loading} = this.props.capitalRecord;
    if (!isLoadMore && !noMore&&!loading) {
      const {capitalRecordActions} = this.props;
      capitalRecordActions.getData(false, true, false, ++page);
    } else {
      console.log("cd-----");
    }
  }

  componentDidMount() {
    page = 1;
    console.log("-----componentDidMount");

    const {capitalRecordActions} = this.props;
    capitalRecordActions.getData(false, false, true, page);
  }

  render() {
    let {loading, list, noMore, isLoadMore} = this.props.capitalRecord;
    console.log('------------capitalRecord1 = ' + JSON.stringify(this.props.capitalRecord))

    console.log('------------capitalRecord2 = ' + JSON.stringify(list))

    return (
      <FlexView>
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
    );
  }
}

CapitalRecord.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const {capitalRecord} = state;
  return {capitalRecord};
};

const mapDispatchToProps = (dispatch) => {
  const capitalRecordActions = bindActionCreators(capitalRecordCreator, dispatch);
  return {capitalRecordActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(CapitalRecord);
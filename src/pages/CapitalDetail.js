import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled from 'styled-components/native';

import {
  ActivityIndicatorModal,
  ScrollLayout,
  CommText,
  BetweenView,
  RowView,
  CenterView
} from '../components/UtilLib';
import {WINDOW_WIDTH} from '../config/constants';
import {createApiUrl} from '../requests/http';

import * as capitalDetailCreator from '../actions/capitalDetailActions';
import FloatFormatter from '../utils/Float';
import Touchable from "../components/Touchable";

const DetailView = styled.View`
  padding-horizontal:12;
  margin-horizontal:15;
  background-color:#F9F9F9;
  padding-vertical:10;
`;
const ItemView = CenterView.extend`
  margin-top:10;
  width:80;
`;
const TitleView = BetweenView.extend`
  padding-left:12;
  background-color:#F3F3F3;
  padding-vertical:10;
  margin-top:10;
  margin-horizontal:15;
`;

class CapitalDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {navigation, capitalDetailActions} = this.props;
    capitalDetailActions.getData(true, navigation.state.params.id);
  }

  componentWillUnmount() {
    this.props.capitalDetailActions.clearCache();
  }

  render() {
    const {loading, detail} = this.props.capitalDetail;
    let text = "";
    if (detail.couponType === 1) {
      text = `使用红包：${FloatFormatter(detail.couponMoney)}元`;
    } else if (detail.couponType === 4) {
      text = `使用加息券：${FloatFormatter(detail.couponRate && detail.couponRate * 100)}%`;
    }
    return (
      <ScrollLayout>
        <TitleView>
          <CommText color="#333333">基本信息</CommText>
          {
            detail.isProtocolShow ?
              <Touchable style={{paddingHorizontal: 10}}
                         onPress={() => this.props.navigation.navigate("WebView", {url: createApiUrl(`/user/h5/invest-protocol?investId=${this.props.navigation.state.params.id}`)})}>
                <CommText color="#6295fd">【查看投资协议】</CommText>
              </Touchable> : null
          }
        </TitleView>
        <DetailView style={{flexDirection: "row", justifyContent: "space-between"}}>
          <View>
            <CommText color="#999999" top="4">预期年化：{FloatFormatter(detail.rate && detail.rate * 100)}%</CommText>
            <CommText color="#999999" top="4">投资时间：{detail.investDate}</CommText>
            <CommText color="#999999" top="4">预期收益：{FloatFormatter(detail.interestMoney)}元</CommText>
          </View>
          <View>
            <CommText color="#999999" top="4">项目期限：{detail.deadLine}</CommText>
            <CommText color="#999999" top="4">投资金额：{FloatFormatter(detail.investMoney)}元</CommText>
            <CommText color="#999999" top="4">{text}</CommText>
            <CommText/>
          </View>
        </DetailView>
        <TitleView>
          <CommText color="#333333">还款明细({detail.repaymentType})</CommText>
        </TitleView>
        <DetailView>
          <RowView>
            <ItemView>
              <CommText color="#333333">还款时间</CommText>
            </ItemView>
            <ItemView style={{flex: 1}}>
              <CommText color="#333333">说明</CommText>
            </ItemView>
            <ItemView>
              <CommText color="#333333">状态</CommText>
            </ItemView>
          </RowView>
          {
            detail.incomeList && detail.incomeList.map((item, i) => {
              const dom = [];
              item.explain && item.explain.split("@").map((item, i) => {
                dom.push(<CommText key={i} color="#999999">{item}</CommText>);
              });
              return (
                <RowView key={i}>
                  <ItemView>
                    <CommText color="#999999">{item.estimatePayAt}</CommText>
                  </ItemView>
                  <ItemView style={{flex: 1}}>
                    {dom}
                  </ItemView>
                  <ItemView>
                    <CommText color="#999999">{item.status}</CommText>
                  </ItemView>
                </RowView>
              )
            })
          }
        </DetailView>
        <ActivityIndicatorModal visible={loading}/>
      </ScrollLayout>
    );
  }

}

CapitalDetail.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const {capitalDetail} = state;
  return {capitalDetail};
};

const mapDispatchToProps = (dispatch) => {
  const capitalDetailActions = bindActionCreators(capitalDetailCreator, dispatch);
  return {capitalDetailActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(CapitalDetail);
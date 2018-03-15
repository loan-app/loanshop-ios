import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  View
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled from 'styled-components/native';
import Touchable from '../components/Touchable';
import color from '../styles/color';
import imgs from '../resources/imgs';

import {
  ActivityIndicatorModal,
  FlexView,
  StyledText,
  NoData,
  Footer,
  BetweenView,
  NormalView
} from '../components/UtilLib';

import * as messageListCreator from '../actions/messageListActions';
import * as notifyListCreator from '../actions/notifyListActions';
import {WINDOW_WIDTH} from '../config/constants';


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
const Items = BetweenView.extend`
  padding-left:12;
  padding-right:12;
  background-color:#fff;
  border-bottom-width:1px;
  border-color:#eeeeee;
  padding-vertical:8;
`;

let page = 1;
class MessageList extends Component {

  static navigationOptions = {
    title: '平台公告'
  };

  constructor(props) {
    super(props);
    this.state = {
      type: 1
    };
  }

  _renderItems(item) {
    return (
      <Touchable
        onPress={() => this.props.navigation.navigate(this.state.type === 1 ? "NotifyDetail" : "MessageDetail", {
          title: item.title.length > 12 ? item.title.substr(0, 12) + "..." : item.title,
          id: item.id
        })}>
        <Items>
          <NormalView>
            <StyledText color="#333333">{item.title}</StyledText>
            <StyledText color="#999999" size="12">{item.createdAt}</StyledText>
          </NormalView>
          {imgs.rightArrowGary()}
        </Items>
      </Touchable>
    );
  }

  _onEndReachedMessage() {
    let {isLoadMore, noMore, loading} = this.props.messageList;
    if (!isLoadMore && !noMore && this.state.type === 2 && !loading) {
      const {messageListActions} = this.props;
      messageListActions.getData(false, true, false, ++page);
    } else {
      console.log("cd-----");
    }
  }

  _onEndReachedNotify() {
    let {isLoadMore, noMore, loading} = this.props.notifyList;
    if (!isLoadMore && !noMore && this.state.type === 1 && !loading) {
      const {notifyListActions} = this.props;
      notifyListActions.getData(false, true, false, ++page);
    } else {
      console.log("cd-----");
    }
  }

  _changeType(type) {
    this.state.type !== type && this.setState({type: type}, () => {
      page = 1;
      const {notifyListActions, messageListActions} = this.props;
      let title = "";
      if (type === 1) {
        title = "平台公告";
        notifyListActions.getData(false, false, false, 1);
      } else {
        title = "个人消息";
        messageListActions.getData(false, false, false, 1);
      }
      this.props.navigation.setParams({
        title: title
      });

    });
  }

  _renderMessage() {
    let {loading, list, noMore, isLoadMore} = this.props.messageList;
    return <FlexView>
      <FlatList data={list} initialNumToRender={20}
                renderItem={(item) => this._renderItems(item.item)}
                onEndReached={() => this._onEndReachedMessage()}
                ListEmptyComponent={() => <NoData visible={!loading} text="暂无消息"/>}
                keyExtractor={(item, index) => index}
                ListFooterComponent={() => <Footer visible={!noMore && isLoadMore}/>}/>
      <ActivityIndicatorModal visible={loading}/>
    </FlexView>
  }

  _renderNotify() {
    let {loading, list, noMore, isLoadMore} = this.props.notifyList;
    return <FlexView>
      <FlatList data={list} initialNumToRender={20}
                renderItem={(item) => this._renderItems(item.item)}
                onEndReached={() => this._onEndReachedNotify()}
                ListEmptyComponent={() => <NoData visible={!loading} text="暂无公告"/>}
                keyExtractor={(item, index) => index}
                ListFooterComponent={() => <Footer visible={!noMore && isLoadMore}/>}/>
      <ActivityIndicatorModal visible={loading}/>
    </FlexView>
  }

  componentDidMount() {
    page = 1;
    const {notifyListActions} = this.props;
    notifyListActions.getData(false, false, true, page);
  }

  render() {
    return (
      <FlexView>
        <BetweenView>
          <FilterView color={this.state.type === 1 && color.font.blue} onPress={this._changeType.bind(this, 1)}>
            <StyledText size="14" color={this.state.type === 1 ? color.font.blue : '#999999'}>平台公告</StyledText>
          </FilterView>
          <FilterView color={this.state.type === 2 && color.font.blue} onPress={this._changeType.bind(this, 2)}>
            <StyledText size="14" color={this.state.type === 2 ? color.font.blue : '#999999'}>个人消息</StyledText>
          </FilterView>
        </BetweenView>
        {this.state.type === 1 ? this._renderNotify() : this._renderMessage()}
      </FlexView>
    );
  }

}

MessageList.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const {messageList, notifyList} = state;
  return {messageList, notifyList};
};

const mapDispatchToProps = (dispatch) => {
  const messageListActions = bindActionCreators(messageListCreator, dispatch);
  const notifyListActions = bindActionCreators(notifyListCreator, dispatch);
  return {messageListActions, notifyListActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
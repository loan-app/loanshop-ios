'use strict';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import Home from '../pages/Home';
import UserInfo from '../pages/UserInfo';
import FinanceList from '../pages/FinanceList';
import imgs from '../resources/imgs';

const icon = {height: 26, resizeMode: "contain"};
export default class Tabs extends Component {

  initRouter = "Home";

  constructor(props) {
    super(props);
    this.state = {selectedTab: global.initRouter || this.initRouter};
    global.currentTab = global.initRouter || this.initRouter;
    global.initRouter = "";
    this._changeTab = this._changeTab.bind(this);
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('navigateTab', this._changeTab);
    // setTimeout(()=>this._changeTab("UserInfo"),200);
  }

  _intoUserInfo() {
    if (global.token) {
      this._changeTab('UserInfo');
    } else {
      global.initRouter = "UserInfo";
      this.props.navigation.navigate("Login");
    }
  }

  componentWillUnmount() {
    this.listener && this.listener.remove();
  }


  _changeTab(name) {
    global.currentTab = name;
    this.setState({selectedTab: name});
    DeviceEventEmitter.emit('changeTab');
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <TabNavigator hidesTabTouch={true} tabBarStyle={styles.tab}>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'Home'}
            title="首页"
            titleStyle={styles.titleText}
            selectedTitleStyle={{color: '#F1BE64'}}
            renderIcon={() => imgs.home(icon)}
            renderSelectedIcon={() => imgs.homeSelected(icon)}
            onPress={() => this._changeTab('Home')}>
            <Home {...this.props}/>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'FinanceList'}
            title="理财"
            titleStyle={styles.titleText}
            selectedTitleStyle={{color: '#F1BE64'}}
            renderIcon={() => imgs.finance(icon)}
            renderSelectedIcon={() => imgs.financeSelected(icon)}
            onPress={() => this._changeTab('FinanceList')}>
            <FinanceList {...this.props}/>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'UserInfo'}
            title="帐户"
            titleStyle={styles.titleText}
            selectedTitleStyle={{color: '#F1BE64'}}
            renderIcon={() => imgs.user(icon)}
            renderSelectedIcon={() => imgs.userSelected(icon)}
            onPress={() => this._intoUserInfo()}>
            <UserInfo {...this.props}/>
          </TabNavigator.Item>
        </TabNavigator>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tab: {
    height: 49,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tabIcon: {
    color: "#666",
    backgroundColor: "#fff",
  },
  titleText: {
    fontSize: 12,
    color: "#AFAFAF",
    marginTop: 2
  },
});

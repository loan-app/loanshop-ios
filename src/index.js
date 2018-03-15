import React, {Component} from 'react';
import {StatusBar, View, NativeAppEventEmitter, DeviceEventEmitter, BackHandler, NativeModules} from 'react-native';
import {Provider} from 'react-redux';
import StackNavigator from './config/stackNavigator';
import Modal from './components/Modal';
import ToastWrapper from './components/ToastWrapper';
import Splash from './pages/Splash';
import {NavigationActions} from 'react-navigation';
import codePush from "react-native-code-push";

import * as financeListActions from './actions/financeListActions';
import * as workingTableActions from './actions/workingTableActions';
import * as userActions from './actions/userActions';

import {OS, Channel as _Channel, WeChatKey, TDkey} from './config/constants';
import localStorage from './utils/LocalStorage';
import configureStore from './config/store';
import * as WeChat from 'react-native-wechat';
import * as RNTD from './utils/TD';
const store = configureStore(); //获取store
const Channel = NativeModules.RNChannel;

if (!__DEV__) {
  ErrorUtils.setGlobalHandler(() => {
    return void 0;
  });
}
global.splashInit = "yxcInit";

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};
    this.backAndroidTime = Date.now();
    // const root = ["Home", "FinanceList", "UserInfo"];
    this.androidBackCallback = () => {
      if (this.refs.navigator.state.nav.index === 0) {
        let prevAndroidBackTimestamp = this.backAndroidTime,
          currentTimestamp = Date.now();
        this.backAndroidTime = currentTimestamp;
        if (currentTimestamp - prevAndroidBackTimestamp < 1000) {
          global.hasChecked = false;
          BackHandler.exitApp();
          return false;
        } else {
          this.refs.toast.callToast('再按一次退出程序');
          return true;
        }
      }
      return false;
    };
    this.refresh = this._refresh.bind(this);
  }

  _pushNavigator(pushType) {
    if (pushType === 1 || pushType === '1') {
      this.refs.navigator && this.refs.navigator._navigation.navigate("MessageList");
    }
  }

  componentWillMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.androidBackCallback);
    BackHandler.addEventListener('hardwareBackPress', this.androidBackCallback);

    localStorage.getItem(global.splashInit, data => {
      if (data) {
        this.setState({visible: true});
      } else {
        setTimeout(() => {
          this.setState({visible: true});
        }, 500);
      }
    });
    Channel && Channel.startCount("Home");
    RNTD.init(TDkey, _Channel);
  }

  async componentDidMount() {
    try {
      await WeChat.registerApp(WeChatKey);
    } catch (e) {
    }
    global.initRouter = "";
    this.listener = DeviceEventEmitter.addListener('changeTab', this.refresh);
  }

  _refresh() {
    if (!this.refs.redux) {
      return;
    }
    if (global.currentTab === "Home") {
      this.refs.redux.store.dispatch(workingTableActions.getData(false));
      this.refs.redux.store.dispatch(workingTableActions.getBanner());
    } else if (global.currentTab === "FinanceList") {
      global.financeListoLoaded && this.refs.redux.store.dispatch(financeListActions.refresh());
    } else if (global.currentTab === "UserInfo") {
      global.userInfoLoaded && this.refs.redux.store.dispatch(userActions.userProfile(false));
    }
  }

  _stateChange(prevState, currentState) {
    // console.log(getCurrentRouteName(prevState)+"--"+getCurrentRouteName(currentState));
    const current = getCurrentRouteName(currentState);
    const prev = getCurrentRouteName(prevState);
    if (current === "Main") {
      this._refresh();
    }
    Channel && Channel.stopCount(prev);
    Channel && Channel.startCount(current);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.androidBackCallback);
    this.listener && this.listener.remove();
    this.timer && clearTimeout(this.timer);
    global.initRouter = "";
  }

  render() {
    return (
      <Provider store={store} ref="redux">
        <View style={{flex: 1}}>
          <StatusBar hidden={true}/>
          <ToastWrapper ref="toast">
            {this.state.visible &&
            <StackNavigator ref="navigator" onNavigationStateChange={this._stateChange.bind(this)}/>}
            <Modal/>
          </ToastWrapper>
          <Splash/>
        </View>
      </Provider>
    );
  }
}

let codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};
export default codePush(codePushOptions)(App);
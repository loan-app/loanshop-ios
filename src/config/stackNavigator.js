import React from 'react';
import {View, Text, StatusBar, Platform} from 'react-native';
import {StackNavigator, NavigationActions} from "react-navigation";
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import globalStyles from '../styles/global';
import imgs from '../resources/imgs';
import Touchable from '../components/Touchable'

import TabBar from '../pages/TabBar';
import Login from '../pages/Login';
import Setting from '../pages/Setting';
import Feedback from '../pages/Feedback';
import HelpCenter from '../pages/HelpCenter';
import ModifyPassword from '../pages/ModifyPassword';
import Register from '../pages/Register';
import ForgetPassword from '../pages/ForgetPassword';
import SafeSetting from '../pages/SafeSetting';
import Authentication from '../pages/Authentication';
import BankCardBind from '../pages/BankCardBind';
import BankList from '../pages/BankList';
import CapitalRecord from '../pages/CapitalRecord';
import CapitalList from '../pages/CapitalList';
import CapitalDetail from '../pages/CapitalDetail';
import BonusList from '../pages/BonusList';
import WebView from '../pages/WebView';
import BankCardDetail from '../pages/BankCardDetail';
import PayPasswordInit from '../pages/PayPasswordInit';
import PayPasswordModify from '../pages/PayPasswordModify';
import MessageList from '../pages/MessageList';
import MessageDetail from '../pages/MessageDetail';
import Recharge from '../pages/Recharge';
import Cash from '../pages/Cash';
import Experience from '../pages/Experience';
import ExperienceDetail from '../pages/ExperienceDetail';
import Asset from '../pages/Asset';
import Income from '../pages/Income';
import FinanceDetail from '../pages/FinanceDetail';
import FinanceBuy from '../pages/FinanceBuy';
import AboutUs from '../pages/AboutUs';
import NotifyDetail from '../pages/NotifyDetail';
import PhoneBind from '../pages/PhoneBind';

const securityPages = ['UserInfo', 'FinanceBuy', 'MessageList'];
const StackOptions = ({navigation}, f) => {
  let {state} = navigation;

  const headerStyle = {backgroundColor: '#fff', borderBottomWidth: 0};
  if (Platform.OS === "android") {
    const height = StatusBar.currentHeight;
    headerStyle.height = 56 + 10;
    headerStyle.paddingTop = height - 10;
  }
  const headerTitleStyle = {left: 0, alignSelf: 'center', fontSize: 17, color: '#333', fontWeight: 'normal'};
  const headerBackTitle = '';
  const headerTitle = state.params && state.params.title;
  const headerLeft = state.params && state.params.headerLeft || (
      <Touchable style={[globalStyles.headerButton]}
                 onPress={() => navigation.dispatch(NavigationActions.back({key: global.backRouter}))}>
        {imgs.leftArrow()}
      </Touchable>);
  const headerRight = state.params && state.params.headerRight;
  const gesturesEnabled = (state.params && state.params.gesturesEnabled != undefined) ? state.params.gesturesEnabled : true;
  const result = {
    headerStyle,
    headerTitleStyle,
    headerBackTitle,
    headerTitle,
    headerLeft,
    gesturesEnabled,
  };
  state.params && state.params.hideHeader && (result.header = null);
  if (!f) {
    result.headerRight = <View/>
  } else if (f === 2) {
    result.headerRight = headerRight || <View/>;
  }
  return result;
};

const App = StackNavigator({

    Main: {
      screen: TabBar,
      navigationOptions: {header: null}
    },
    Login: {
      screen: Login,
      navigationOptions: {header: null}
    },
    Feedback: {
      screen: Feedback,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    HelpCenter: {
      screen: HelpCenter,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    ModifyPassword: {
      screen: ModifyPassword,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    Register: {
      screen: Register,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    ForgetPassword: {
      screen: ForgetPassword,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    Setting: {
      screen: Setting,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    SafeSetting: {
      screen: SafeSetting,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    Authentication: {
      screen: Authentication,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    BankCardBind: {
      screen: BankCardBind,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    BankList: {
      screen: BankList,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    CapitalRecord: {
      screen: CapitalRecord,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    CapitalList: {
      screen: CapitalList,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    CapitalDetail: {
      screen: CapitalDetail,
      navigationOptions: ({navigation}) => StackOptions({navigation}, 2)
    },
    BonusList: {
      screen: BonusList,
      navigationOptions: ({navigation}) => StackOptions({navigation}, 1)
    },
    WebView: {
      screen: WebView,
      navigationOptions: ({navigation}) => StackOptions({navigation}, 2)
    },
    BankCardDetail: {
      screen: BankCardDetail,
      navigationOptions: ({navigation}) => StackOptions({navigation}, 1)
    },
    PayPasswordInit: {
      screen: PayPasswordInit,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    PayPasswordModify: {
      screen: PayPasswordModify,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    MessageList: {
      screen: MessageList,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    MessageDetail: {
      screen: MessageDetail,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    Recharge: {
      screen: Recharge,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    Cash: {
      screen: Cash,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    Experience: {
      screen: Experience,
      navigationOptions: {header: null}
    },
    ExperienceDetail: {
      screen: ExperienceDetail,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    Asset: {
      screen: Asset,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    Income: {
      screen: Income,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    FinanceDetail: {
      screen: FinanceDetail,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    FinanceBuy: {
      screen: FinanceBuy,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    AboutUs: {
      screen: AboutUs,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    NotifyDetail: {
      screen: NotifyDetail,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
    PhoneBind: {
      screen: PhoneBind,
      navigationOptions: ({navigation}) => StackOptions({navigation})
    },
  }
  ,
  {
    initialRouteName: 'Main',
    headerMode: 'screen',
    transitionConfig: () => ({
      screenInterpolator: CardStackStyleInterpolator.forHorizontal,
    }),
    cardStyle: {
      backgroundColor: '#F7F7F7'
    }
  });
const defaultGetStateForAction = App.router.getStateForAction;

App.router.getStateForAction = (action, state) => {
  if (!global.token && securityPages.indexOf(action.routeName) != -1) {
    action.routeName === "UserInfo" && (global.initRouter = action.routeName);
    action.routeName = 'Login';
    action.params && (action.params.hideHeader = false);
  } else if (action.type === "Navigation/BACK" && global.initRouter) {
    global.initRouter = null;
  }
  return defaultGetStateForAction(action, state);
};

export default App;
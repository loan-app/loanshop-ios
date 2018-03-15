import React, {PureComponent} from 'react';
import {
  View,
  WebView
} from 'react-native';
import imgs from '../resources/imgs';
import {NoData, ActivityIndicatorInlineBlock, HeaderButton, RowView, StyledText} from '../components/UtilLib';
import MessageBox from '../components/MessageBox';
import Share from '../components/Share';
import {OS} from '../config/constants';
import {NavigationActions} from 'react-navigation';

export default class WebView1 extends PureComponent {

  currentUrl = "";
  twiceBack = false;

  constructor(props) {
    super(props);
    let {url, html} = this.props.navigation.state.params;
    url = url.replace("@@", "://");
    this.state = {
      token: global.token,
      url: url,
      html: html,
      messageBox: {
        visible: false,
        content: '',
        button: null
      }
    };
    this.share = {};
    const patchPostMessageFunction = function () {
      var originalPostMessage = window.postMessage;

      var patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
      };

      patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
      };

      window.postMessage = patchedPostMessage;
      setTimeout(function () {
        var meta = document.getElementsByTagName('meta');
        for (i in meta) {
          if (typeof meta[i].name != "undefined" && meta[i].name.toLowerCase() == "description") {
            window.postMessage(`{"type":"configDesc","desc":"${meta[i].content}"}`);
          }
        }
      }, 500);
    };
    this.patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';
  }

  _onNavigationStateChange(navState) {
    if (navState.url && navState.url.indexOf("postMessage") !== -1) {
      return true;
    }
    this.desc = "";
    this.share = {
      webpageUrl: navState.url,
      title: navState.title,
    };
    this.currentUrl = navState.url;
    const strRegex = "^((https|http|ftp|rtsp|mms)?://)"
      + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
      + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
      + "|" // 允许IP和DOMAIN（域名）
      + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
      + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
      + "[a-z]{2,6})" // first level domain- .com or .museum
      + "(:[0-9]{1,4})?" // 端口- :80
      + "((/?)|" // a slash isn't required if there is no file name
      + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    const isUrl = navState.title && new RegExp(strRegex).test(navState.title);
    // navState.title &&!isUrl&& this.props.navigation.setParams({
    //   title: navState.title
    // });
    const title = !isUrl && navState.title || '';
    if (navState.canGoBack) {
      this.props.navigation.setParams({
        headerLeft: (
          <RowView style={{justifyContent: 'center'}}>
            <HeaderButton onPress={() => {
              if (this.twiceBack) {
                this.twiceBack = false;
                this.props.navigation.goBack();
              } else {
                this.refs.webview.goBack()
              }
            }}>
              {imgs.leftArrowWhite()}
              {/* <StyledText size="14" color="#333333">返回</StyledText> */}
            </HeaderButton>
            <HeaderButton onPress={() => this.props.navigation.goBack()}>
              {/* <StyledText size="14" color="#333333">关闭</StyledText> */}
              {imgs.close2({tintColor: "#fff"})}
            </HeaderButton>
          </RowView>
        ),
        title: title.length > 12 ? title.substr(0, 12) + "..." : title
      });
    } else {
      this.props.navigation.setParams({
        headerLeft: null,
        title: title.length > 12 ? title.substr(0, 12) + "..." : title
      });
    }
  }

  _showOptionModal(msg) {
    this.props.navigation.setParams({
      gesturesEnabled: false
    });
    this.setState({
      messageBox: {
        visible: true,
        content: msg,
        button: {
          text: '确认',
          onPress: () => {
            this.props.navigation.setParams({
              gesturesEnabled: true
            });
            this.setState({
              messageBox: {
                visible: false
              }
            });
          }
        }
      }
    });
  }

  _showShareButton() {
    this.props.navigation.setParams({
      headerRight: <HeaderButton onPress={() => this._openShare()}>
        {imgs.share()}
      </HeaderButton>
    });
  }

  _onMessage(data) {
    console.log(data.data);
    const {goBack, navigate} = this.props.navigation;
    if (data.data && data.data.length > 2) {
      try {
        data = JSON.parse(data.data);
        if (data.type === "openShare") {
          this._openShare();
        } else if (data.type === "configShare") {
          if (data.url) {
            this.share = {
              webpageUrl: data.url,
              title: data.title,
              description: data.desc || this.desc,
              imageUrl: data.img
            };
            this.refs.share.getWrappedInstance().config(this.share);
          }
        } else if (data.type === "configDesc") {
          !this.desc && (this.desc = data.desc);
        } else if (data.type === "navigate") {
          if (data.routeName) {
            const match = /Home|FinanceList|UserInfo/.test(data.routeName);
            if (match) {
              global.financeListoLoaded = false;
              global.userInfoLoaded = false;
              global.initRouter = data.routeName;
              const navigateAction = NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({routeName: 'Main'}),
                ]
              });
              this.props.navigation.dispatch(navigateAction);
            } else if (data.back && !data.callback) {
              goBack();
              setTimeout(() => {
                navigate(data.routeName, data.params);
              });
            } else {
              if (data.routeName === "Login") {
                this.twiceBack = true;
                navigate(data.routeName, {
                  successCb: () => {
                    if (this.currentUrl.indexOf("?t=") > -1) {
                      this.setState({url: this.currentUrl + global.token})
                    } else {
                      const str = this.currentUrl.indexOf("?") === -1 ? "?" : "&";
                      this.setState({url: this.currentUrl + str + "t=" + global.token});
                    }
                  }, ...data.params
                });
              } else {
                navigate(data.routeName, data.params);
              }
            }
          }
        } else if (data.type === "showShare") {
          this._showShareButton();
        }
      } catch (e) {
        this._showOptionModal("ErrorData:" + data.data);
      }
    }
  }

  _openShare() {
    if (!this.share.description) {
      this.share.description = this.desc || this.share.title;
    }
    this.refs.share.getWrappedInstance().show(this.share);
  }

  componentDidMount() {
    // this.props.navigation.setParams({
    //   rightTouch: () => this._openShare()
    // });
  }

  render() {
    const source = this.state.url ? {
      uri: this.state.url,
      headers: {token: global.token || '', osname: global.os || ''}
    } : {html: this.state.html};
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderColor: "#EEEEEE",
          padding: this.state.url ? 0 : 10
        }}>
        <WebView
          ref="webview"
          style={{flex: 1}}
          injectedJavaScript={this.patchPostMessageJsCode}
          source={source}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={OS === "ios"}
          onNavigationStateChange={(navState) => this._onNavigationStateChange(navState)}
          renderError={() => <NoData visible text="加载失败"/>}
          startInLoadingState={false}
          onMessage={(event) => this._onMessage(event.nativeEvent)}
        />
        <Share ref="share"/>
        <MessageBox
          visible={this.state.messageBox.visible}
          content={this.state.messageBox.content}
          button={this.state.messageBox.button}/>
      </View>
    );
  }
}


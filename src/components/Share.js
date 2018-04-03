import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Clipboard
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {IndicatorView} from './UtilLib';
import Touchable from './Touchable';
import * as modalCreator from '../actions/modalActions';
import * as WeChat from 'react-native-wechat';

import {WINDOW_WIDTH, WINDOW_HEIGHT, OS} from '../config/constants';

import resolveAssetSource from 'resolveAssetSource';

class Share extends PureComponent {
  constructor(props) {
    super(props);
    this.img = (OS === "ios") ? `http${global.https}://s.qianshiwang.com/share.png` : resolveAssetSource(require("../resources/imgs/logo.png")).uri;
  }

  componentDidMount() {
    this.view = (
      <IndicatorView visible={false} style={{height: WINDOW_HEIGHT}} backPress={() => {
        this.close()
      }}>
        <View style={styles.container}>
          {/*<Touchable onPress={() => this._share(1)}>*/}
            {/*<View style={styles.content}>*/}
              {/*<Image source={require('../resources/imgs/wx.png')} style={styles.img}/>*/}
              {/*<Text style={styles.label}>微信好友*/}
              {/*</Text>*/}
            {/*</View>*/}
          {/*</Touchable>*/}

          {/*<Touchable onPress={() => this._share(2)}>*/}
            {/*<View style={styles.content}>*/}
              {/*<Image source={require('../resources/imgs/wx2.png')} style={styles.img}/>*/}
              {/*<Text style={styles.label}>朋友圈*/}
              {/*</Text>*/}
            {/*</View>*/}
          {/*</Touchable>*/}

          <Touchable onPress={() => this._share(3)}>
            <View style={styles.content}>
              <Image source={require('../resources/imgs/copy.png')} style={styles.img}/>
              <Text style={styles.label}>复制链接
              </Text>
            </View>
          </Touchable>
        </View>
      </IndicatorView>
    );
  }

  render() {
    return <View/>;
  }

  _share(i) {
    //resolveAssetSource(require("../resources/imgs/logo.png")).uri
    this.close();
    !this.share.type && (this.share.type = "news");
    !this.share.description && (this.share.description = this.share.title);
    !this.share.thumbImage && (this.share.thumbImage = this.img);
    if (i === 1) {
      WeChat.isWXAppInstalled().then((installed) => {
        if (installed) {
          WeChat.shareToSession(this.share);
        } else {
          this.context.callToast("未安装微信");
        }
      });
    } else if (i === 2) {
      WeChat.isWXAppInstalled().then((installed) => {
        if (installed) {
          WeChat.shareToTimeline(this.share);
        } else {
          this.context.callToast("未安装微信");
        }
      });
    } else {
      this.context.callToast("链接复制成功", true);
      Clipboard.setString(this.share.webpageUrl);
    }
  }

  show(_share) {
    if (!_share.webpageUrl)return;
    this.share = _share;
    this.view && this.props.modalActions.toggleModal(this.view);
  }

  config(_share) {
    if (!_share.webpageUrl)return;
    this.share = _share;
  }

  close() {
    this.props.modalActions.toggleModal();
  }
}

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    height: 80,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  content: {
    width: WINDOW_WIDTH / 6,
    alignItems: 'center'
  },
  img: {
    width: WINDOW_WIDTH / 4 * 0.4,
    height: WINDOW_WIDTH / 4 * 0.4
  },
  label: {
    marginTop: 10,
    fontSize: 13,
    color: '#6A6A6A'
  }
});

Share.contextTypes = {
  callToast: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  const modalActions = bindActionCreators(modalCreator, dispatch);
  return {modalActions};
};

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Share);

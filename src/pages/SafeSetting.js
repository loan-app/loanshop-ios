import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {ScrollView} from 'react-native';
import GuideMenu from '../components/GuideMenu';
import {
  BlockWrapper,
  GrayBottomRowWrapper,
  RowWrapper,
} from '../components/UtilLib';
import AuthCheck from '../utils/Check';

class SafeSetting extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '安全设置'
  });

  constructor(props) {
    super(props);
  }

  _navigateCheck(level, route, params) {
    const routers = AuthCheck(this.props.check, level, route, params);
    if (routers[0]) {
      this.props.navigation.navigate(routers[0], routers[1]);
    }
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView>
        <BlockWrapper marginType="top">
          <GrayBottomRowWrapper>
            <GuideMenu title="修改登录密码" onPress={() => {
              navigate('ModifyPassword');
            }}/>
          </GrayBottomRowWrapper>
          <RowWrapper>
            <GuideMenu title="修改交易密码" onPress={() => {
              this._navigateCheck(2, 'PayPasswordModify');
            }}/>
          </RowWrapper>
        </BlockWrapper>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  const check = state.user.check;
  return {check};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SafeSetting);
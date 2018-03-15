import React, {Component} from 'react';

import {ScrollView} from 'react-native';
import GuideMenu from '../components/GuideMenu';
import {
  BlockWrapper,
  GrayBottomRowWrapper,
  RowWrapper,
} from '../components/UtilLib';
import {createApiUrl} from '../requests/http';

export default class HelpCenter extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: '帮助与反馈'
  });

  constructor(props) {
    super(props);
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView>
        <BlockWrapper marginType="top">
          <GrayBottomRowWrapper>
            <GuideMenu title="帮助中心" onPress={() => {
              navigate('WebView',{url:createApiUrl("/user/h5/help-center")});
            }}/>
          </GrayBottomRowWrapper>
          <RowWrapper>
            <GuideMenu title="意见反馈" onPress={() => {
              navigate("Feedback");
            }}/>
          </RowWrapper>
        </BlockWrapper>
      </ScrollView>
    )
  }
}

import React, {Component} from 'react';
import {
  ScrollView,
  WebView
} from 'react-native';
import {NoData, ActivityIndicatorModal, FlexView} from '../components/UtilLib';
import {getNotifiyDetail} from '../requests/http';
import HtmlFormatter from '../utils/HTML';

export default class WebView1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      detail: {}
    };
  }

  componentDidMount() {
    getNotifiyDetail({
      id: this.props.navigation.state.params.id
    }).then(data => {
      this.setState({loading: false});
      if (data.data.code === 0) {
        this.setState({detail: data.data.data});
      }
    }).catch(() => {
      this.setState({loading: false});
      this.context.callToast('加载失败');
    });
  }

  render() {
    return (
      <FlexView>
        {this.state.detail.title?<WebView
          style={{flex: 1}}
          source={{html: HtmlFormatter(this.state.detail.title, this.state.detail.createdAt, this.state.detail.content), baseUrl: ''}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          renderError={() => <NoData visible text="加载失败"/>}
        />:null}
        <ActivityIndicatorModal visible={this.state.loading}/>
      </FlexView>
    );
  }
}

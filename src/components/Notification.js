import React, {PureComponent} from 'react';
import styled from 'styled-components/native';
import {StyledText} from './UtilLib';
import imgs from '../resources/imgs';
import Touchable from "./Touchable";

const NotificationView = styled(Touchable)`
  padding-left:10;
  padding-vertical:4;
  flex-direction:row;
`;

export default class Notification extends PureComponent {
  constructor(props) {
    super(props);
    this.state={idx:-1};
  }

  componentWillReceiveProps(nextProps) {
    const {notify}=nextProps;
    if (notify !== this.props.notify && notify && notify.length > 0) {
      this.interval && clearInterval(this.interval);
      this.setState({idx:0}, () => {
        this.interval = setInterval(() => {
          let idx=this.state.idx+1;
          idx===notify.length&&(idx=0);
          this.setState({idx});
        }, 3000);
      });
    }
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  render() {
    if (this.state.idx===-1) {
      return null
    }
    const {title,id}=this.props.notify[this.state.idx];
    return <NotificationView onPress={()=>this.props.navigate("NotifyDetail",{title: title.length>12?title.substr(0,12)+"...":title,id:id})}>
      {imgs.notification()}
      <StyledText color="#333333">{`  ${title.substring(0,20)}`}</StyledText>
    </NotificationView>
  }
}

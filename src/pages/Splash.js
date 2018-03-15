import React, {Component} from 'react';
import styled from 'styled-components/native';
import Swiper from 'react-native-swiper';
import {StatusBar} from 'react-native';

import {FlexView, CenterView, StyledButtom, StyledText} from '../components/UtilLib';
import {WINDOW_WIDTH, WINDOW_HEIGHT, OS} from '../config/constants';
import localStorage from '../utils/LocalStorage'
import * as XStatusBar from '../utils/XStatusBar';

const Container = styled.View`
  background-color:#ffffff;
  position:absolute;
  top:0;
  justify-content:center;
  width:${WINDOW_WIDTH};
  height:${WINDOW_HEIGHT + 30};
`;
const SplashImage = styled.Image.attrs({
  resizeMode: "stretch"
})`
  width:${WINDOW_WIDTH};
  height:${WINDOW_HEIGHT};
  position:absolute;
  top:0;
`;
const SwiperView = CenterView.extend`
  justify-content:center;
  height:${WINDOW_HEIGHT};
  background-color:#000;
`;
const Image = styled.Image.attrs({
  resizeMode: 'contain'
})`
   width:${WINDOW_WIDTH};
  height:${WINDOW_HEIGHT};
`;
const BottomView = CenterView.extend`
  padding-bottom:80;
  margin-top:40;
  justify-content:flex-start;
`;
const EnterButton = StyledButtom.extend`
  position:absolute;
  bottom:72;
  opacity:0;
`;

export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false, loaded: false};
  }

  _enter() {
    // localStorage.removeItem(global.splashInit);
    this.setState({visible: false, loaded: true});
    XStatusBar.setDark();
  }

  componentWillMount() {
    localStorage.getItem(global.splashInit, data => {
      if (data) {
        const deley = __DEV__ ? 500 : 3000;
        setTimeout(() => {
          this.setState({loaded: true});
          XStatusBar.setDark();
        }, deley);
      } else {
        setTimeout(() => {
          this.setState({visible: true}, () => {
            localStorage.setItem(global.splashInit, true);
          });
        }, 1000);
      }
    });
  }

  render() {
    return this.state.visible ? (
      <Container>
        <StatusBar hidden={true}/>
        <Swiper showsPagination={false} loop={false}>
          <SwiperView>
            <Image source={require('../resources/imgs/swiper1.png')}/>
          </SwiperView>
          <SwiperView>
            <Image source={require('../resources/imgs/swiper2.png')}/>
          </SwiperView>
          <SwiperView>
            <Image source={require('../resources/imgs/swiper3.png')}/>
            <EnterButton color="#5698DA" feedback={false} width="160" height="80" radius="4" onPress={() => this._enter()}>
              <StyledText size="16">立即启用</StyledText>
            </EnterButton>
          </SwiperView>
        </Swiper>
      </Container>
    ) : (
      this.state.loaded ? (
        <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" hidden={false}
                   showHideTransition='fade'
                   animated={true}/>
      ) :
        <Container>
          <StatusBar hidden={true}/>
          <SplashImage source={require("../resources/imgs/splash.png")}/>
        </Container>
    )
  }

}

'use strict';

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
} from 'react-native';

class Wave extends PureComponent {

  constructor(props) {
    super(props);
    this.alpha = {};
    this.state = {};
  }

  onLayoutContainer(e) {
    if (!this.width) {
      this.width = e.nativeEvent.layout.width;
      this.startAnimate();
    }
  }

  _animated(i) {
    console.log(this.width);
    this.state[`left${i}`].setValue(0);
    Animated.timing(
      this.state[`left${i}`],
      {
        toValue: -(this.width - 1),
        duration: this.props.duration[i],
        easing: Easing.linear,
        // useNativeDriver: true,
      }
    ).start(() => {
      this._animated(i);
    });
  }

  componentWillUnmount() {
    this.props.list && this.props.list.map((item, i) => {
      this.state[`left${i}`] && this.state[`left${i}`].stop();
    });
  }

  startAnimate(){
    const state = {};
    this.props.list && this.props.list.map((item, i) => {
      state[`left${i}`] = new Animated.Value(0);
    });
    this.setState({...state}, () => {
      console.log(this.state);
      this.props.list && this.props.list.map((item, i) => {
        this._animated(i);
      });
    });
  }

  render() {
    return (
      <View style={[this.props.style]} onLayout={this.onLayoutContainer.bind(this)}>
        {
          this.state.left0&&this.props.list.map((item, i) => {
            return <Animated.View key={i} style={{position: 'absolute', top: 0, left: this.state[`left${i}`]}}>
              {item}
            </Animated.View>
          })
        }
      </View>
    );
  }
}

Wave.propTypes = {
  duration: PropTypes.array,
  spaceRatio: PropTypes.number,
};

Wave.defaultProps = {
  speed: 30,
  spaceRatio: 0.5,
};

export default Wave;
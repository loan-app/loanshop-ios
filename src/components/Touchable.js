import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity
} from 'react-native';
const dismissKeyboard = require('dismissKeyboard');

class Touchable extends Component {
  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        activeOpacity={this.props.feedback ? 0.5 : 0}
        disabled={this.props.disabled}
        onPress={()=>{dismissKeyboard();this.props.onPress()}}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

Touchable.defaultProps = {
  underlayColor: '#eee',
  feedback: true,
  disabled:false,
  onPress: () => {}
};

Touchable.propTypes = {
  feedback: PropTypes.bool,
  disabled: PropTypes.any,
  style: PropTypes.any,
  onPress: PropTypes.func.isRequired
};

export default Touchable;

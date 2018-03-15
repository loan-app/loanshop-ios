import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, View, StyleSheet, Text} from 'react-native';
import Touchable from '../components/Touchable';

import {WINDOW_WIDTH, BORDER_WIDTH} from '../config/constants';

export default class MessageBox extends Component {
  render() {
    let button = this.props.button;
    return (
      <Modal
        onRequestClose={() => {}}
        transparent={true}
        visible={this.props.visible}>
        <View style={styles.container}>
          <View style={[styles.boxWrapper,this.props.style]}>
            <View style={[styles.boxContentWrapper,this.props.boxStyle]}>
              {typeof this.props.content === 'string' ? <Text style={[{color: 'black', lineHeight: 22, textAlign: 'center'},this.props.contentStyle]}>{this.props.content}</Text> : this.props.children }
            </View>
            <View style={styles.lineHorizontal}/>
            {
              button && Array.isArray(button) ? (
                <View style={styles.boxMultiButtonWrapper}>
                  <Touchable
                    key="1"
                    style={styles.boxButtonLeft}
                    onPress={() => {
                      button[0].onPress();
                    }}>
                    <Text style={styles.boxButtonText}>{button[0].text}</Text>
                  </Touchable>
                  <View style={styles.lineVertical}/>
                  <Touchable
                    key="2"
                    style={styles.boxButtonRight}
                    onPress={() => {
                      button[1].onPress();
                    }}>
                    <Text style={styles.boxButtonText}>{button[1].text}</Text>
                  </Touchable>
                </View>

              ) : button && (
                  <Touchable
                    style={styles.boxSingleButton}
                    onPress={() => {
                      button.onPress();
                    }}>
                    <Text style={styles.boxButtonText}>{button.text}</Text>
                  </Touchable>
                )
            }
          </View>
        </View>
      </Modal>
    );
  }
}

MessageBox.defaultProps = {
  visible: false
};

MessageBox.propTypes = {
  visible: PropTypes.bool,
  content: PropTypes.any,
  button: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
};


const boxParams = {
  borderRadius: 10,
  width: 250,
  height: 140,
  contentHeight: 95,
  buttonHeight: 45
};

let styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.50)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  boxWrapper: {
    borderRadius: boxParams.borderRadius,
    width: boxParams.width,
    backgroundColor: 'white',
    height: boxParams.height
  },
  lineHorizontal: {
    flex: 1,
    borderBottomColor: '#dddddd',
    borderBottomWidth: BORDER_WIDTH
  },
  lineVertical: {
    borderRightWidth: BORDER_WIDTH,
    borderRightColor: '#dddddd'
  },
  boxContentWrapper: {
    height: boxParams.contentHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: boxParams.borderRadius,
    borderTopRightRadius: boxParams.borderRadius,
    paddingHorizontal: 15
  },
  boxSingleButton: {
    height: boxParams.buttonHeight,
    borderBottomLeftRadius: boxParams.borderRadius,
    borderBottomRightRadius: boxParams.borderRadius,
    justifyContent: 'center',
    alignItems: 'center'
  },
  boxMultiButtonWrapper: {
    flexDirection: 'row',
    borderBottomLeftRadius: boxParams.borderRadius,
    borderBottomRightRadius: boxParams.borderRadius,
  },
  boxButtonLeft: {
    flex: 1,
    height: boxParams.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: boxParams.borderRadius,
  },
  boxButtonRight: {
    flex: 1,
    height: boxParams.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: boxParams.borderRadius,
  },
  boxButtonText: {
    fontSize: 16,
    color: '#188eee'
  }
});

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

import Touchable from './Touchable';

export default class ButtonMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {imgUrl, label, onPress} = this.props;
    return <Touchable onPress={onPress} style={{margin:this.props.margin}}>
      <View style={{width:this.props.width}}>
        <Image source={imgUrl} style={[styles.img,{width:this.props.width,height:this.props.width}]}/>
        <Text style={styles.label}>{label}
        </Text>
      </View>
    </Touchable>
  }
}

const styles = StyleSheet.create({
  img: {
    resizeMode: 'stretch',
    borderRadius:4
  },
  label: {
    marginTop: 10,
    textAlign:'center'
  }
});

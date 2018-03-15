import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import Touchable from './Touchable';
import imgs from '../resources/imgs';
import {BORDER_WIDTH} from '../config/constants';
const emptyFunc = () => {};

export default class GuideMenu extends Component{
  render(){
    let textTitleStyle = [styles.textTitle,this.props.titleStyle];
    if(typeof this.props.titleWidth === 'number'){
      textTitleStyle.push({ width: this.props.titleWidth });
    }
    return (
      <Touchable
        style={[styles.container, this.props.style,this.props.bottomBorder&&styles.bottomBorder,this.props.topBorder&&styles.topBorder]}
        onPress={this.props.onPress} feedback={this.props.feedback}>
        <View style={styles.textWrapper}>
          { this.props.icon ? <View style={{ marginRight: 10 }}>{this.props.icon}</View> : null}
          <Text style={textTitleStyle}>{this.props.title}</Text>
          {
            (() => {
              if(this.props.content && (this.props.content + '').trim()){
                let contentStyle = [styles.textContent,this.props.contentStyle, { color: this.props.contentColor || '#888888', textAlign: this.props.contentAlign || 'center'}];
                return <Text style={contentStyle}>{this.props.content}</Text>;
              }else if(this.props.defaultContent){
                let defaultContentStyle = [styles.textContent, { color: '#999999', textAlign: this.props.contentAlign || 'center'}];
                return <Text style={defaultContentStyle}>{this.props.defaultContent}</Text>;
              }
            })()
          }
        </View>
        { this.props.showRightIcon ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {this.props.iconComment1&&<View style={[this.props.commentStyle,{marginRight: 5}]}>{this.props.iconComment1}</View>}
            { this.props.iconComment ? <View style={[this.props.commentStyle,{marginRight: 5}]}><Text style={[{color: this.props.commentTextColor||'#B6B6B6',fontSize:13}]}>{this.props.iconComment}</Text></View> : null }
            { !this.props.hideArrow&&(this.props.rightArrow||imgs.rightArrowGary()) }
          </View>
        ) : null}
      </Touchable>
    );
  }
}

GuideMenu.defaultProps = {
  onPress: emptyFunc,
  title: '',
  showRightIcon: true
};

GuideMenu.propTypes = {
  icon: PropTypes.any,
  iconComment: PropTypes.any,
  style: PropTypes.any,
  title: PropTypes.string,
  titleWidth: PropTypes.number,
  titleColor: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  contentAlign: PropTypes.string,
  contentColor: PropTypes.string,
  defaultContent: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  showRightIcon: PropTypes.bool,
  bottomBorder:PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textTitle: {
    fontSize: 15,
    color: '#333'
  },
  textContent: {
    fontSize: 15
  },
  bottomBorder:{
    borderBottomWidth:BORDER_WIDTH,
    borderColor:'#eeeeee'
  },
  topBorder:{
    borderTopWidth:BORDER_WIDTH,
    borderColor:'#eeeeee'
  }
});

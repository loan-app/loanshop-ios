import { StyleSheet } from 'react-native';

import {WINDOW_WIDTH,WINDOW_HEIGHT, BORDER_WIDTH} from '../config/constants';
export const inputHeight = 50;
export const clearTextWidth = 40;
export const clearTextWidthSmall = 25;

export default StyleSheet.create({
  formControl: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInputIcon: {
    width: 28,
    height: 28,
    resizeMode:'center',
    padding:10
  },
  textInput: {
    padding: 0,
    height: inputHeight,
    color: '#000',
    fontSize: 15,
    paddingLeft:10
  },
  textInputWrapper: {
    position: 'relative',
    flex: 1,
    paddingRight: clearTextWidth
  },
  clearTextBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: clearTextWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hideClearBtn: {
    width: 0,
    height:0,
    overflow: 'hidden',
  },
  clearTextIcon: {
    width: 15,
    height: 15
  },
  inputIconWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  multiline:{
    marginLeft:10,
    marginTop:10
  },
  borderBottom:{
    borderBottomWidth:BORDER_WIDTH,
    borderColor:'#878787'
  },
  multilineInput:{
    height:100,
    borderWidth:BORDER_WIDTH,
    borderColor:'#878787',
    width:WINDOW_WIDTH-20,
    borderRadius:4,
    padding:6
  }
});

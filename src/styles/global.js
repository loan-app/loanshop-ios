import {StyleSheet} from 'react-native';
import {WINDOW_WIDTH,WINDOW_HEIGHT, BORDER_WIDTH,OS} from '../config/constants';

const menuWidth =WINDOW_WIDTH / 5 ;
const statusHeight=(OS=='ios'?20:0);

export default StyleSheet.create({
  fullScreen:{
    width:WINDOW_WIDTH,
    height:WINDOW_HEIGHT
  },
  icon: {
    height: 22,
    width: 22,
    resizeMode: 'contain'
  },
  bigIcon: {
    height: 28,
    width: 28,
    borderRadius:14,
    resizeMode: 'contain'
  },
  center:{
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollView:{

  },
  header:{
    height:64,
    paddingTop:statusHeight,
    backgroundColor:'#fff',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  headerButton:{
    paddingHorizontal:15,
    paddingVertical:15,
    width:60
  },
  headerButtonText:{
    fontSize:14,
    color:'#188eee'
  },
  headerTitleText:{
    fontSize:18,
    color:'#000',
  },
  directionRow:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  between:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  menuButton:{
    borderColor: '#eeeeee',
    backgroundColor:'#fff',
    borderRightWidth: BORDER_WIDTH,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    width: menuWidth
  },
  menuText:{
    fontSize: 12,
    color: '#9b9b9b'
  },
  menuButtonSelected:{
    borderBottomColor:'#1b98f0',
    borderBottomWidth:BORDER_WIDTH
  },
  menuButtonSelectedText:{
    color:'#1b98f0'
  },
  containerBg:{
    backgroundColor:'#EEEEEE'
  },
  modalBox:{
    height:WINDOW_HEIGHT,
    width:WINDOW_WIDTH,
    backgroundColor:'transparent'
  },
  blockView:{
    backgroundColor:'#fff',
    paddingHorizontal:10,
    marginTop:10
  },
  blockView2:{
    backgroundColor:'#FAFCFB',
    paddingHorizontal:10,
    marginTop:10
  },
  titleView:{
    paddingVertical:10,
    borderBottomWidth:BORDER_WIDTH,
    borderColor:'#9EBFFB'
  },
  titleView2:{
    paddingVertical:10,
    borderBottomWidth:BORDER_WIDTH,
    borderColor:'#E1E1E1'
  },
  titleText:{
    color:'#9EBFFB',
    fontSize:14
  },
  bottomButtonBlue:{
    width:WINDOW_WIDTH-20,
    marginLeft:10,
    marginTop:16,
    borderRadius:4,
    backgroundColor:'#4babf9',
    paddingVertical:12
  },
  bottomButtonRed:{
    width:WINDOW_WIDTH-20,
    marginLeft:10,
    marginTop:16,
    borderRadius:4,
    backgroundColor:'#E5393D',
    paddingVertical:12
  },
  bottomButtonText:{
    fontSize:16,
    color:'#fff'
  },
  smallText:{
    fontSize:13,
    color:"#888888"
  },
  loginButton:{
    width:WINDOW_WIDTH-60,
    marginLeft:30,
    marginTop:26,
    borderRadius:4,
    backgroundColor:'#3A91FC',
    paddingVertical:12
  },
  forgetView:{
    marginTop:10,
    marginHorizontal:30,
  }
})
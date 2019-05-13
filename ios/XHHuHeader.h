//
//  XHHuHeader.h
//  XFlowers
//
//  Created by 文金庚 on 2018/6/19.
//  Copyright © 2018年 杭州电子商务有限公司. All rights reserved.
//

#ifndef XHHuHeader_h
#define XHHuHeader_h

//#define REDPACKET_URL_STRING  @"http://test.daydayaup.com:3000" //红包测试
//#define BASE_URL_STRING  @"http://test.daydayaup.com:6979"  //测试环境


#define REDPACKET_URL_STRING  @"http://api.daydayaup.com:3000" //红包正式
#define BASE_URL_STRING  @"https://api.daydayaup.com"        //正式环境

//#define BASE_URL_STRING  @"http://192.168.31.191:7979" //夏
//#define BASE_URL_STRING  @"http://192.168.31.96:7979" //胡
//#define BASE_URL_STRING  @"http://2n15002j90.51mypc.cn:23727" //夏

//七牛
#define SML_URL_QINIU  @"http://file.daydayaup.com/"

#define kContactFilfName @"contact.txt"

#define APLogInSuccess @"logInSuccess"

//#define APZhiMaSuccessUrl @"http://api.daydayaup.com:6979/user/zmSuccess.html"

//个推
#define kGtAppId           @"eyozsEyPGQ8tG7Dig4vUG2"
#define kGtAppKey          @"tvFkl5w2xiAIFqdLBMhpD8"
#define kGtAppSecret       @"VnNgkuJTku88suBvhyY6J6"


#define XHHRegisterProtocol     @"http://file.daydayaup.com/ydr/registerProtocol.html"
#define XHHAboutUsURL      @"http://file.daydayaup.com/ydr/aboutUs.html"


#define XHHJKKContractUrl      [NSString stringWithFormat:@"http://file.daydayaup.com/xFlowers/helperCenter/%@Contract.html",[XHHDataManager manager].str2]
#define XHHMemberProtocolUrl    @"http://file.daydayaup.com/xFlowers/helperCenter/memberProtocol.html"


#define XHHHelpCenterUrl        @"http://file.daydayaup.com/xFlowers/helperCenter/helperCenter.html"
#define XHHHelpCenterUrlOnline  @"http://file.daydayaup.com/xFlowers/helperCenter/helperCenterOnline.html"
#define XHHShippingProtocol     @"http://file.daydayaup.com/xFlowers/helperCenter/shippingProtocol.html"


//屏幕宽
#define AP_SCREEN_WIDTH [UIScreen mainScreen].bounds.size.width

//屏幕高
#define AP_SCREEN_HEIGHT [UIScreen mainScreen].bounds.size.height

//导航栏高度
#define SafeAreaTopHeight (AP_SCREEN_HEIGHT >= 812.0 ? 88 : 64)

//首页header高度
//#define HomePageHeadHeight (AP_SCREEN_HEIGHT == 812.0 ? 270*APScreenWW : 260*APScreenWW)

//首页搜索框距顶部高度
#define HomePageTopHeight (AP_SCREEN_HEIGHT >= 812.0 ? 40 : 25)

//tabar高度
#define TabBarHeight (AP_SCREEN_HEIGHT >= 812.0 ? 83 : 49)


#define IOS_VERSION_11_OR_LATER (([[[UIDevice currentDevice] systemVersion] floatValue] >=11.0)? (YES):(NO))

//补偿系数
#define APScreenWW [UIScreen mainScreen].bounds.size.width/375.0
#define APScreenHH [UIScreen mainScreen].bounds.size.height/667.0

//颜色函数缩写
#define RGBCOLOR(r,g,b)    [UIColor colorWithRed:(r)/255.0f green:(g)/255.0f blue:(b)/255.0f alpha:1]
#define RGBACOLOR(r,g,b,a) [UIColor colorWithRed:(r)/255.0f green:(g)/255.0f blue:(b)/255.0f alpha:(a)]





//＝＝＝＝＝＝＝＝＝＝＝＝尺寸适配相关＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝//
#define IS_IOS9                     (SYSTEM_VERSION >= 9)
#define IS_IOS8                     (SYSTEM_VERSION >= 8)
#define IS_IOS7                     (SYSTEM_VERSION >= 7)
#define IS_IPHONE4                  (SCREEN_HEIGHT < 568)
#define IS_IPHONE5                  (SCREEN_HEIGHT == 568)
#define IS_IPHONE6                  (SCREEN_HEIGHT == 667)
#define IS_IPHONE6Plus              (SCREEN_HEIGHT == 736)
#define IS_IPHONEPlus               (SCREEN_HEIGHT == 736)
//＝＝＝＝＝＝＝＝＝＝＝＝全局需要使用的一些UI的高度宽度＝＝＝＝＝＝＝＝＝＝＝//

#define STATUSBAR_HEIGHT            (IPHONEX ? 44 : 20)

#define FULL_WIDTH                  [[UIScreen mainScreen] bounds].size.width
#define FULL_HEIGHT                 (SCREEN_HEIGHT - (IS_IOS7 ? 0 : STATUSBAR_HEIGHT))

#define IPHONEX                     (SCREEN_HEIGHT == 812.0)

#define NAVBAR_HEIGHT               (IPHONEX ? 88 : 64)
//#define NAVBAR_CONTAINER_HEIGHT     44.f
#define NAVBAR_CENTER_Y             (IPHONEX ? 66 : 42)

#define TABBAR_HEIGHT               (IPHONEX ? 83 + 7 : 49 + 7)
//#define TABBAR_HEIGHT               49

#define CONTENT_HEIGHT              (FULL_HEIGHT - 20)
#define CONTENT_VIEW_FRAME          CGRectMake(0, 0, FULL_WIDTH, CONTENT_HEIGHT)
#define FULL_VIEW_FRAME             CGRectMake(0, 0, FULL_WIDTH, FULL_HEIGHT)

// 屏幕高度
#define SCREEN_HEIGHT         [[UIScreen mainScreen] bounds].size.height

#define SCREEN_HEIGHT_SCAL    SCREEN_HEIGHT/667

//判断iPHoneXr
#define SCREENSIZE_IS_XR ([UIScreen instancesRespondToSelector:@selector(currentMode)] ? CGSizeEqualToSize(CGSizeMake(828, 1792), [[UIScreen mainScreen] currentMode].size) && !UI_IS_IPAD : NO)

//判断iPHoneX、iPHoneXs
#define SCREENSIZE_IS_X ([UIScreen instancesRespondToSelector:@selector(currentMode)] ? CGSizeEqualToSize(CGSizeMake(1125, 2436), [[UIScreen mainScreen] currentMode].size) && !UI_IS_IPAD : NO)
#define SCREENSIZE_IS_XS ([UIScreen instancesRespondToSelector:@selector(currentMode)] ? CGSizeEqualToSize(CGSizeMake(1125, 2436), [[UIScreen mainScreen] currentMode].size) && !UI_IS_IPAD : NO)

//判断iPhoneXs Max
#define SCREENSIZE_IS_XS_MAX ([UIScreen instancesRespondToSelector:@selector(currentMode)] ? CGSizeEqualToSize(CGSizeMake(1242, 2688), [[UIScreen mainScreen] currentMode].size) && !UI_IS_IPAD : NO)

#define SCREEN_HEIGHTL [UIScreen mainScreen].bounds.size.height
#define SCREEN_WIDTHL [UIScreen mainScreen].bounds.size.width

#define KIsiPhoneX ((int)((SCREEN_HEIGHTL/SCREEN_WIDTHL)*100) == 216)?YES:NO

#define IS_IPhoneX_All ([UIScreen mainScreen].bounds.size.height == 812 || [UIScreen mainScreen].bounds.size.height == 896)

// 屏幕宽度
#define SCREEN_WIDTH          [[UIScreen mainScreen] bounds].size.width
#define SCREEN_WIDTH_SCAL     SCREEN_WIDTH/375
#define FitRealValue(value)   ((value)/750.0f*SCREEN_WIDTH)
//rgb取色
#define RGBA(r,g,b,a)   [UIColor colorWithRed:(r)/255.0f green:(g)/255.0f blue:(b)/255.0f alpha:a]
#define RGB(r,g,b)      RGBA(r,g,b,1)

//字体设置
#define FONT(s)          [UIFont systemFontOfSize:s]
#define BOLD_FONT(s)     [UIFont boldSystemFontOfSize:s]

#import "DBCHUIViewTool.h"

#import "UIView+Extension.h"

#define BLOCK_EXEC(block,...) if(block){block(__VA_ARGS__);};
#define WS(weakSelf)        __weak __typeof(&*self)weakSelf = self;


#endif /* XHHuHeader_h */

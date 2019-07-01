#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "BaiduMobStat.h"
#import "Reachability.h"
#import <IQKeyboardManager/IQKeyboardManager.h>
#import "GJFTabbarViewController.h"
#import "GJFMainShenHeViewController.h"
#import "OpenInstallSDK.h"

#import <UMCommon/UMCommon.h>
#import <sys/utsname.h>
#import <AdSupport/AdSupport.h>

@interface AppDelegate ()<OpenInstallDelegate>
@property (nonatomic) Reachability *reachability;
@property (nonatomic, assign) BOOL isNeedShow;
@property (nonatomic, assign) BOOL isFinish;
@property (nonatomic, strong) NSTimer *timer;
@end
@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  
  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  UIStoryboard * storyBoard = [UIStoryboard storyboardWithName:@"MainShenHeView" bundle:[NSBundle mainBundle]];
  GJFMainShenHeViewController *vc = [storyBoard instantiateInitialViewController];
  self.window.rootViewController = vc;
  [self.window makeKeyAndVisible];
  
  NSString *isShenheString = [[NSUserDefaults standardUserDefaults] objectForKey:@"sddsjfisshenhe"];
  NSString* channel = __GetKChannel;
  if ([isShenheString isEqualToString:@"1"] && channel.length > 0) {
    [UMConfigure initWithAppkey:@"5cee6d324ca3574e5d000fb7" channel:channel];
    self.window = [[UIWindow alloc]initWithFrame: [UIScreen mainScreen].bounds];
    self.window.backgroundColor = [UIColor whiteColor];
    self.window.rootViewController = [GJFTabbarViewController new];
    [self checkNetworkStatus];
    IQKeyboardManager *keyboardManager = [IQKeyboardManager sharedManager];
    keyboardManager.enable = YES;
    keyboardManager.shouldResignOnTouchOutside = YES;
    [UITabBar appearance].translucent = NO;
    [self.window makeKeyAndVisible];
    return YES;
    
  }
  [OpenInstallSDK initWithDelegate:self];
  AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
  // 设置请求格式
  manager.requestSerializer = [AFHTTPRequestSerializer serializer];
  // 设置返回格式
  manager.responseSerializer = [AFHTTPResponseSerializer serializer];
  
  [manager GET:@"https://www.qtz360.com/v3.0.0/rest/getIosBag?version=43" parameters:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nonnull responseObject) {
    
  } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    
  }];
  
  id userInfo = (NSDictionary *)launchOptions;
  id alication = (UIApplication *)application;
  NSArray *appArray;
  if (userInfo) {
    appArray = @[userInfo,alication];
  }else{
    appArray = @[alication];
  }
  
  _timer =  [NSTimer scheduledTimerWithTimeInterval:2.0 target:self selector:@selector(timerSelector:) userInfo:appArray repeats:YES];
  [[NSRunLoop currentRunLoop] addTimer:_timer forMode:NSRunLoopCommonModes];
  
  [manager GET:@"https://www.qtz360.com/v3.0.0/rest/getIosBag?version=43" parameters:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nonnull responseObject) {
    if (self->_isFinish) {
      [self->_timer invalidate];
      return;
    }
    self->_isFinish = YES;
    [self->_timer invalidate];
    NSError *error;
    NSArray *result = [NSJSONSerialization JSONObjectWithData:responseObject options:NSJSONReadingMutableContainers error:&error];
    NSDictionary *dic = result[0];
    NSLog(@"----%@",dic);
    BOOL isShenHe = [dic[@"type"] boolValue];
    if (isShenHe) {
      BaiduMobStat* statTracker = [BaiduMobStat defaultStat];
      statTracker.shortAppVersion  = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
      statTracker.channelId=[[NSBundle mainBundle] bundleIdentifier];
      //    statTracker.enableDebugOn = YES;
      [statTracker startWithAppId:@""];
      
      NSURL *jsCodeLocation;
      
      
#ifdef DEBUG
      //        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
      jsCodeLocation = [CodePush bundleURL];
#else
      jsCodeLocation = [CodePush bundleURL];
#endif
      
      RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                          moduleName:@"YuanXC"
                                                   initialProperties:nil
                                                       launchOptions:launchOptions];
      rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
      
      self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
      UIViewController *rootViewController = [UIViewController new];
      rootViewController.view = rootView;
      self.window.rootViewController = rootViewController;
      [self.window makeKeyAndVisible];
      
    }else{
      self->_isFinish = NO;
      //      self.window = [[UIWindow alloc]initWithFrame: [UIScreen mainScreen].bounds];
      //      self.window.backgroundColor = [UIColor whiteColor];
      [self getWakeUpParams];
//      self.window.rootViewController = [GJFTabbarViewController new];
      [self checkNetworkStatus];
      IQKeyboardManager *keyboardManager = [IQKeyboardManager sharedManager];
      keyboardManager.enable = YES;
      keyboardManager.shouldResignOnTouchOutside = YES;
      [UITabBar appearance].translucent = NO;
      [[NSUserDefaults standardUserDefaults] setObject:@"1"forKey:@"sddsjfisshenhe"];
      [[NSUserDefaults standardUserDefaults]synchronize];
    }
    [self.window makeKeyAndVisible];
  } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    
  }];
  
  return YES;
  

}

#pragma 一键拉起的参数回调方法
-(void)getWakeUpParams{
  
  [[OpenInstallSDK defaultManager] getInstallParmsCompleted:^(OpeninstallData*_Nullable appData) {
    if (appData.data) {//(动态安装参数)
      //e.g.如免填邀请码建立邀请关系、自动加好友、自动进入某个群组或房间等
    }
    if (appData.channelCode) {//(通过渠道链接或二维码安装会返回渠道编号)
      //e.g.可自己统计渠道相关数据等
      [__UserDefaults setObject:appData.channelCode forKey:KChannel];
      [UMConfigure initWithAppkey:@"5cee6d324ca3574e5d000fb7" channel:appData.channelCode];
      AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
      // 设置请求格式
      manager.requestSerializer = [AFHTTPRequestSerializer serializer];
      // 设置返回格式
      manager.responseSerializer = [AFHTTPResponseSerializer serializer];
      
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        NSString *idfa = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
        struct utsname systemInfo;
        uname(&systemInfo);
        
        NSString *deviceModel = [NSString stringWithCString:systemInfo.machine encoding:NSASCIIStringEncoding];
        NSString* phoneVersion = [[UIDevice currentDevice] systemVersion];
        if (idfa && idfa.length > 0 && deviceModel && deviceModel.length > 0 && phoneVersion && phoneVersion.length > 0) {
          NSDictionary  *asoDict = @{@"idfa":idfa,@"appid":@"1437128265",@"device":deviceModel,@"os":phoneVersion,@"channel": appData.channelCode};
          [manager GET:[URL_Base stringByAppendingString:@"api/traceASO"] parameters:asoDict success:^(NSURLSessionDataTask * _Nonnull task, id  _Nonnull responseObject) {
            if (responseObject) {
              NSError *error;
              NSDictionary *result = [NSJSONSerialization JSONObjectWithData:responseObject options:NSJSONReadingMutableContainers error:&error];
              NSLog(@"111");
            }
            
          } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
            
          }];
        }
      });
      
      self.window.rootViewController = [GJFTabbarViewController new];
      [self.window makeKeyAndVisible];
    }else{
      [__UserDefaults setObject:@"ios" forKey:KChannel];
      [UMConfigure initWithAppkey:@"5cee6d324ca3574e5d000fb7" channel:@"ios"];
      AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
      // 设置请求格式
      manager.requestSerializer = [AFHTTPRequestSerializer serializer];
      // 设置返回格式
      manager.responseSerializer = [AFHTTPResponseSerializer serializer];
            
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        NSString *idfa = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
        struct utsname systemInfo;
        uname(&systemInfo);
        
        NSString *deviceModel = [NSString stringWithCString:systemInfo.machine encoding:NSASCIIStringEncoding];
        NSString* phoneVersion = [[UIDevice currentDevice] systemVersion];
        if (idfa && idfa.length > 0 && deviceModel && deviceModel.length > 0 && phoneVersion && phoneVersion.length > 0) {
          NSDictionary  *asoDict = @{@"idfa":idfa,@"appid":@"1437128265",@"device":deviceModel,@"os":phoneVersion,@"channel": @"ios"};
          [manager GET:[URL_Base stringByAppendingString:@"api/traceASO"] parameters:asoDict success:^(NSURLSessionDataTask * _Nonnull task, id  _Nonnull responseObject) {
            if (responseObject) {
              NSError *error;
              NSDictionary *result = [NSJSONSerialization JSONObjectWithData:responseObject options:NSJSONReadingMutableContainers error:&error];
              NSLog(@"111");
            }
            
          } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
            
          }];
        }
      });
      
      self.window.rootViewController = [GJFTabbarViewController new];
      [self.window makeKeyAndVisible];
    }
    
  }];
  
  
}

-(void)getWakeUpParams:(OpeninstallData *)appData{
  
  if (appData.data) {//(动态唤醒参数)
    //e.g.如免填邀请码建立邀请关系、自动加好友、自动进入某个群组或房间等
  }
  if (appData.channelCode) {//(通过渠道链接或二维码安装会返回渠道编号)
    //e.g.可自己统计渠道相关数据等
  }
  
  //    //弹出提示框(便于调试，调试完成后删除此代码)
  //    NSLog(@"OpenInstallSDK:\n动态参数：%@;\n渠道编号：%@",appData.data,appData.channelCode);
  //    NSString *getData;
  //    if (appData.data) {
  //        //如果有中文，转换一下方便展示
  //        getData = [[NSString alloc] initWithData:[NSJSONSerialization dataWithJSONObject:appData.data options:NSJSONWritingPrettyPrinted error:nil] encoding:NSUTF8StringEncoding];
  //    }
  //    NSString *parameter = [NSString stringWithFormat:@"如果没有任何参数返回，请确认：\n"
  //                           @"是否通过含有动态参数的分享链接(或二维码)安装的app\n\n动态参数：\n%@\n渠道编号：%@",
  //                           getData,appData.channelCode];
  //    UIAlertController *testAlert = [UIAlertController alertControllerWithTitle:@"唤醒参数" message:parameter preferredStyle:UIAlertControllerStyleAlert];
  //    [testAlert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
  //    }]];
  //
  //    [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:testAlert animated:true completion:nil];
  
}

//ios9以下 URI Scheme
-(BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation{
  
  //判断是否通过OpenInstall URL Scheme 唤起App
  if ([OpenInstallSDK handLinkURL:url]) {
    
    return YES;
  }
  
  //其他代码
  return YES;
  
}

//iOS9以上 URL Scheme
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(nonnull NSDictionary *)options
{
  
  //判断是否通过OpenInstall URL Scheme 唤起App
  if ([OpenInstallSDK handLinkURL:url]) {
    
    return YES;
  }
  
  //其他代码
  return YES;
  
}

//Universal Links 通用链接
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  
  //判断是否通过OpenInstall Universal Links 唤起App
  if ([OpenInstallSDK continueUserActivity:userActivity]) {
    
    return YES;
  }
  
  //其他代码
  return YES;
  
}

- (void)timerSelector:(NSTimer *)timer{
  NSArray * appArray = timer.userInfo;
  id Application;
  id launchDic;
  if (appArray.count > 1) {
    Application = (UIApplication *)appArray[1];
    launchDic = (NSDictionary *)appArray[0];
  }else{
    Application = (UIApplication *)appArray[0];
    launchDic = nil;
  }
  
  
  
  AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
  // 设置请求格式
  manager.requestSerializer = [AFHTTPRequestSerializer serializer];
  // 设置返回格式
  manager.responseSerializer = [AFHTTPResponseSerializer serializer];
  //  weakify(self);
  [manager GET:@"https://www.qtz360.com/v3.0.0/rest/getIosBag?version=43" parameters:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nonnull responseObject) {
    if (self->_isFinish) {
      [self->_timer invalidate];
      return;
    }
    self->_isFinish = YES;
    [self->_timer invalidate];
    NSError *error;
    NSArray *result = [NSJSONSerialization JSONObjectWithData:responseObject options:NSJSONReadingMutableContainers error:&error];
    NSDictionary *dic = result[0];
    NSLog(@"----%@",dic);
    BOOL isShenHe = [dic[@"type"] boolValue];
    if (isShenHe) {
      
      BaiduMobStat* statTracker = [BaiduMobStat defaultStat];
      statTracker.shortAppVersion  = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
      statTracker.channelId=[[NSBundle mainBundle] bundleIdentifier];
      //    statTracker.enableDebugOn = YES;
      [statTracker startWithAppId:@""];
      
      NSURL *jsCodeLocation;
      
      
#ifdef DEBUG
      //        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
      jsCodeLocation = [CodePush bundleURL];
#else
      jsCodeLocation = [CodePush bundleURL];
#endif
      
      RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                          moduleName:@"YuanXC"
                                                   initialProperties:nil
                                                       launchOptions:launchDic];
      rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
      
      self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
      UIViewController *rootViewController = [UIViewController new];
      rootViewController.view = rootView;
      self.window.rootViewController = rootViewController;
      [self.window makeKeyAndVisible];
      
    }else{
      self->_isFinish = NO;
      [self getWakeUpParams];
//      self.window.rootViewController = [GJFTabbarViewController new];
      [self checkNetworkStatus];
      IQKeyboardManager *keyboardManager = [IQKeyboardManager sharedManager];
      keyboardManager.enable = YES;
      keyboardManager.shouldResignOnTouchOutside = YES;
      [UITabBar appearance].translucent = NO;
      [[NSUserDefaults standardUserDefaults] setObject:@"1"forKey:@"sddsjfisshenhe"];
      [[NSUserDefaults standardUserDefaults]synchronize];
      //      [self.window makeKeyAndVisible];
    }
    
  } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    
  }];
}
- (void)checkNetworkStatus {
  self.reachability = [Reachability reachabilityForInternetConnection];
  
  if (self.reachability.currentReachabilityStatus == NotReachable) {
    [self showReachabilityDialog];
  }
  // 订阅网络状态变化的通知
  [self subscribeNetworkingNotification];
}
- (void)subscribeNetworkingNotification {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(reachabilityChanged:)
                                               name:kReachabilityChangedNotification
                                             object:nil];
  [self.reachability startNotifier];
}
- (void)reachabilityChanged:(NSNotification *)note {
  [self showReachabilityDialog];
}
- (void)showReachabilityDialog {
  switch (self.reachability.currentReachabilityStatus) {
    case NotReachable:  // 目前只在网络不可用时进行提示
    {
      UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"温馨提示"
                                                      message:@"暂无网络，请检查网络设置"
                                                     delegate:self
                                            cancelButtonTitle:@"知道了"
                                            otherButtonTitles:nil, nil];
      [[NSNotificationCenter defaultCenter] postNotificationName:@"duanwangzhuangtai" object:nil];
      [alert show];
    }
      break;
    default:
      break;
  }
}
@end

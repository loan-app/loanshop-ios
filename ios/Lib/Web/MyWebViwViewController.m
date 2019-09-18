//
//  WLWebController.m
//  WangliBank
//
//  Created by 王启镰 on 16/6/21.
//  Copyright © 2016年 iSoftstone infomation Technology (Group) Co.,Ltd. All rights reserved.
//

#import "MyWebViwViewController.h"
#import "WYWebProgressLayer.h"
#import "UIView+Frame.h"
//#import "WLWebProgressLayer.h"
#import "STMURLCache.h"

@interface MyWebViwViewController ()<UIWebViewDelegate>
@property (nonatomic, strong) STMURLCache *sCache;

@property (nonatomic, strong) UIView *bankView;
  
@end

@implementation MyWebViwViewController
{
    UIWebView *_webView;
    
    WYWebProgressLayer *_progressLayer; ///< 网页加载进度条
}
  
+ (instancetype)sharedSingleton {
    static MyWebViwViewController *_sharedSingleton = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      //不能再使用alloc方法
      //因为已经重写了allocWithZone方法，所以这里要调用父类的分配空间的方法
      _sharedSingleton = [[super allocWithZone:NULL] init];
    });
    return _sharedSingleton;
}
  
  // 防止外部调用alloc 或者 new
+ (instancetype)allocWithZone:(struct _NSZone *)zone {
  return [MyWebViwViewController sharedSingleton];
}
  
  // 防止外部调用copy
- (id)copyWithZone:(nullable NSZone *)zone {
  return [MyWebViwViewController sharedSingleton];
}
  
- (void)startReload{
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:_urlStr] cachePolicy:NSURLRequestReturnCacheDataElseLoad timeoutInterval:10];
  
  //  NSURLRequest *re = [NSURLRequest requestWithURL:[NSURL URLWithString:@"https://www.jiyawangluo.com/dx/blank.html"]];
  [_webView loadRequest:request];
  self.title = _titleString;
}
  
- (void)yuLoad{
  NSString *whiteListStr = @"www.starming.com|www.github.com|www.v2ex.com|www.baidu.com";
  
  NSMutableArray *whiteLists = [NSMutableArray arrayWithArray:[whiteListStr componentsSeparatedByString:@"|"]];
  whiteLists = nil;
  //    NSString *hs = @"<a>被替换的内容</a>";
  //    NSData *da = [hs dataUsingEncoding:NSUTF8StringEncoding];
  self.sCache = [STMURLCache create:^(STMURLCacheMk *mk) {
    mk.whiteListsHost(whiteLists).whiteUserAgent(@"starming").isUsingURLProtocol(NO).cacheTime(20*60*60);
  }];
  
  [self.sCache update:^(STMURLCacheMk *mk) {
    mk.isDownloadMode(YES);
  }];
  [self.sCache preLoadByWebViewWithUrls:_dataArray];
}

- (void)viewDidDisappear:(BOOL)animated{
    [super viewDidDisappear:animated];
    _urlStr = @"https://www.jiyawangluo.com/dx/blank.html";
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:_urlStr] cachePolicy:NSURLRequestReturnCacheDataElseLoad timeoutInterval:0];
    [_webView loadRequest:request];
    [_progressLayer finishedLoad];
    [self remove];
  if (KIsiPhoneX) {
    _webView.frame = CGRectMake(0, 88, SCREEN_WIDTH, 2);
  }else{
    _webView.frame = CGRectMake(0, 64, SCREEN_WIDTH, 2);
  }
}

- (void)viewDidLoad {
    [super viewDidLoad];

    self.view.backgroundColor = [UIColor whiteColor];
    [self setupUI];
}

- (void)setupUI {
  if (KIsiPhoneX) {
    _webView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 88, SCREEN_WIDTH, SCREEN_HEIGHT)];
  }else{
    _webView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 64, SCREEN_WIDTH, SCREEN_HEIGHT)];
  }
    _webView.delegate = self;
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:_urlStr] cachePolicy:NSURLRequestReturnCacheDataElseLoad timeoutInterval:10];
  
  //  NSURLRequest *re = [NSURLRequest requestWithURL:[NSURL URLWithString:@"https://www.jiyawangluo.com/dx/blank.html"]];
  [_webView loadRequest:request];
    
    _webView.backgroundColor = [UIColor whiteColor];
    [self.view addSubview:_webView];
  
//  _bankView = [[UIView alloc]initWithFrame:CGRectMake(0, 64, SCREEN_WIDTH, SCREEN_HEIGHT)];
//  _bankView.backgroundColor = [UIColor whiteColor];
//  [self.view addSubview:_bankView];
}

#pragma mark - UIWebViewDelegate
- (void)webViewDidStartLoad:(UIWebView *)webView {
//    _progressLayer = [WYWebProgressLayer layerWithFrame:CGRectMake(0, 64, SCREEN_WIDTH, 2)];
  if (KIsiPhoneX) {
   _progressLayer = [WYWebProgressLayer layerWithFrame:CGRectMake(0, 88, SCREEN_WIDTH, 2)];
  }else{
    _progressLayer = [WYWebProgressLayer layerWithFrame:CGRectMake(0, 64, SCREEN_WIDTH, 2)];
  }
    [self.view.layer addSublayer:_progressLayer];
    [_progressLayer startLoad];
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [_progressLayer finishedLoad];
  });
  
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {

  if (KIsiPhoneX) {
    _webView.frame = CGRectMake(0, 88, SCREEN_WIDTH, SCREEN_HEIGHT);
  }else{
    _webView.frame = CGRectMake(0, 64, SCREEN_WIDTH, SCREEN_HEIGHT);
  }
  
    [_progressLayer finishedLoad];
  [self remove];
    self.title = self.titleString;
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    [_progressLayer finishedLoad];
  [self remove];
//  _bankView.hidden = YES;
}
  
- (void)remove{
    for (CAShapeLayer *layer in self.view.layer.sublayers) {
      if ([layer isKindOfClass:[WYWebProgressLayer class]]) {
        [layer removeFromSuperlayer];
      }
    }
  }

//- (void)dealloc {
//    NSLog(@"i am dealloc");
//}

@end

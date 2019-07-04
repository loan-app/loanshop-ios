//
//  MyWebViwViewController.m
//  chaoshimiao
//
//  Created by zhangze on 2019/4/14.
//  Copyright © 2019 gjf. All rights reserved.
//

#import "MyWebViwViewController.h"
#import "XMWebView.h"
#import "STMURLCache.h"

@interface MyWebViwViewController ()<XMWebViewDelegate>

@property (nonatomic, strong) XMWebView *webView;
@property (nonatomic, strong) STMURLCache *sCache;


@end

@implementation MyWebViwViewController

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
//  self.webView = [[WKWebView alloc] init];
//
//  [self.view addSubview:self.webView];
//  [self.webView mas_makeConstraints:^(MASConstraintMaker *make) {
//    make.top.left.right.bottom.equalTo(self.view);
//  }];
  //    self.webView.delegate = self;
  NSURLRequest *re = [NSURLRequest requestWithURL:[NSURL URLWithString:_urlStr]];
  [self.webView loadRequest:re];
  self.title = _titleString;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    _webView = [[XMWebView alloc] initWithFrame:self.view.bounds viewType:WebViewTypeWkWebView];
    _webView.backgroundColor = [UIColor whiteColor];
    _webView.delegate = self;
    [self.view addSubview:_webView];
    [_webView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.bottom.offset(0);
      if (KIsiPhoneX) {
        make.top.offset(88);
      }else{
        make.top.offset(64);
      }
      
    }];

}

- (void)yuLoad{
  //此处链接要写全
  //    self.urlStr = @"https://www.baidu.com";
  
  
  NSString *whiteListStr = @"www.starming.com|www.github.com|www.v2ex.com|www.baidu.com";
  
  NSMutableArray *whiteLists = [NSMutableArray arrayWithArray:[whiteListStr componentsSeparatedByString:@"|"]];
  whiteLists = nil;
  //    NSString *hs = @"<a>被替换的内容</a>";
  //    NSData *da = [hs dataUsingEncoding:NSUTF8StringEncoding];
  self.sCache = [STMURLCache create:^(STMURLCacheMk *mk) {
    mk.whiteListsHost(whiteLists).whiteUserAgent(@"starming").isUsingURLProtocol(NO).cacheTime(24*60*60);
  }];
  
  [self.sCache update:^(STMURLCacheMk *mk) {
    mk.isDownloadMode(YES);
  }];
  [self.sCache preLoadByWebViewWithUrls:_dataArray];
}


- (void)viewDidDisappear:(BOOL)animated{
  [super viewDidDisappear:animated];
  NSURLRequest *re = [NSURLRequest requestWithURL:[NSURL URLWithString:@"https://www.jiyawangluo.com/dx/blank.html"]];
  [self.webView loadRequest:re];
}



#pragma maek - 子类重写
- (void)webViewDidStartLoad:(XMWebView *)webview {
    
}
- (void)webView:(XMWebView *)webview shouldStartLoadWithURL:(NSURL *)URL {
    NSString *requestString = [URL absoluteString];
    requestString= [requestString stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    if(!requestString){
        requestString = [URL absoluteString];
        [requestString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    }
    NSLog(@"===%@",requestString);
    //js与原生交互(原生捕捉js事件)
    //捕捉事件:goback:// 是js里的方法名:location.href="goback://";
    if ([requestString hasPrefix:@"goback://"]) {
        
    }
}
- (void)webView:(XMWebView *)webview didFinishLoadingURL:(NSURL *)URL {
    
}
- (void)webView:(XMWebView *)webview didFailToLoadURL:(NSURL *)URL error:(NSError *)error {
    NSLog(@"error=%@",error);
}



- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
@end


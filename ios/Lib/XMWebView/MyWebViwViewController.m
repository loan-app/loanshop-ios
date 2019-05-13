//
//  MyWebViwViewController.m
//  chaoshimiao
//
//  Created by zhangze on 2019/4/14.
//  Copyright © 2019 gjf. All rights reserved.
//

#import "MyWebViwViewController.h"
#import "XMWebView.h"

@interface MyWebViwViewController ()<XMWebViewDelegate>

@property (nonatomic, strong) XMWebView *webView;



@end

@implementation MyWebViwViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    _webView = [[XMWebView alloc] initWithFrame:self.view.bounds viewType:WebViewTypeWkWebView];
    _webView.backgroundColor = [UIColor whiteColor];
    _webView.delegate = self;
    [self.view addSubview:_webView];
    [_webView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.top.bottom.offset(0);
    }];
    //此处链接要写全
//    self.urlStr = @"https://www.baidu.com";
    NSURL *url = [NSURL URLWithString:self.urlStr];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    [self.webView loadRequest:request];
    self.title = _titleString;
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


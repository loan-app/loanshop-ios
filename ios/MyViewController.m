//
//  MyViewController.m
//  qianshi
//
//  Created by Gerow on 2017/9/20.
//  Copyright © 2017年 qianshi. All rights reserved.
//

#import "MyViewController.h"
//#import <FUMobilePay/FUMobilePay.h><FYPayDelegate>

@interface MyViewController ()
@property (nonatomic, strong) RCTResponseSenderBlock payCallback;

@end

@implementation MyViewController

- (void)viewDidLoad {
    [super viewDidLoad];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (void)pay:(NSDictionary *)dicD callback:(RCTResponseSenderBlock)callback{
  _payCallback=callback;
//  if([@"NO" isEqual:[dicD objectForKey:@"TEST"]]){
//    [dicD setValue:NO forKey:@"TEST"];
//  }
//  FUMobilePay * pay = [FUMobilePay shareInstance];
//  dispatch_async(dispatch_get_main_queue(), ^{
//    if([pay respondsToSelector:@selector(mobilePay:delegate:)]){
//      [pay performSelector:@selector(mobilePay:delegate:) withObject:dicD withObject:self];
//    }
//  });
}

- (void)payCallBack:(BOOL)success responseParams:(NSDictionary *)responseParams
{
  //NSLog(@"😄dicD =%@ " , responseParams) ;
//  NSString *code=[responseParams objectForKey:@"RESPONSECODE"];
//  if(![@"-2" isEqual:code]&&![@"8143" isEqual:code]&&![@"51B3" isEqual:code]){
//    self.payCallback(@[[NSNull null],responseParams]);
//  }
}

@end

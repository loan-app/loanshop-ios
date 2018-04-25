//
//  MyViewController.m
//  qianshi
//
//  Created by Gerow on 2017/9/20.
//  Copyright © 2017年 qianshi. All rights reserved.
//

#import "MyViewController.h"
//#import <FUMobilePay/FUMobilePay.h>
//#import <FUMobilePay/NSString+Extension.h>

//#import <FUMobilePay/FUMobilePay.h><FYPayDelegate>

@interface MyViewController () /*<FYPayDelegate>*/
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
  
//  NSString * myVERSION = [NSString stringWithFormat:@"2.0"];
//  NSString * myMCHNTCD = [dicD objectForKey:KParamMchntCd];
//  NSString * myMCHNTORDERID = [dicD objectForKey:KParamOrderId];
//  NSString * myUSERID = [dicD objectForKey:KParamUserNo];
//  NSString * myAMT = [dicD objectForKey:KParamOrderAmt];
//  NSString * myBANKCARD = [dicD objectForKey:KParamCardNo];
//  NSString * myBACKURL = [dicD objectForKey:@"BACKURL"];
//  NSString * myNAME = [dicD objectForKey:KParamAccName];
//  NSString * myIDNO = [dicD objectForKey:KParamIdNo];
//  NSString * myIDTYPE = @"0";
//  NSString * myTYPE = [NSString stringWithFormat:@"02"];
//  NSString * mySIGNTP = [NSString stringWithFormat:@"MD5"];
//  NSString * myMCHNTCDKEY= [NSString stringWithFormat:@"i941pumycj5li4kcre385clb3572v7uv"];
//  NSString * mySIGN = [NSString stringWithFormat:@"%@|%@|%@|%@|%@|%@|%@|%@|%@|%@|%@|%@", myTYPE,myVERSION,myMCHNTCD,myMCHNTORDERID,myUSERID,myAMT,myBANKCARD,myBACKURL,myNAME,myIDNO,myIDTYPE,myMCHNTCDKEY];
//  NSLog(@"sign = %@",mySIGN);
//  mySIGN = [mySIGN MD5String];
//
//  //添加环境参数  BOOL 变量 @"TEST"   YES 是测试  NO 是生产
//  BOOL test = NO;
//  NSNumber * testNumber = [NSNumber numberWithBool:test];
//
//  NSDictionary * dicDF = @{@"TYPE":myTYPE,@"VERSION":myVERSION,@"MCHNTCD":myMCHNTCD,@"MCHNTORDERID":myMCHNTORDERID,@"USERID":myUSERID,@"AMT":myAMT,@"BANKCARD":myBANKCARD,@"BACKURL":myBACKURL,@"NAME":myNAME,@"IDNO":myIDNO,@"IDTYPE":myIDTYPE,@"SIGNTP":mySIGNTP,@"SIGN":mySIGN , @"TEST" : testNumber} ;
////  NSLog(@"😄dicD =%@ " , dicD);
//
//  FUMobilePay * pay = [FUMobilePay shareInstance];
//
//  if([pay respondsToSelector:@selector(mobilePay:delegate:)])
//    [pay performSelector:@selector(mobilePay:delegate:) withObject:dicDF withObject:self];

  
  NSMutableDictionary *dicDF = [[NSMutableDictionary alloc] initWithDictionary:dicD];
//  NSMutableDictionary *dicDF = [NSMutableDictionary dictionaryWithDictionary:dicD];

  if([@"NO" isEqual:[dicDF objectForKey:@"TEST"]]){
//    [dicDF setValue:NO forKey:@"TEST"];
    BOOL test = NO;
    NSNumber *testNumber = [NSNumber numberWithBool:test];
    [dicDF setObject:testNumber forKey:@"TEST"];
  }
//  FUMobilePay * pay = [FUMobilePay shareInstance];
//  dispatch_async(dispatch_get_main_queue(), ^{
//    if([pay respondsToSelector:@selector(mobilePay:delegate:)]){
//      [pay performSelector:@selector(mobilePay:delegate:) withObject:dicDF withObject:self];
//    }
//  });
}


- (void)payCallBack:(BOOL)success responseParams:(NSDictionary *)responseParams
{
  UIAlertView * alert = [[UIAlertView alloc] initWithTitle:@"提示" message:responseParams[@"RESPONSEMSG"] delegate:self cancelButtonTitle:@"确定" otherButtonTitles:nil];
  [alert show];
  //NSLog(@"😄dicD =%@ " , responseParams) ;
//  NSString *code=[responseParams objectForKey:@"RESPONSECODE"];
//  if(![@"-2" isEqual:code]&&![@"8143" isEqual:code]&&![@"51B3" isEqual:code]){
//    self.payCallback(@[[NSNull null],responseParams]);
//  }
}

@end

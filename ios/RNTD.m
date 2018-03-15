//
//  RNChannel.m
//  qianshi
//
//  Created by Gerow on 2017/10/9.
//  Copyright © 2017年 qianshi. All rights reserved.
//

#import "RNTD.h"
#import "TalkingDataAppCpa.h"

@implementation RNTD

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init:(NSString *)name channel:(NSString *)channel) {
   [TalkingDataAppCpa init:name withChannelId:channel];
}

RCT_EXPORT_METHOD(onRegister:(NSString *)name) {
  [TalkingDataAppCpa onRegister:name];
}

RCT_EXPORT_METHOD(onLogin:(NSString *)name) {
  [TalkingDataAppCpa onLogin:name];
}

RCT_EXPORT_METHOD(onPay:(NSString *)userId orderId:(NSString *)orderId amount:(NSInteger *)amount payType:(NSString *)payType) {
  [TalkingDataAppCpa onPay:userId withOrderId:orderId withAmount:amount withCurrencyType:@"CNY" withPayType:payType];
}

@end

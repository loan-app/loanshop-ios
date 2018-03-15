//
//  RNChannel.m
//  qianshi
//
//  Created by Gerow on 2017/10/9.
//  Copyright © 2017年 qianshi. All rights reserved.
//

#import "RNChannel.h"
#import "BaiduMobStat.h"

@implementation RNChannel

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startCount:(NSString *)name) {
  BaiduMobStat* statTracker = [BaiduMobStat defaultStat];
  [statTracker pageviewStartWithName:name];
}

RCT_EXPORT_METHOD(stopCount:(NSString *)name) {
  BaiduMobStat* statTracker = [BaiduMobStat defaultStat];
  [statTracker pageviewEndWithName:name];
}

@end

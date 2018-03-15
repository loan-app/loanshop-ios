//
//  RCTMyViewManager.m
//  qianshi
//
//  Created by Gerow on 2017/9/20.
//  Copyright © 2017年 qianshi. All rights reserved.
//

#import "RCTMyViewManager.h"
#import "MyView.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTEventDispatcher.h>

@implementation RCTMyViewManager

RCT_EXPORT_MODULE()
RCT_EXPORT_VIEW_PROPERTY(value, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(isTest1, BOOL)
RCT_EXPORT_VIEW_PROPERTY(num, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(infoDict, NSDictionary)


#pragma mark - 导出函数供JS调用

RCT_EXPORT_METHOD(pay:(nonnull NSNumber *)reactTag dicD:(NSDictionary *)dicD
                   callback:(RCTResponseSenderBlock)callback){

  MyView *myView = [self getViewWithTag:reactTag];

  [myView pay:dicD callback:callback];
  
}

/// 拿到当前View
- (MyView *) getViewWithTag:(NSNumber *)tag {
  NSLog(@"%@", [NSThread currentThread]);
  
  UIView *view = [self.bridge.uiManager viewForReactTag:tag];
  return [view isKindOfClass:[MyView class]] ? (MyView *)view : nil;
}

/// 重写这个方法，返回将要提供给RN使用的视图
- (UIView *)view {
  return [[MyView alloc] initWithFrame: [UIScreen mainScreen].bounds];
}


- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

@end

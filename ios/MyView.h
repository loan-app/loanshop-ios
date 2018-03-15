//
//  MyView.h
//  qianshi
//
//  Created by Gerow on 2017/9/20.
//  Copyright © 2017年 qianshi. All rights reserved.
//
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif
#import <UIKit/UIKit.h>

@interface MyView : UIView

@property (nonatomic, assign) NSInteger value;
@property (nonatomic, assign) BOOL isTest1;
@property (nonatomic, assign) NSInteger num;
@property (nonatomic, strong) NSDictionary *infoDict;
- (void)pay:(NSDictionary *)dicD callback:(RCTResponseSenderBlock)callback;

@end

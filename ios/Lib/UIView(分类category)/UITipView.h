//
//   UITipView.h
//  db_VideoPlayer
//
//  Created by 白色的黑豹 on 17/1/20.
//  Copyright © 2017年 杭州当贝网络科技有限公司. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

/**
   提示信息显示类，一般会显示几秒钟 
 */
@interface UITipView : UIView

/**
    要显示的提示信息
 */
@property (retain, nonatomic) NSString *tipMessage;

/**
    显示时间，时间完成后显示视图自动消失
 */
@property (assign, nonatomic) NSInteger displayTime;

/**
 *  左侧提示图标
 */
@property (strong, nonatomic) UIImage *leftIcon;

/**
    显示提示信息，默认显示等待时间2.8秒
    @param tip 要显示的提示信息
 */
+ (void)showTip:(NSString*)tip atView:(UIView*)view;

+ (void)showTip:(NSString *)tip leftIcon:(UIImage *)image atView:(UIView *)view;
/**
    显示提示信息，默认显示等待时间2.8秒
    @param tip 要显示的提示信息
    @param delayTime 多长时间后显示
 */
+ (void)showTip:(NSString*)tip delay:(NSTimeInterval)delayTime;

/**
    显示提示信息
    @param tip 要显示的提示信息
    @param waitTime 提示显示时间
 */
+ (void)showTip:(NSString*)tip withWaitTime:(NSInteger)waitTime atView:(UIView*)view;

/**
 *  显示提示信息
 *
 *  @param tip       要显示的提示信息
 *  @param delayTime 多长时间后显示
 *  @param waitTime  提示显示时间
 */
+ (void)showTip:(NSString*)tip delay:(NSTimeInterval)delayTime withWaitTime:(NSInteger)waitTime;
@end

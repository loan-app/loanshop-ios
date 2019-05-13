//
//  DBCHUIViewTool.m
//  db_VideoPlayer
//
//  Created by Wolfe on 2016/11/16.
//  Copyright © 2016年 杭州当贝网络科技有限公司. All rights reserved.
//

#import "DBCHUIViewTool.h"
#import "UITipView.h"

@implementation DBCHUIViewTool

//+ (void)setBorderWithView:(UIView *)view top:(BOOL)top left:(BOOL)left bottom:(BOOL)bottom right:(BOOL)right borderColor:(UIColor *)color borderWidth:(CGFloat)width
//{
//    if (top)
//    {
//        CALayer *layer = [CALayer layer];
//        layer.frame = CGRectMake(0, 0, view.frame.size.width, width);
//        layer.backgroundColor = color.CGColor;
//        [view.layer addSublayer:layer];
//    }
//    
//    if (left)
//    {
//        CALayer *layer = [CALayer layer];
//        layer.frame = CGRectMake(0, 0, width, view.frame.size.height);
//        layer.backgroundColor = color.CGColor;
//        [view.layer addSublayer:layer];
//    }
//    
//    if (bottom)
//    {
//        CALayer *layer = [CALayer layer];
//        layer.frame = CGRectMake(0, view.frame.size.height - width, view.frame.size.width, width);
//        layer.backgroundColor = color.CGColor;
//        [view.layer addSublayer:layer];
//    }
//    
//    if (right)
//    {
//        CALayer *layer = [CALayer layer];
//        layer.frame = CGRectMake(view.frame.size.width - width, 0, width, view.frame.size.height);
//        layer.backgroundColor = color.CGColor;
//        [view.layer addSublayer:layer];
//    }
//    
//}

+ (void)addLocalPush:(NSString *)alertBody userInfo:(NSDictionary *)userInfo{
    // 1.创建一个本地通知
    UILocalNotification *localNote = [[UILocalNotification alloc] init];
    
    // 1.1.设置通知发出的时间
    localNote.fireDate = [NSDate dateWithTimeIntervalSinceNow:0.1];//0.1秒后通知
    
    // 1.2.设置通知内容
    localNote.alertBody = alertBody;
    
    // 1.3.设置锁屏时,字体下方显示的一个文字
    localNote.alertAction = @"赶紧！！！";
    localNote.hasAction = YES;
    
    // 1.4.设置启动图片(通过通知打开的)
    localNote.alertLaunchImage = @"AppIcon.png";
    
    // 1.5.设置通过到来的声音
    localNote.soundName = UILocalNotificationDefaultSoundName;
    
    // 1.6.设置应用图标左上角显示的数字
    //    localNote.applicationIconBadgeNumber = 999;
    // 1.7.设置一些额外的信息
    localNote.userInfo = @{@"qq" : @"2663696686", @"msg" : @"success"};
    // 2.执行通知
    [[UIApplication sharedApplication] scheduleLocalNotification:localNote];

}

+ (void)showTipView:(NSString *)tipString{
    [UITipView showTip:tipString atView:[[[UIApplication sharedApplication] delegate] window]];
}

/**
 *  根据宽高比例获得高
 *  @param size  图片size
 *  @param width 实际宽度
 *  @return 实际高度
 */
+ (CGFloat)getImageHeight:(CGSize)size width:(CGFloat)width
{
    float integerW = size.width;
    float integerH = size.height;
    float scale = width / integerW;
    NSNumber *number = [NSNumber numberWithFloat:scale * integerH];
    return [number floatValue];
}


@end

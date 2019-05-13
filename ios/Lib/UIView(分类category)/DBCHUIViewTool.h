//
//  DBCHUIViewTool.h
//  db_VideoPlayer
//
//  Created by Wolfe on 2016/11/16.
//  Copyright © 2016年 杭州当贝网络科技有限公司. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DBCHUIViewTool : NSObject

//+ (void)setBorderWithView:(UIView *)view top:(BOOL)top left:(BOOL)left bottom:(BOOL)bottom right:(BOOL)right borderColor:(UIColor *)color borderWidth:(CGFloat)width;

+ (void)addLocalPush:(NSString *)alertBody userInfo:(NSDictionary *)userInfo;

+ (void)showTipView:(NSString *)tipString;

///**
// *  根据宽高比例获得高
// *  @param size  图片size
// *  @param width 实际宽度
// *  @return 实际高度
// */
//+ (CGFloat)getImageHeight:(CGSize)size width:(CGFloat)width;
@end

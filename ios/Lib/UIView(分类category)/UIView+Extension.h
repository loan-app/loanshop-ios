//
//  UIView+Extension.h
//  MobileClass
//
//  Created by GJF on 15/12/26.
//  Copyright © 2015年 zonelue. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIView (Extension)



@end

@interface UIView (Frame)
@property (nonatomic,assign) CGFloat x;/**<x的坐标*/
@property (nonatomic, assign) CGFloat y;/**< y的坐标*/
@property (nonatomic, assign) CGFloat centerX;/**<中心点x的坐标*/
@property (nonatomic, assign) CGFloat centerY;/**<中心点y的坐标*/
@property (nonatomic, assign) CGFloat width;/**<宽度*/
@property (nonatomic, assign) CGFloat height;/**<高度*/
@property (nonatomic, assign) CGSize size;/**<大小*/
@property (nonatomic, assign) CGPoint origin;/**<原点*/
@end
/**
 *  圆角
 */
@interface UIView (Corner)
- (void)cornerRadius:(CGFloat)radius;/**<指定圆角大小处理*/
- (void)borderWithColor:(UIColor *)borderColor borderWidth:(CGFloat)borderWidth;/**<添加border*/
- (void)cornerRadius:(CGFloat)radius borderColor:(UIColor*)borderColor borderWidth:(CGFloat)borderWidth;/**<指定圆角大小，且带border*/
- (void)makeRoundedCorner:(UIRectCorner)byRoundingCorners cornerRadii:(CGSize)cornerRadii;/**<对UIView的四个角进行选择性的圆角处理*/
- (UIImage *)imageClipAtFrame:(CGRect)r;/**< 根据View截取指定Image */

@end

@interface UIView (Animation)<CAAnimationDelegate>
- (void)dd_outLineAnimation;/**< 外圈画线*/
- (void)dd_revealAnimation;/**< 中心向外扩散*/
- (void)dd_slowRevealAnimation;/**< 向内外扩散*/
@end

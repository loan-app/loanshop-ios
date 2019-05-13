//
//  UIView+Extension.m
//  MobileClass
//
//  Created by GJF on 15/12/26.
//  Copyright © 2015年 zonelue. All rights reserved.
//

#import "UIView+Extension.h"


@implementation UIView (Extension)


@end

@implementation UIView (Frame)
- (void)setX:(CGFloat)x{
    CGRect frame = self.frame;
    frame.origin.x = x;
    self.frame = frame;
}

- (void)setY:(CGFloat)y{
    CGRect frame = self.frame;
    frame.origin.y = y;
    self.frame = frame;
}

- (CGFloat)x{
    return self.frame.origin.x;
}

- (CGFloat)y{
    return self.frame.origin.y;
}

- (void)setCenterX:(CGFloat)centerX{
    CGPoint center = self.center;
    center.x = centerX;
    self.center = center;
}

- (CGFloat)centerX{
    return self.center.x;
}

- (void)setCenterY:(CGFloat)centerY{
    CGPoint center = self.center;
    center.y = centerY;
    self.center = center;
}

- (CGFloat)centerY{
    return self.center.y;
}

- (void)setWidth:(CGFloat)width{
    CGRect frame = self.frame;
    frame.size.width = width;
    self.frame = frame;
}

- (void)setHeight:(CGFloat)height{
    CGRect frame = self.frame;
    frame.size.height = height;
    self.frame = frame;
}

- (CGFloat)height{
    return self.frame.size.height;
}

- (CGFloat)width{
    return self.frame.size.width;
}

- (void)setSize:(CGSize)size{
    CGRect frame = self.frame;
    frame.size = size;
    self.frame = frame;
}

- (CGSize)size{
    return self.frame.size;
}

- (void)setOrigin:(CGPoint)origin{
    CGRect frame = self.frame;
    frame.origin = origin;
    self.frame = frame;
}

- (CGPoint)origin{
    return self.frame.origin;
}

@end

@implementation UIView (Corner)

- (void)cornerRadius:(CGFloat)radius {
    self.layer.masksToBounds = YES;
    self.layer.cornerRadius = radius;
}

- (void)borderWithColor:(UIColor *)borderColor borderWidth:(CGFloat)borderWidth {
    self.layer.borderWidth = borderWidth;
    self.layer.borderColor = borderColor.CGColor;
}

- (void)cornerRadius:(CGFloat)radius borderColor:(UIColor *)borderColor borderWidth:(CGFloat)borderWidth {
    self.layer.masksToBounds = YES;
    self.layer.cornerRadius = radius;
    self.layer.borderWidth = borderWidth;
    self.layer.borderColor = borderColor.CGColor;
}

- (void)makeRoundedCorner:(UIRectCorner)byRoundingCorners cornerRadii:(CGSize)cornerRadii {
    UIBezierPath *path = [UIBezierPath bezierPathWithRoundedRect:self.bounds byRoundingCorners:byRoundingCorners cornerRadii:cornerRadii];
    CAShapeLayer * shape = [CAShapeLayer layer];
    shape.path = path.CGPath;
    self.layer.mask = shape;
}
- (UIImage *)imageClipAtFrame:(CGRect)r
{
    UIGraphicsBeginImageContext(self.frame.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSaveGState(context);
    UIRectClip(r);
    [self.layer renderInContext:context];
    UIImage *theImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return  theImage;//[self getImageAreaFromImage:theImage atFrame:r];
}
@end

static CAShapeLayer *circleLayer;
static NSTimeInterval kRevealAnimationTimeInterval = 2.0f;

static CGFloat kRadius = 90;
@implementation UIView (Animation)
- (void)dd_outLineAnimation; {
    
    [self startOutLineAnimation];
}

- (void)dd_revealAnimation {
    
    [self startRevealAnimation];
}

//执行动画
- (void)startOutLineAnimation {
    
    [circleLayer removeFromSuperlayer];
    //创建外圆的layer
    circleLayer = [CAShapeLayer layer];
    circleLayer.lineWidth = 1.0f;
    circleLayer.strokeColor = [UIColor lightGrayColor].CGColor;
    circleLayer.fillColor = [UIColor clearColor].CGColor;
    circleLayer.path = [self drawOutLine].CGPath;
    [self.layer addSublayer:circleLayer];
    
    //执行外圆layer的动画
    CABasicAnimation *circleAnimation = [CABasicAnimation animationWithKeyPath:@"strokeEnd"];
    circleAnimation.duration = kRevealAnimationTimeInterval;
    circleAnimation.fromValue = @(0.0f);
    circleAnimation.toValue = @(1.0f);
    circleAnimation.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseOut];
    [circleLayer addAnimation:circleAnimation forKey:@"outlineAnimation"];
}

- (void)startRevealAnimation {
    
    self.hidden = YES;
    CAShapeLayer *revealLayer = [CAShapeLayer layer];
    revealLayer.bounds = self.bounds;
    revealLayer.fillColor = [UIColor blackColor].CGColor;
    
    //开始的路径
    CGFloat fromRadius = 1.0f;
    CGFloat fromRectWidth = fromRadius * 2;
    CGFloat fromRectHeight = fromRadius * 2;
    CGRect fromRect = CGRectMake(CGRectGetMidX(self.bounds) - fromRadius,
                                 CGRectGetMidY(self.bounds) - fromRadius,
                                 fromRectWidth,
                                 fromRectHeight);
    
    UIBezierPath *fromPath = [self drawRevealPath:fromRect cornerRadius:fromRadius];
    
    //结束的路径
    CGFloat endRadius = self.bounds.size.width / 2;
    UIBezierPath *endPath = [self drawRevealPath:self.bounds cornerRadius:endRadius];
    
    
    revealLayer.path = endPath.CGPath;
    revealLayer.position = CGPointMake(CGRectGetMidX(self.bounds), CGRectGetMidY(self.bounds));
    self.layer.mask = revealLayer;
    
    //    开始动画
    CABasicAnimation *revealAnimation = [CABasicAnimation animationWithKeyPath:@"path"];
    revealAnimation.fromValue = (__bridge id)(fromPath.CGPath);
    revealAnimation.toValue = (__bridge id)(endPath.CGPath);
    revealAnimation.duration = kRevealAnimationTimeInterval / 2;
    revealAnimation.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut];
    revealAnimation.beginTime = CACurrentMediaTime() + kRevealAnimationTimeInterval / 2;
    revealAnimation.repeatCount = 1.0f;
    revealAnimation.fillMode = kCAFillModeForwards;
    
    dispatch_time_t timeToShow = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(kRevealAnimationTimeInterval/2.0f * NSEC_PER_SEC));
    dispatch_after(timeToShow, dispatch_get_main_queue(), ^{
        
        self.hidden = NO;
    });
    [revealLayer addAnimation:revealAnimation forKey:@"revealAnimation"];
    
}


- (void)dd_slowRevealAnimation {
    
    circleLayer = [CAShapeLayer layer];
    circleLayer.fillColor = [UIColor clearColor].CGColor;
    circleLayer.strokeColor = [UIColor yellowColor].CGColor;
    circleLayer.path = [self pathWithRadius:kRadius].CGPath;
    self.layer.mask = circleLayer;
    
    //NSStringFromSelector(@selector(lineWidth)
    CABasicAnimation *lineWidthAnimation = [CABasicAnimation animationWithKeyPath:@"lineWidth"];
    lineWidthAnimation.toValue = @(kRadius);
    lineWidthAnimation.duration = 2.0;
    lineWidthAnimation.delegate = self;
    lineWidthAnimation.removedOnCompletion = NO;
    lineWidthAnimation.fillMode = kCAFillModeForwards;
    [circleLayer addAnimation:lineWidthAnimation forKey:@"slowRevealAnimation"];
}

- (void)animationDidStop:(CAAnimation *)anim finished:(BOOL)flag {
    self.layer.mask = nil;
}



- (UIBezierPath *)pathWithRadius:(CGFloat)radius {
    //根据矩形框,画个内切圆
    return [UIBezierPath bezierPathWithOvalInRect:CGRectMake((CGRectGetWidth(self.bounds) - radius) / 2,
                                                             (CGRectGetHeight(self.bounds) - radius) / 2,
                                                             radius ,
                                                             radius)];
}

- (UIBezierPath *)drawOutLine {
    
    UIBezierPath *path = [UIBezierPath bezierPathWithRoundedRect:self.bounds cornerRadius:self.bounds.size.width / 2];
    return path;
}

- (UIBezierPath *)drawRevealPath:(CGRect)roundRect cornerRadius:(CGFloat)radius{
    
    UIBezierPath *path = [UIBezierPath bezierPathWithRoundedRect:roundRect cornerRadius:radius];
    return path;
}




@end

//
//   UITipView.m
//  db_VideoPlayer
//
//  Created by 白色的黑豹 on 17/1/20.
//  Copyright © 2017年 杭州当贝网络科技有限公司. All rights reserved.
//

#import "UITipView.h"
#import <QuartzCore/CALayer.h>
#define tipFont [UIFont systemFontOfSize:14]
#define LEFTMARGIN 10
#define RIGHTMARGIN 10
#define TOPMARGIN 10
#define BOTTOMMARGIN 10
#define IMG_TIP_GAP 5
#define UI_SHOW_TIP_TAG 20000

typedef void (^FinishedBlock)();
@interface UITipView()

/**
 *  关闭计时器
 */
@property (retain, nonatomic) NSTimer *theTimer;

@property UIView *view;

@end

@implementation UITipView{
    
    /**
        提示显示控件
     */
    UILabel *_tipLabel;
    FinishedBlock _block;
    UIImageView *_tipImgV;
}
@synthesize theTimer,view;

+(void)showTip:(NSString *)tip withWaitTime:(NSInteger)waitTime atView:(UIView *)view
{
    
}

+ (void)showTip:(NSString *)tip delay:(NSTimeInterval)delayTime
{
    
}

+(void)showTip:(NSString *)tip delay:(NSTimeInterval)delayTime withWaitTime:(NSInteger)waitTime
{
    
}

+ (void)showTip:(NSString*)tip atView:(UIView*)view
{
    [UITipView showTip:tip leftIcon:nil withWaitTime:5.0 atView:view];
}

+ (void)showTip:(NSString *)tip leftIcon:(UIImage *)image atView:(UIView *)view{
    [UITipView showTip:tip leftIcon:image withWaitTime:2.8 atView:view];
}

+ (void)showTip:(NSString *)tip leftIcon:(UIImage *)image atView:(UIView *)view finishBlock:(void (^)())block
{
    [UITipView showTip:tip leftIcon:image withWaitTime:2.8 atView:view];
}

+ (void)showTip:(NSString*)tip leftIcon:(UIImage *)image delay:(NSTimeInterval)delayTime
{
    [UITipView showTip:tip leftIcon:image delay:delayTime withWaitTime:2.8];
}

+ (void)showTip:(NSString*)tip leftIcon:(UIImage *)image withWaitTime:(NSInteger)waitTime atView:(UIView*)view
{
    if( !view ){
        return;
    }
    __block NSString *__tip = [tip copy];
    __block NSInteger __waitTime = waitTime;
    __block UIImage *__image = [image copy];
    dispatch_async( dispatch_get_main_queue(), ^{
        
//        UIWindow *window = [UIApplication sharedApplication].keyWindow;
        
        //保证某一时刻只显示1个提示框
        UITipView *tipView = (UITipView*)[view viewWithTag:UI_SHOW_TIP_TAG];
        if (tipView) {
            [tipView clear];
        }
        
        NSDictionary *dic = @{NSFontAttributeName: [UIFont systemFontOfSize:15.f]};
         CGRect rectContent = [tip boundingRectWithSize:CGSizeMake(260, 220) options:NSStringDrawingUsesFontLeading | NSStringDrawingUsesLineFragmentOrigin attributes:dic context:nil];
        CGSize size = rectContent.size;
        CGRect rect = view.bounds;
        if (image) {
            rect.origin.x = (rect.size.width - (size.width + LEFTMARGIN + RIGHTMARGIN + image.size.width + IMG_TIP_GAP))/2;
            rect.origin.y = (rect.size.height - (size.height + TOPMARGIN + BOTTOMMARGIN))/2;
            rect.size.width = size.width+ LEFTMARGIN + RIGHTMARGIN + image.size.width + IMG_TIP_GAP;
            rect.size.height = size.height + TOPMARGIN + BOTTOMMARGIN;
        }else{
            rect.origin.x = (rect.size.width - (size.width + LEFTMARGIN + RIGHTMARGIN))/2;
            rect.origin.y = (rect.size.height - (size.height + 28))/2;
            rect.size.width = size.width + LEFTMARGIN + RIGHTMARGIN;
            rect.size.height = size.height+ TOPMARGIN + BOTTOMMARGIN;
        }
        
        tipView = [[UITipView alloc] initWithFrame:rect];
        tipView.tag = UI_SHOW_TIP_TAG;
        tipView.tipMessage = __tip;
        tipView.displayTime = __waitTime;//2.8;
        tipView.leftIcon = __image;
        tipView.layer.cornerRadius = 8;
        tipView.layer.masksToBounds = YES;
        tipView.alpha = 0.0f;
        tipView.transform = CGAffineTransformMakeScale(0.7, 0.7);
        
        [view addSubview:tipView];
        [view bringSubviewToFront:tipView];
        [UIView beginAnimations:nil context:NULL];
        [UIView setAnimationDuration:0.3];
        tipView.alpha = 0.6f;
        tipView.transform = CGAffineTransformMakeScale(1.0, 1.0);
        [UIView commitAnimations];
        
    });
}

+ (void)showTip:(NSString*)tip leftIcon:(UIImage *)image delay:(NSTimeInterval)delayTime withWaitTime:(NSInteger)waitTime
{
    __block NSString *__tip = [tip copy];
    __block NSInteger __waitTime = waitTime;
    dispatch_async( dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
        sleep(delayTime);
        dispatch_async( dispatch_get_main_queue(), ^{
            [UITipView showTip:__tip leftIcon:image withWaitTime:__waitTime atView:[UIApplication sharedApplication].keyWindow.rootViewController.view];
        });
    });
}

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if ( self )
    {
        [self createTipView];
    }
    return self;
}

- (UITipView*)initWithMessage:(NSString*)message displayTime:(NSInteger)sec
{
    self = [super init];
    if ( self ){
        self.tipMessage = message;
        self.displayTime = sec;
        
        [self createTipView];
    }
    return self;
}

- (void)dealloc
{
    self.theTimer = nil;
    self.tipMessage = nil;
}

- (void)createTipView
{
    self.backgroundColor = [UIColor blackColor];
    UIFont *font = tipFont;
    _tipLabel = [[UILabel alloc] initWithFrame:self.bounds];
    _tipLabel.textAlignment = NSTextAlignmentCenter;
    _tipLabel.numberOfLines = 0;
    [_tipLabel setFont:font];
    [_tipLabel setTextColor:[UIColor whiteColor]];
    _tipLabel.backgroundColor = [UIColor clearColor];
    [self addSubview:_tipLabel];
    if (_leftIcon) {
        _tipImgV = [[UIImageView alloc] initWithImage:_leftIcon];
        [self addSubview:_tipImgV];
    }
}

- (void)layoutSubviews
{
    CGRect rect = self.bounds;
    if (_leftIcon) {
        if (!_tipImgV) {
            _tipImgV = [[UIImageView alloc] initWithImage:_leftIcon];
            [self addSubview:_tipImgV];
        }
        _tipImgV.frame = CGRectMake(LEFTMARGIN, (rect.size.height - _leftIcon.size.height) / 2.0, _leftIcon.size.width, _leftIcon.size.height);
        _tipLabel.frame = CGRectMake(LEFTMARGIN + _leftIcon.size.width + IMG_TIP_GAP, TOPMARGIN, rect.size.width - LEFTMARGIN - RIGHTMARGIN - _leftIcon.size.width - IMG_TIP_GAP, rect.size.height - TOPMARGIN - BOTTOMMARGIN);
    }else{
        _tipLabel.frame = CGRectMake(LEFTMARGIN, TOPMARGIN, rect.size.width - LEFTMARGIN - RIGHTMARGIN, rect.size.height - TOPMARGIN - BOTTOMMARGIN);
    }
    
}

- (void)didMoveToSuperview
{
    [_tipLabel setText:self.tipMessage];
    self.theTimer = [NSTimer scheduledTimerWithTimeInterval:self.displayTime target:self selector:@selector(timer:) userInfo:nil repeats:NO];
}

- (void)timer:(NSTimer*)theTimer
{
    
    dispatch_async( dispatch_get_main_queue(), ^{
        [UIView animateWithDuration:0.3 animations:^(){
            self.alpha = 0.0f;
            self.transform = CGAffineTransformMakeScale(0.7, 0.7);
        }completion:^(BOOL finised){
            [self removeFromSuperview];
        }];
    });
    
}
- (void)clear
{
    [self.theTimer fire];
    self.theTimer = nil;
}

@end

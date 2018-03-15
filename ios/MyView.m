//
//  MyView.m
//  qianshi
//
//  Created by Gerow on 2017/9/20.
//  Copyright © 2017年 qianshi. All rights reserved.
//

#import "MyView.h"
#import "MyViewController.h"


@interface MyView ()

@property (nonatomic, strong) MyViewController *myViewController;
@property (nonatomic, strong) UIView *myView;

@end


@implementation MyView

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if (self) {
    [self setUpUI];
  }
  return self;
}

- (void)setUpUI {
  self.myView.frame = CGRectMake(-1, -1, 1, 1);
  [self addSubview:self.myView];
}

- (void)pay:(NSDictionary *)dicD callback:(RCTResponseSenderBlock)callback{
  [self.myViewController pay:dicD callback:callback];
}

#pragma mark - 懒加载
- (UIView *)myView {
  if (!_myView) {
    self.myViewController = [MyViewController new];
    _myView = self.myViewController.view;
  }
  return _myView;
}


@end

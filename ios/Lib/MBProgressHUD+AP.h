//
//  MBProgressHUD+AP.h
//  XFlowers
//
//  Created by 文金庚 on 2018/6/20.
//  Copyright © 2018年 杭州电子商务有限公司. All rights reserved.
//

#import <MBProgressHUD/MBProgressHUD.h>

@interface MBProgressHUD (AP)

+ (void)showSuccess:(NSString *)success toView:(UIView *)view;
+ (void)showError:(NSString *)error toView:(UIView *)view;

+ (MBProgressHUD *)showMessage:(NSString *)message toView:(UIView *)view;

+ (void)showSuccess:(NSString *)success;
+ (void)showError:(NSString *)error;

+ (MBProgressHUD *)showMessage:(NSString *)message;

+ (void)hideHUDForView:(UIView *)view;
+ (void)hideHUD;

+ (MBProgressHUD *)showMessage:(NSString *)message toView:(UIView *)view afterDelty:(NSTimeInterval )interval;

@end

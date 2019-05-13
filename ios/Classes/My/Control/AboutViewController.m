//
//  AboutViewController.m
//  chaoshimiao
//
//  Created by zhangze on 2019/4/14.
//  Copyright © 2019 gjf. All rights reserved.
//

#import "AboutViewController.h"

#import "LoginViewController.h"
#import "AppDelegate.h"
#import "GJFTabbarViewController.h"
@interface AboutViewController ()
@property (weak, nonatomic) IBOutlet UIButton *tuichuBtn;
@property (weak, nonatomic) IBOutlet UIImageView *iconImage;

@end

@implementation AboutViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    self.title = @"关于我们";
    [_iconImage cornerRadius:10];
    
    _tuichuBtn.hidden = _isNeedShow ? NO : YES;
    [_tuichuBtn cornerRadius:5];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/
- (IBAction)click:(id)sender {
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"您是否要退出当前账户" message:nil preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil];
    
    [alertController addAction:cancelAction];
    
    //    UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"确认" style:UIAlertActionStyleDefault handler:nil];
    UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"确认" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        LoginViewController *login = [LoginViewController new];
        [self presentViewController:[[UINavigationController alloc]initWithRootViewController:login] animated:YES completion:nil];
        [__UserDefaults setObject:nil forKey:KUserInfo];
        
        AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
        UIViewController *controller = app.window.rootViewController;
        GJFTabbarViewController *vc = (GJFTabbarViewController*)controller;
        [self.navigationController popViewControllerAnimated:YES];
        [vc setSelectedIndex:0];
    }];
    //设置okAction的title颜色
    
    [okAction setValue:[UIColor colorWithRed:220/255.0 green:170/255.0 blue:101/255.0 alpha:1] forKey:@"titleTextColor"];
    
    [alertController addAction:okAction];
    
    [self presentViewController:alertController animated:YES  completion:nil];
}

@end

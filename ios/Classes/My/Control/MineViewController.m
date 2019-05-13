//
//  MineViewController.m
//  chaoshimiao
//
//  Created by zhangze on 2019/4/9.
//  Copyright © 2019 gjf. All rights reserved.
//

#import "MineViewController.h"
#import "AboutViewController.h"

@interface MineViewController ()
@property (weak, nonatomic) IBOutlet UILabel *userName;

@end

@implementation MineViewController

- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES animated:animated];
}

- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO animated:animated];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    _userName.text = __GetUserPhone;
    // Do any additional setup after loading the view from its nib.
}
- (IBAction)clickToOtherView:(UIButton *)sender {
    switch (sender.tag) {
        case 1:{
            AboutViewController *vc = [AboutViewController new];
            vc.isNeedShow = NO;
            [self.navigationController pushViewController:vc animated:YES];
            }
            break;
        case 2:{
            
        }
            break;
        case 3:{
            AboutViewController *vc = [AboutViewController new];
            vc.isNeedShow = YES;
            [self.navigationController pushViewController:vc animated:YES];
        }
            break;
            
        default:
            break;
    }
    
}


@end

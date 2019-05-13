//
//  HomeGjfTableViewCell.h
//  XFlowers
//
//  Created by zhangze on 2019/4/2.
//  Copyright © 2019 gjf. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "SDCycleScrollView.h"
#import "HomeTypeModel.h"

typedef void(^FourTypeClickBlock)(NSInteger tag);

@interface ShouYeView : UIView

@property (weak, nonatomic) IBOutlet NSLayoutConstraint *topConatant;

@property (weak, nonatomic) IBOutlet UIButton *shenqingjiekuanBtn;

@property (nonatomic, copy) FourTypeClickBlock fourTypeClickBlock;

@property (weak, nonatomic) IBOutlet UIImageView *lunbo;

@property (weak, nonatomic) IBOutlet UILabel *oneLab;
@property (weak, nonatomic) IBOutlet UILabel *twoLab;

@property (weak, nonatomic) IBOutlet UILabel *threeLab;

@property (weak, nonatomic) IBOutlet UILabel *fourLab;
@property (weak, nonatomic) IBOutlet UILabel *nameLab;

@property (weak, nonatomic) IBOutlet UILabel *jinerLab;

@property (nonatomic, strong) NSArray *bannerArray;

@property (weak, nonatomic) IBOutlet UIButton *HomeShenqingBtn;

- (void)SendtypeArray: (NSArray<HomeTypeModel *> *)typeArray;



+ (id)customView;


@end

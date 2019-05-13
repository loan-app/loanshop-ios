//
//  HomeGjfTableViewCell.h
//  XFlowers
//
//  Created by zhangze on 2019/4/2.
//  Copyright © 2019 gjf. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface HomeGjfTableViewCell : UITableViewCell
@property (weak, nonatomic) IBOutlet UILabel *lijishenq;
@property (weak, nonatomic) IBOutlet UIImageView *iconImgeVC;
@property (weak, nonatomic) IBOutlet UILabel *nameLab;
@property (weak, nonatomic) IBOutlet UILabel *jinerLab;
@property (weak, nonatomic) IBOutlet UILabel *tagLab;
@property (weak, nonatomic) IBOutlet UILabel *xiakuanShijianlab;
@property (weak, nonatomic) IBOutlet UIView *typeView;

@end

NS_ASSUME_NONNULL_END

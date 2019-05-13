//
//  HomeGjfTableViewCell.m
//  XFlowers
//
//  Created by zhangze on 2019/4/2.
//  Copyright © 2019 gjf. All rights reserved.
//

#import "HomeGjfTableViewCell.h"

@implementation HomeGjfTableViewCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
    [_lijishenq cornerRadius:12 borderColor:RGB(254, 100, 80) borderWidth:1];
    [_typeView cornerRadius:3 borderColor:RGB(219, 190, 137) borderWidth:1];
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end

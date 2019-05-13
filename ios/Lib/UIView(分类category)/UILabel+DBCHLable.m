//
//  UILabel+DBCHLable.m
//  db_VideoPlayer
//
//  Created by 白色的黑豹 on 17/3/17.
//  Copyright © 2017年 杭州当贝网络科技有限公司. All rights reserved.
//

#import "UILabel+DBCHLable.h"

@implementation UILabel (DBCHLable)

+(UILabel *)creatLableWithAlginment:(NSTextAlignment)aligment Color:(UIColor *)color Font:(NSInteger)font{
    UILabel *label = [[UILabel alloc]init];
    label.backgroundColor = [UIColor clearColor];
    label.textAlignment = aligment;
    label.textColor = color;
    label.font = [UIFont systemFontOfSize:font];
    return label;
}

@end

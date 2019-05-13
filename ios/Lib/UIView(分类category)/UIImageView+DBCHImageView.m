//
//  UIImageView+DBCHImageView.m
//  db_VideoPlayer
//
//  Created by 白色的黑豹 on 17/3/17.
//  Copyright © 2017年 杭州当贝网络科技有限公司. All rights reserved.
//

#import "UIImageView+DBCHImageView.h"

@implementation UIImageView (DBCHImageView)

+(UIImageView *)creatImageViewWithImageName:(NSString *)name{
    UIImageView *imageView = [[UIImageView alloc]init];
    imageView.image = [UIImage imageNamed:name];
    return imageView;
}

@end

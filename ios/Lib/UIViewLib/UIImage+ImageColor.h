//
//  UIImage+ImageColor.h
//  XFlowers
//
//  Created by zhangze on 2019/2/26.
//  Copyright © 2019 杭州信花花电子商务有限公司. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIImage (ImageColor)
+ (UIImage *)imageWithColor:(UIColor *)color size:(CGSize)size;
@end

NS_ASSUME_NONNULL_END

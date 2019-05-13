//
//  FourTypeViewController.h
//  chaoshimiao
//
//  Created by zhangze on 2019/4/11.
//  Copyright © 2019 gjf. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "HomeTypeModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface FourTypeViewController : UIViewController

@property (nonatomic, assign) NSInteger tag;

@property (nonatomic, strong) HomeTypeModel *model;

@end

NS_ASSUME_NONNULL_END

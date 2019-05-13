//
//  ShuanxuanModel.h
//  chaoshimiao
//
//  Created by zhangze on 2019/4/12.
//  Copyright © 2019 gjf. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ShuanxuanModel : NSObject

@property (nonatomic, strong) NSString *key;
@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *sortId;
@property (nonatomic, strong) NSString *isSelect;//0 没有 1 选中

@end

NS_ASSUME_NONNULL_END

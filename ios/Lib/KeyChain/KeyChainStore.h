//
//  KeyChainStore.h
//  bmp_iPhone
//
//  Created by 白色的黑豹 on 2019/1/10.
//  Copyright © 2019年 hanlei. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface KeyChainStore : NSObject

+ (void)save:(NSString *)service data:(id)data;
+ (id)load:(NSString *)service;
+ (void)deleteKeyData:(NSString *)service;

@end

NS_ASSUME_NONNULL_END

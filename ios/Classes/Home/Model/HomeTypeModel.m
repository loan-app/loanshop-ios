//
//  HomeTypeModel.m
//  chaoshimiao
//
//  Created by zhangze on 2019/4/11.
//  Copyright © 2019 gjf. All rights reserved.
//

#import "HomeTypeModel.h"

@implementation HomeTypeModel

- (void)setValue:(id)value forUndefinedKey:(NSString*)key{
    if([key isEqualToString:@"id"]){
        self.homeId = value;
    }
}

@end

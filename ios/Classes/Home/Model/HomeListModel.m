//
//  HomeListModel.m
//  chaoshimiao
//
//  Created by zhangze on 2019/4/11.
//  Copyright © 2019 gjf. All rights reserved.
//

#import "HomeListModel.h"

@implementation HomeListModel
- (void)setValue:(id)value forUndefinedKey:(NSString*)key{
    if([key isEqualToString:@"id"]){
        self.Hlistid = value;
    }
}
@end

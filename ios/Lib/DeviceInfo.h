//
//  DeviceInfo.h
//  deviert
//
//  Created by fb on 13-6-5.
//  Copyright (c) 2013年 fb. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
//判断是否越狱的字段

@interface DeviceInfo : NSObject
+(NSDictionary *)deviceInfo;
+(NSString *)executablePathMD5;
+(BOOL)isJailBrojen;
+ (NSString *)getMacAddress;
-(NSString*)getMainBundleMD5WithFlag:(NSInteger)flag;
+(NSString *)deviceType;
@end

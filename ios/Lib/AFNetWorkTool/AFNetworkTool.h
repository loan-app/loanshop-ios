//
//  AFNetworkTool.h
//  AFNetText2.5
//
//  Created by wxxu on 15/1/27.
//  Copyright (c) 2015年 wxxu. All rights reserved.
//

/**
 要使用常规的AFN网络访问
 */

#import <Foundation/Foundation.h>
#import "AFNetworking.h"

@interface AFNetworkTool : NSObject

/**检测网路状态**/
+ (void)netWorkStatus;
/**检测网路状态**/
+ (void)getNetWorkStatus:(void (^)(AFNetworkReachabilityStatus status))block;


/**
 *  JSON方式GET提交数据
 *
 *  @param urlStr     服务器地址
 *  @param parameters 参数
 *  @param success    成功回调
 *  @param fail       失败回调
 */
+ (void)getJSONWithUrl:(NSString *)urlStr parameters:(id)parameters success:(void (^)(id responseObject))success fail:(void (^)())fail;

/**
 *  GET提交数据
 *
 *  @param urlStr     服务器地址
 *  @param parameters 服务器地址
 *  @param success    成功回调
 *  @param fail       失败回调
 */
+ (void)getWithUrl:(NSString *)urlStr parameters:(id)parameters success:(void (^)(id responseObject))success fail:(void (^)())fail;


/**
 *JSON方式获取数据
 *urlStr:获取数据的url地址
 *
 */
+ (void)JSONDataWithUrl:(NSString *)url success:(void (^)(id json))success fail:(void (^)(void))fail;


/**
 *JSON方式post提交数据
 *urlStr:服务器地址
 *parameters:提交的内容参数
 *
 */
+ (void)postJSONWithUrl:(NSString *)urlStr parameters:(id)parameters success:(void (^)(id responseObject))success fail:(void (^)(void))fail;

+ (void)postWithUrl:(NSString *)urlStr parameters:(id)parameters success:(void (^)(id responseObject))success fail:(void (^)())fail;

@end

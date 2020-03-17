//
//  AFNetworkTool.m
//  AFNetText2.5
//
//  Created by wxxu on 15/1/27.
//  Copyright (c) 2015年 wxxu. All rights reserved.
//

#import "AFNetworkTool.h"

@implementation AFNetworkTool

#pragma mark 检测网路状态
+ (void)netWorkStatus
{
    /**
     AFNetworkReachabilityStatusUnknown          = -1,  // 未知
     AFNetworkReachabilityStatusNotReachable     = 0,   // 无连接
     AFNetworkReachabilityStatusReachableViaWWAN = 1,   // 3G 花钱
     AFNetworkReachabilityStatusReachableViaWiFi = 2,   // WiFi
     */
    // 如果要检测网络状态的变化,必须用检测管理器的单例的startMonitoring
    [[AFNetworkReachabilityManager sharedManager] startMonitoring];
    
    // 检测网络连接的单例,网络变化时的回调方法
    [[AFNetworkReachabilityManager sharedManager] setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
//        DLog(@"%ld", status);
    }];
}
/**检测网路状态**/
+ (void)getNetWorkStatus:(void (^)(AFNetworkReachabilityStatus status))block {
    
    [[AFNetworkReachabilityManager sharedManager] startMonitoring];
    [[AFNetworkReachabilityManager sharedManager] setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
        block (status) ;
    }];
}
#pragma mark - JSON方式获取数据
+ (void)JSONDataWithUrl:(NSString *)url success:(void (^)(id json))success fail:(void (^)())fail;
{
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    //    manager.responseSerializer.acceptableContentTypes = [NSSet setWithObject:@"text/html"];
    manager.responseSerializer.acceptableContentTypes = [NSSet setWithObjects:@"application/json", @"text/html", @"text/json", @"text/javascript", @"text/plain", nil];
    NSDictionary *dic = @{@"format": @"json"};
    [manager GET:url parameters:dic progress:^(NSProgress * _Nonnull downloadProgress) {
        
        //        DLog(@"%lld---%lld", downloadProgress.completedUnitCount , downloadProgress.totalUnitCount);
        
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        
        if (success) {
            success(responseObject) ;
        }
        
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        
        if (fail) {
//            DLog(@"%@",error);
            fail ();
        }
        
    }];
}

#pragma mark - JSON方式GET提交数据
+ (void)getJSONWithUrl:(NSString *)urlStr parameters:(id)parameters success:(void (^)(id responseObject))success fail:(void (^)())fail {
    
    AFHTTPSessionManager *session = [AFHTTPSessionManager manager];
    session.responseSerializer.acceptableContentTypes = [NSSet setWithObjects:@"application/json", @"text/html", @"text/json", @"text/javascript", @"text/plain", nil];
    session.responseSerializer = [AFHTTPResponseSerializer serializer];
  
    [session.requestSerializer setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
    
    NSDictionary *infromDic = __GetUserInfo;
    if (infromDic != nil || [infromDic isKindOfClass:[NSDictionary class]]) {
        [session.requestSerializer setValue:infromDic[@"token"] forHTTPHeaderField:@"TOKEN"];
      NSString *theToken = infromDic[@"token"];
      if (theToken) {
        if (parameters) {
          if (!parameters[@"token"]) {
            NSMutableDictionary *mP = [parameters mutableCopy];
            mP[@"token"] = theToken;
            parameters = mP.copy;
          }
        }else {
          parameters = @{@"token": theToken};
        }
      }
    }else{
        [session.requestSerializer setValue:@"" forHTTPHeaderField:@"TOKEN"];
    }
    /*
    NSDictionary *infromDic = __GetUserInfo;
    if (infromDic != nil || [infromDic isKindOfClass:[NSDictionary class]]) {
        [session.requestSerializer setValue:infromDic[@"sessionToken"] forHTTPHeaderField:@"X-Parse-Session-Token"];
        [session.requestSerializer setValue:infromDic[@"userId"] forHTTPHeaderField:@"X-Parse-User-Id"];
    }else{
        [session.requestSerializer setValue:@"" forHTTPHeaderField:@"X-Parse-Session-Token"];
        [session.requestSerializer setValue:@"" forHTTPHeaderField:@"X-Parse-User-Id"];
    }
    
    
    
    [session.requestSerializer setValue:@"1"forHTTPHeaderField:@"X-Parse-Cid"];
    [session.requestSerializer setValue:@"idfa"forHTTPHeaderField:@"imei"];*/
    
    
    session.requestSerializer.timeoutInterval = 60.f;
    
    [session GET:urlStr parameters:parameters progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        
        NSMutableDictionary *dic = [NSJSONSerialization JSONObjectWithData:responseObject options:NSJSONReadingMutableLeaves error:nil];
        NSMutableDictionary *mDic = [[NSMutableDictionary alloc] initWithDictionary:dic];
        NSLog(@"请求成功的URL:%@",task.currentRequest.URL.absoluteString);
        if (success) {
            success(mDic);
        }
        
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
       NSLog(@"请求成功的URL:%@",task.currentRequest.URL.absoluteString);
        if (fail) {
            fail();
        }
//        [DBCHUIViewTool showTipView:@"出错了~"];
    }];
}

#pragma mark - GET提交数据
+ (void)getWithUrl:(NSString *)urlStr parameters:(id)parameters success:(void (^)(id responseObject))success fail:(void (^)())fail {
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    
    // 设置请求格式
    manager.requestSerializer = [AFHTTPRequestSerializer serializer];
    
    // 设置返回格式
    manager.responseSerializer = [AFHTTPResponseSerializer serializer];
    
    //manager.responseSerializer.acceptableContentTypes = [NSSet setWithObject:@"text/html"];
    
    [manager GET:urlStr parameters:parameters progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSError *error;
        NSDictionary *result = [NSJSONSerialization JSONObjectWithData:responseObject options:NSJSONReadingMutableContainers error:&error];
        if (error) {
            
        } else {
            if (success) {
              
            }
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        
        if (fail) {
            
            fail();
            
        }
    }];
}



#pragma mark - JSON方式post提交数据
+ (void)postJSONWithUrl:(NSString *)urlStr parameters:(id)parameters success:(void (^)(id responseObject))success fail:(void (^)())fail
{

    
    AFHTTPSessionManager *session = [AFHTTPSessionManager manager];
    session.responseSerializer.acceptableContentTypes = [NSSet setWithObjects:@"application/json", @"text/html", @"text/json", @"text/javascript", @"text/plain", nil];
    session.responseSerializer = [AFHTTPResponseSerializer serializer];
    session.requestSerializer = [AFJSONRequestSerializer serializer];
//    [session.requestSerializer setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];

    NSDictionary *infromDic = __GetUserInfo;
    if (infromDic != nil || [infromDic isKindOfClass:[NSDictionary class]]) {
        [session.requestSerializer setValue:infromDic[@"token"] forHTTPHeaderField:@"TOKEN"];
      NSString *theToken = infromDic[@"token"];
      if (theToken) {
        if (parameters) {
          if (!parameters[@"token"]) {
            NSMutableDictionary *mP = [parameters mutableCopy];
            mP[@"token"] = theToken;
            parameters = mP.copy;
          }
        }else {
          parameters = @{@"token": theToken};
        }
      }
    }else{
       [session.requestSerializer setValue:@"" forHTTPHeaderField:@"TOKEN"];
    }

    session.requestSerializer.timeoutInterval = 60.f;
    
    [session POST:urlStr parameters:parameters progress:^(NSProgress * _Nonnull uploadProgress) {
        
        //        DLog(@"请求进度~");
        
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        
        NSMutableDictionary *dic = [NSJSONSerialization JSONObjectWithData:responseObject options:NSJSONReadingMutableLeaves error:nil];
        NSMutableDictionary *mDic = [[NSMutableDictionary alloc] initWithDictionary:dic];
        
      NSLog(@"请求成功的URL:%@ dic: %@",task.currentRequest.URL.absoluteString,dic);
        if (success) {
            success(mDic) ;
        }
        
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"上传失败.%@",error);
        NSLog(@"请求成功的URL:%@",task.currentRequest.URL.absoluteString);
        fail () ;
        [DBCHUIViewTool showTipView:@"出错了~"];
        
    }];
    
}

+ (void)postWithUrl:(NSString *)urlStr parameters:(id)parameters success:(void (^)(id responseObject))success fail:(void (^)())fail
{
    
    
    AFHTTPSessionManager *session = [AFHTTPSessionManager manager];
    session.responseSerializer.acceptableContentTypes = [NSSet setWithObjects:@"application/json", @"text/html", @"text/json", @"text/javascript", @"text/plain", nil];
    session.responseSerializer = [AFHTTPResponseSerializer serializer];
    session.requestSerializer = [AFHTTPRequestSerializer serializer];
    //    [session.requestSerializer setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
    
    NSDictionary *infromDic = __GetUserInfo;
    if (infromDic != nil || [infromDic isKindOfClass:[NSDictionary class]]) {
        [session.requestSerializer setValue:infromDic[@"token"] forHTTPHeaderField:@"TOKEN"];
      NSString *theToken = infromDic[@"token"];
      if (theToken) {
        if (parameters) {
          if (!parameters[@"token"]) {
            NSMutableDictionary *mP = [parameters mutableCopy];
            mP[@"token"] = theToken;
            parameters = mP.copy;
          }
        }else {
          parameters = @{@"token": theToken};
        }
      }
    }else{
        [session.requestSerializer setValue:@"" forHTTPHeaderField:@"TOKEN"];
    }
    
    session.requestSerializer.timeoutInterval = 60.f;
    
    [session POST:urlStr parameters:parameters progress:^(NSProgress * _Nonnull uploadProgress) {
        
        //        DLog(@"请求进度~");
        
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        
        NSMutableDictionary *dic = [NSJSONSerialization JSONObjectWithData:responseObject options:NSJSONReadingMutableLeaves error:nil];
        NSMutableDictionary *mDic = [[NSMutableDictionary alloc] initWithDictionary:dic];
        
      NSLog(@"请求成功的URL:%@ dic: %@",task.currentRequest.URL.absoluteString,dic);
        if (success) {
            success(mDic) ;
        }
        
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"上传失败.%@",error);
        NSLog(@"请求成功的URL:%@",task.currentRequest.URL.absoluteString);
        fail () ;
        [DBCHUIViewTool showTipView:@"出错了~"];
        
    }];
    
}



@end

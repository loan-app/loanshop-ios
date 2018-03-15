//
//  RNChannel.h
//  qianshi
//
//  Created by Gerow on 2017/10/9.
//  Copyright © 2017年 qianshi. All rights reserved.
//

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#elif __has_include("React/RCTBridgeModule.h")
#import "React/RCTBridgeModule.h"
#endif

@interface RNTD : NSObject <RCTBridgeModule>

@end

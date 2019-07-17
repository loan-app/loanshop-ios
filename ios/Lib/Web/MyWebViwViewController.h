//
//  WLWebController.h
//  WangliBank
//
//  Created by 王启镰 on 16/6/21.
//  Copyright © 2016年 iSoftstone infomation Technology (Group) Co.,Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface MyWebViwViewController : UIViewController

@property (nonatomic, copy) NSString *url;

  
@property (nonatomic, copy) NSString *urlStr;
@property (nonatomic, strong) NSString *titleString;
@property (nonatomic, strong) NSArray *dataArray;
  
+ (instancetype)sharedSingleton;
  
- (void)startReload;
  
- (void)yuLoad;
  
@end

//
//  HomeListModel.h
//  chaoshimiao
//
//  Created by zhangze on 2019/4/11.
//  Copyright © 2019 gjf. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface HomeListModel : NSObject

@property (nonatomic, strong) NSString *Hlistid;
@property (nonatomic, strong) NSString *title;
@property (nonatomic, strong) NSString *state;
@property (nonatomic, strong) NSString *tags;
@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *maxloan;
@property (nonatomic, strong) NSString *minloan;
@property (nonatomic, strong) NSString *raterange;
@property (nonatomic, strong) NSString *periodrange;
@property (nonatomic, strong) NSString *homeId;
@property (nonatomic, strong) NSString *applyurl;
@property (nonatomic, strong) NSString *applynum;
@property (nonatomic, strong) NSString *badge;
@property (nonatomic, strong) NSString *applyurl2;
@property (nonatomic, strong) NSString *intro;
@property (nonatomic, strong) NSString *applyinfo;
@property (nonatomic, strong) NSString *logo;
@property (nonatomic, strong) NSString *byuid;

@property (nonatomic, strong) NSString *createdat;
@property (nonatomic, strong) NSString *updatedat;
@property (nonatomic, strong) NSString *deletedat;
@property (nonatomic, strong) NSString *weights;
@property (nonatomic, strong) NSString *type;


@end

NS_ASSUME_NONNULL_END

//
//  HomeViewController.m
//  chaoshimiao
//
//  Created by zhangze on 2019/4/9.
//  Copyright © 2019 gjf. All rights reserved.
//

#import "HomeViewController.h"
#import "HomeGjfTableViewCell.h"
#import "ShouYeView.h"
#import "HomeTypeModel.h"
#import "HomeListModel.h"

#import "FourTypeViewController.h"

#import "LoginViewController.h"

#import "MyWebViwViewController.h"
#import "GJFTabbarViewController.h"

@interface HomeViewController ()<UITableViewDataSource,UITableViewDelegate>
@property (weak, nonatomic) IBOutlet UITableView *mainTableView;
@property (nonatomic, strong) ShouYeView *headView;

@property (nonatomic, strong) NSDictionary *dataDict;

@property (nonatomic, strong) NSMutableArray *homeTypeArray;
@property (nonatomic, strong) NSMutableArray *homeListArray;

@end

@implementation HomeViewController

- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
//    [URL_Base stringByAppendingString:URL_User_Rlogin]
     [self.navigationController setNavigationBarHidden:YES animated:animated];
    
    [self askforHomeData];
    [self checkUpdate];
  
//    [self autoLogin];
    
    
}

- (void)checkUpdate{
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
//    NSString *app_Name = [infoDictionary objectForKey:@"CFBundleDisplayName"];
    NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
//    NSString *app_build = [infoDictionary objectForKey:@"CFBundleVersion"];
//    NSString *bunldeid = [infoDictionary objectForKey:@"CFBundleIdentifier"];
    
//    type1
//    currentVersion1.0.0
//    chCodets
    
    NSString* channel = __GetKChannel;
    NSDictionary *dic = @{@"type":@"1",@"currentVersion" : app_Version,@"chCode" : channel };
    
    [AFNetworkTool getJSONWithUrl:[URL_Base stringByAppendingString:@"api/get_new_version"] parameters:dic success:^(id responseObject) {
        if (responseObject) {
            NSDictionary *datadic = responseObject[@"data"];
            NSString *linkstring = datadic[@"link"];
            if (linkstring && linkstring.length > 0) {
                            UIAlertController *alertVC = [UIAlertController alertControllerWithTitle:@"有新版本啦" message:@"请点击更新" preferredStyle:UIAlertControllerStyleAlert];
                            [alertVC addAction:[UIAlertAction actionWithTitle:@"马上更新" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
                              NSString *utf8Str = @"https://itunes.apple.com/cn/app/贷款喵-小额贷款借钱软件/id1437128265?mt=8";
                              
                              NSString *str3 = [utf8Str stringByAddingPercentEscapesUsingEncoding:
                                                
                                                NSUTF8StringEncoding];
                              [[UIApplication sharedApplication] openURL:[NSURL URLWithString:str3]];
                                [self presentViewController:alertVC animated:YES completion:nil];
                                return;
                
                            }]];
                
                            //            UIWindow* window = [[[UIApplication sharedApplication] delegate] window];
                            //            [window.rootViewController presentViewController:alertVC animated:YES completion:nil];
                            [self presentViewController:alertVC animated:YES completion:nil];
            }
        }
    } fail:^{
        
    }];
    
}



- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO animated:animated];
}

// 字典转json字符串方法

-(NSString *)convertToJsonData:(NSDictionary *)dict

{
    
    NSError *error;
    
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingPrettyPrinted error:&error];
    
    NSString *jsonString;
    
    if (!jsonData) {
        
        NSLog(@"%@",error);
        
    }else{
        
        jsonString = [[NSString alloc]initWithData:jsonData encoding:NSUTF8StringEncoding];
        
    }
    
    NSMutableString *mutStr = [NSMutableString stringWithString:jsonString];
    
    NSRange range = {0,jsonString.length};
    
    //去掉字符串中的空格
    
    [mutStr replaceOccurrencesOfString:@" " withString:@"" options:NSLiteralSearch range:range];
    
    NSRange range2 = {0,mutStr.length};
    
    //去掉字符串中的换行符
    
    [mutStr replaceOccurrencesOfString:@"\n" withString:@"" options:NSLiteralSearch range:range2];
    
    return mutStr;
    
}

- (void)askForLoginToken{
    NSDictionary *dict = @{@"mobile" : @"13868140535",@"vcode" :@"123456"};
//    NSString * jsonString =  [self convertToJsonData:dict];
    [AFNetworkTool  postJSONWithUrl:[URL_Base stringByAppendingString:@"api/mobileLogin"] parameters:dict success:^(id responseObject) {
        if (responseObject) {
            HomeListModel *model = self.homeListArray[0];
            NSString *mobile = __GetUserPhone;
            NSDictionary *dict = @{@"relId" : model.Hlistid,@"refer" :@"1",@"mobile" : mobile};
            [AFNetworkTool  postJSONWithUrl:[URL_Base stringByAppendingString:@"api/traceProduct"] parameters:dict success:^(id responseObject) {
                if (responseObject) {
                    if ([responseObject[@"code"] integerValue] == 0) {
                        
                    }else{
                        [DBCHUIViewTool showTipView:responseObject[@"msg"]];
                    }
                }
                
            } fail:^{
                
            }];
            
            MyWebViwViewController *vc = [MyWebViwViewController new];
            vc.titleString = model.title;
            vc.urlStr = model.applyurl;
            [self.navigationController pushViewController:vc animated:YES];
        }
        
    } fail:^{
        
    }];
}

- (void)notificationnew{
    [self askforHomeData];
}

- (void)viewDidLoad {
    [super viewDidLoad];
//  NSString* channel = __GetKChannel;
//   NSString *uuid = [GSKeyChain getUUID];
//  [DBCHUIViewTool showTipView:[NSString stringWithFormat:@"%@%@",channel,uuid]];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(notificationnew) name:@"duanwangzhuangtai" object:nil];
    
//    [self askForLoginToken];
    
    if (@available(iOS 11.0, *)) {
        self.mainTableView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    }else {
        self.automaticallyAdjustsScrollViewInsets = NO;
    }
    
    _homeTypeArray = [NSMutableArray arrayWithCapacity:0];
     _homeListArray = [NSMutableArray arrayWithCapacity:0];
    
    _mainTableView.separatorStyle = UITableViewCellEditingStyleNone;
    MJRefreshNormalHeader *header = [MJRefreshNormalHeader headerWithRefreshingTarget:self refreshingAction:@selector(headerRefreshing)];
    _mainTableView.mj_header = header;
    header.lastUpdatedTimeLabel.hidden = YES;
    _mainTableView.dataSource = self;
    _mainTableView.delegate = self;
    [header setTitle:@"下拉刷新" forState:MJRefreshStateIdle];
    [header setTitle:@"松开立即刷新" forState:MJRefreshStatePulling];
    [header setTitle:@"加载中 ..." forState:MJRefreshStateRefreshing];
    
    _headView = [ShouYeView customView];
    WS(weakSelf);
    _headView.fourTypeClickBlock = ^(NSInteger tag) {
        if (tag< 5) {
            FourTypeViewController *vc =  [FourTypeViewController new];
            HomeTypeModel *model = weakSelf.homeTypeArray[tag - 1];
            vc.tag = [model.homeId integerValue];
            vc.model = model;
            [weakSelf.navigationController pushViewController:vc animated:YES];
        }else if (tag == 5){
            NSString *uuid = [GSKeyChain getUUID];
            HomeListModel *model = weakSelf.homeListArray[0];
            NSString *mobile = __GetUserPhone;
            NSString* channel = __GetKChannel;
            NSDictionary *dict = @{@"relId" : model.Hlistid,@"refer" :@"1",@"mobile" : mobile,@"uuid": uuid,@"channel" : channel};
            [AFNetworkTool  postJSONWithUrl:[URL_Base stringByAppendingString:@"api/traceProduct"] parameters:dict success:^(id responseObject) {
                if (responseObject) {
                    if ([responseObject[@"code"] integerValue] == 0) {
                        
                    }else{
                        [DBCHUIViewTool showTipView:responseObject[@"msg"]];
                    }
                }
                
            } fail:^{
                
            }];
            
            MyWebViwViewController *vc = [MyWebViwViewController new];
            vc.titleString = model.title;
            vc.urlStr = model.applyurl;
            [weakSelf.navigationController pushViewController:vc animated:YES];
            
        }else{
            AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
            UIViewController *controller = app.window.rootViewController;
            GJFTabbarViewController *vc = (GJFTabbarViewController*)controller;
            [vc setSelectedIndex:1];
        }
        
        
    };
    
    CGFloat  headHeight = 0;
    if (KIsiPhoneX) {
        headHeight = 510;
    }else{
        headHeight = 486;
    }
    
    _headView.frame = CGRectMake(0, 0, SCREEN_WIDTH, headHeight);
    _mainTableView.tableHeaderView = _headView;
    
    [self postTracetraceChannelAppOpenNum];
    
}

- (void)postTracetraceChannelAppOpenNum{
    NSString* channel = __GetKChannel;
    NSDictionary *dict = @{@"channel" :channel};
    [AFNetworkTool postJSONWithUrl: [URL_Base stringByAppendingString:@"api/traceChannelAppOpenNum"] parameters:dict success:^(id responseObject) {
        
    } fail:^{
        
    }];
}


- (void)headerRefreshing{
    [self askforHomeData];
    [_mainTableView.mj_header endRefreshing];
}

- (void)autoLogin{
    NSDictionary *infromDic = __GetUserInfo;
    if (infromDic != nil || [infromDic isKindOfClass:[NSDictionary class]]) {
        
    }else{
        if (YES) {
            LoginViewController *login = [LoginViewController new];
            [self presentViewController:login animated:YES completion:nil];
        }
    }
    
   
}





- (void)askforHomeData{
    WS(weakSelf);
    [AFNetworkTool getJSONWithUrl:[URL_Base stringByAppendingString:@"api/index"] parameters:nil success:^(id responseObject) {
        if (responseObject) {
            if ([responseObject[@"code"] intValue] == 0) {
                [weakSelf.homeTypeArray removeAllObjects];
                [weakSelf.homeListArray removeAllObjects];
                weakSelf.dataDict = responseObject[@"data"];
                NSArray *typeArr =  weakSelf.dataDict[@"types"];
                if (typeArr.count > 0) {
                    for (NSDictionary *dict in typeArr) {
                        HomeTypeModel *mode = [HomeTypeModel new];
                        [mode setValuesForKeysWithDictionary:dict];
                        [weakSelf.homeTypeArray addObject:mode];
                    }
                      
                    [weakSelf.headView SendtypeArray:weakSelf.homeTypeArray];
                    
                }
                
                NSArray *hListArray = weakSelf.dataDict[@"loans"];
                if (hListArray.count > 0) {
                    for (NSDictionary *dict in hListArray) {
                        HomeListModel *mode = [HomeListModel new];
                        [mode setValuesForKeysWithDictionary:dict];
                        [weakSelf.homeListArray addObject:mode];
                    }
                    HomeListModel *firstModel = weakSelf.homeListArray[0];
                    weakSelf.headView.nameLab.text = firstModel.title;
                    weakSelf.headView.jinerLab.text = [NSString stringWithFormat:@"%@-%@",firstModel.minloan,firstModel.maxloan];
                    [weakSelf.mainTableView reloadData];
                }
                
                weakSelf.headView.bannerArray = weakSelf.dataDict[@"banners"];
                
                
                
            }else if([responseObject[@"code"] intValue] == 499){
                LoginViewController *login = [LoginViewController new];
                [self presentViewController:[[UINavigationController alloc]initWithRootViewController:login] animated:YES completion:nil];
            }else{
                [DBCHUIViewTool showTipView:responseObject[@"msg"]];
            }
            
        }
        
    } fail:^{
        
    }];
}



#pragma mark ----tableview
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 100;
}


- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return self.homeListArray.count - 1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    static NSString *identifier = @"HomeGjfTableViewCell";
    
    HomeGjfTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:identifier];
    if (!cell){
        cell = [[NSBundle mainBundle] loadNibNamed:@"HomeGjfTableViewCell" owner:self options:nil][0];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
    HomeListModel *model = self.homeListArray[indexPath.row + 1];
    [cell.iconImgeVC sd_setImageWithURL:[NSURL URLWithString:model.logo]];
    cell.nameLab.text = model.title;
    cell.xiakuanShijianlab.text = model.periodrange;
    cell.tagLab.text = model.tags;
    cell.jinerLab.text = [NSString stringWithFormat:@"%@~%@",model.minloan,model.maxloan];
    
    
    

    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    NSString *uuid = [GSKeyChain getUUID];
    HomeListModel *model = self.homeListArray[indexPath.row + 1];
    NSString *mobile = __GetUserPhone;
    NSString* channel = __GetKChannel;
    NSDictionary *dict = @{@"relId" : model.Hlistid,@"refer" :@"1",@"mobile" : mobile,@"uuid": uuid,@"channel" : channel};
    [AFNetworkTool  postJSONWithUrl:[URL_Base stringByAppendingString:@"api/traceProduct"] parameters:dict success:^(id responseObject) {
        if (responseObject) {
            if ([responseObject[@"code"] integerValue] == 0) {
               
            }else{
                [DBCHUIViewTool showTipView:responseObject[@"msg"]];
            }
        }
        
    } fail:^{
        
    }];
    
    MyWebViwViewController *vc = [MyWebViwViewController new];
    vc.titleString = model.title;
    vc.urlStr = model.applyurl;
    [self.navigationController pushViewController:vc animated:YES];

}


@end

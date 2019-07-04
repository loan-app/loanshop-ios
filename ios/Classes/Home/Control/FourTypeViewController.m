//
//  FourTypeViewController.m
//  chaoshimiao
//
//  Created by zhangze on 2019/4/11.
//  Copyright © 2019 gjf. All rights reserved.
//

#import "FourTypeViewController.h"
#import "HomeGjfTableViewCell.h"

#import "HomeListModel.h"

@interface FourTypeViewController ()<UITableViewDataSource,UITableViewDelegate>

@property (weak, nonatomic) IBOutlet UITableView *mainTableView;
@property (nonatomic, strong) NSMutableArray *homeListArray;

@property (nonatomic, strong) UIImageView *headImageBtnVC;

@property (nonatomic, assign) NSInteger page;

@property (nonatomic, assign) BOOL isPull;

@end

@implementation FourTypeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    _page = 1;
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
     _mainTableView.mj_footer=[MJRefreshBackNormalFooter footerWithRefreshingTarget:self refreshingAction:@selector(pushLoadMore)];
    
    _headImageBtnVC = [[UIImageView alloc]init];
    _headImageBtnVC.frame = CGRectMake(0, 0, SCREEN_WIDTH, 163);
    _mainTableView.tableHeaderView = _headImageBtnVC;
    
    [self askForData];
}

- (void)headerRefreshing{
    _isPull = YES;
    _page = 1;
    [self askForData];
    
//    [_mainTableView.mj_header endRefreshing];
}

-(void)pushLoadMore{
    _page += 1;
     _isPull = NO;
     [self askForData];
    
}

- (void)setModel:(HomeTypeModel *)model{
    _model = model;
    self.title = model.name;
//    WS(weakSelf);
//    if ([model.homeId integerValue] == 1) {
//        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//            weakSelf.headImageBtnVC.image = [UIImage imageNamed:@"h1.png"];
//
//        });
//
//
//    }else if ([model.homeId integerValue] == 2){
//        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//             weakSelf.headImageBtnVC.image = [UIImage imageNamed:@"h1.png"];
//        });
//
//    }else if ([model.homeId integerValue] == 3){
//        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//             weakSelf.headImageBtnVC.image = [UIImage imageNamed:@"h1.png"];
//        });
//
//    }else if ([model.homeId integerValue] == 4){
//        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//             weakSelf.headImageBtnVC.image = [UIImage imageNamed:@"h1.png"];
//        });
//
//    }
}

- (void)askForData{
    
    NSDictionary *dic = @{@"page" : [NSString stringWithFormat:@"%ld",(long)_page], @"limit" : @"10",@"type": _model.homeId};
    WS(weakSelf);
    [AFNetworkTool getJSONWithUrl:[URL_Base stringByAppendingString:@"api/getTypeLoanList"] parameters:dic success:^(id responseObject) {
        if (responseObject) {
            if (weakSelf.isPull) {
                [weakSelf.homeListArray removeAllObjects];
            }
            NSDictionary *dataDic = responseObject[@"data"];
            NSLog(@"---gjf%@",dataDic);
            if (dataDic && dataDic.count > 0 ) {
                NSArray *list = dataDic[@"list"];
                if (list.count > 0) {
                    for (NSDictionary *dict in list) {
                        HomeListModel *mode = [HomeListModel new];
                        [mode setValuesForKeysWithDictionary:dict];
                        [weakSelf.homeListArray addObject:mode];
                    }
                }
            }
            [weakSelf.headImageBtnVC sd_setImageWithURL:[NSURL URLWithString:dataDic[@"typeBanner"]]];
            [weakSelf.mainTableView reloadData];
        }
        if (weakSelf.isPull) {
            [weakSelf.mainTableView.mj_header endRefreshing];
        }else{
            [weakSelf.mainTableView.mj_footer endRefreshing];
        }
        
    } fail:^{
        if (weakSelf.isPull) {
            [weakSelf.mainTableView.mj_header endRefreshing];
        }else{
            [weakSelf.mainTableView.mj_footer endRefreshing];
        }
    }];
}

#pragma mark ----tableview
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 100;
}


- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return _homeListArray.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    static NSString *identifier = @"HomeGjfTableViewCell";
    
    HomeGjfTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:identifier];
    if (!cell){
        cell = [[NSBundle mainBundle] loadNibNamed:@"HomeGjfTableViewCell" owner:self options:nil][0];
    }
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    
 
    
    HomeListModel *model = self.homeListArray[indexPath.row];
    [cell.iconImgeVC sd_setImageWithURL:[NSURL URLWithString:model.logo]];
    cell.nameLab.text = model.title;
    cell.xiakuanShijianlab.text = model.periodrange;
    cell.tagLab.text = model.tags;
    cell.jinerLab.text = [NSString stringWithFormat:@"%@~%@",model.minloan,model.maxloan];
    
    
    
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    
    NSString *uuid = [GSKeyChain getUUID];
    HomeListModel *model = self.homeListArray[indexPath.row];
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
    
//    MyWebViwViewController *vc = [MyWebViwViewController new];
//    vc.titleString = model.title;
//    vc.urlStr = model.applyurl;
//    [self.navigationController pushViewController:vc animated:YES];
  
  MyWebViwViewController *vc = [MyWebViwViewController sharedSingleton];
  vc.titleString = model.title;
  vc.view.hidden = NO;
  vc.urlStr = model.applyurl;
  [vc startReload];
  [self.navigationController pushViewController:vc animated:YES];
    
    
}


@end

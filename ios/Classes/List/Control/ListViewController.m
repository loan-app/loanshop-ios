//
//  ListViewController.m
//  chaoshimiao
//
//  Created by zhangze on 2019/4/9.
//  Copyright © 2019 gjf. All rights reserved.
//

#import "ListViewController.h"
#import "HomeGjfTableViewCell.h"
#import "ShuaiViewController.h"
#import "ShuaiTableViewCell.h"
#import "ShuanxuanModel.h"
#import "HomeListModel.h"

@interface ListViewController ()<UITableViewDataSource,UITableViewDelegate>
@property (weak, nonatomic) IBOutlet UITableView *mainTableView;
@property (weak, nonatomic) IBOutlet UILabel *oneLab;

@property (weak, nonatomic) IBOutlet UILabel *twoLab;
@property (weak, nonatomic) IBOutlet UILabel *threeLab;

@property (weak, nonatomic) IBOutlet UIImageView *oneImg;
@property (weak, nonatomic) IBOutlet UIImageView *twoImg;
@property (weak, nonatomic) IBOutlet UIImageView *threeImg;

@property (weak, nonatomic) IBOutlet UIView *ShuanXuanView;

@property (weak, nonatomic) IBOutlet NSLayoutConstraint *heightConstant;
@property (weak, nonatomic) IBOutlet UIButton *dismissBtn;

@property (nonatomic, strong) NSDictionary *dataDict;

@property (nonatomic, strong) NSArray *judgeShowArray;

@property (nonatomic, strong) NSArray *roteImgArray;


@property (weak, nonatomic) IBOutlet UITableView *sortTableViw;

@property (nonatomic, strong) NSMutableArray *oneTiaojianArray;
@property (nonatomic, strong) NSMutableArray *twoTiaojianArray;
@property (nonatomic, strong) NSMutableArray *threeTiaojianArray;

@property (nonatomic, strong) NSString *jinerKey;
@property (nonatomic, strong) NSString *sortKey;
@property (nonatomic, strong) NSString *shuanxuanKey;

@property (nonatomic, strong) NSMutableArray *homeListArray;
@property (nonatomic, assign) NSInteger page;
@property (nonatomic, assign) BOOL isPull;

@end

@implementation ListViewController

- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES animated:animated];
}

- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO animated:animated];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    _page = 1;
    _jinerKey = @"";
    _sortKey =  @"";
    _shuanxuanKey = @"";
    _homeListArray = [NSMutableArray arrayWithCapacity:0];
    _heightConstant.constant = 0;
    _oneTiaojianArray = [NSMutableArray arrayWithCapacity:0];
    _twoTiaojianArray = [NSMutableArray arrayWithCapacity:0];
    _threeTiaojianArray = [NSMutableArray arrayWithCapacity:0];
    
    _judgeShowArray = @[@"0",@"0",@"0"];
    _roteImgArray = @[_oneImg,_twoImg,_threeImg];
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
    
    [self getFiltrate];
    
    _sortTableViw.dataSource = self;
    _sortTableViw.delegate = self;
    _sortTableViw.autoresizesSubviews = YES;
    _sortTableViw.separatorStyle = UITableViewCellEditingStyleNone;
    
    [_mainTableView reloadData];
    
//    [self getListDataWitTag:@"1" Fast:@"1" andBadge:@"1"];
    [self getListDataWitTag:_sortKey amount:_jinerKey andBadge:_shuanxuanKey];

}

//- (void)headerRefreshing{
//    [_mainTableView.mj_header endRefreshing];
//}

- (void)headerRefreshing{
    _isPull = YES;
    _page = 1;
     [self getListDataWitTag:_sortKey amount:_jinerKey andBadge:_shuanxuanKey];
}

-(void)pushLoadMore{
    _page += 1;
    _isPull = NO;
    [self getListDataWitTag:_sortKey amount:_jinerKey andBadge:_shuanxuanKey];
    
}

- (void)getFiltrate{
    WS(weakSelf);
    [AFNetworkTool getJSONWithUrl:[URL_Base stringByAppendingString:@"api/getFiltrate"] parameters:nil success:^(id responseObject) {
        if (responseObject) {
            NSDictionary *dataDic = responseObject[@"data"];
            if (dataDic.count > 0 && dataDic) {
                weakSelf.dataDict = dataDic;
                [weakSelf handleShuanXuan];
            }
        }
        
    } fail:^{
        
    }];
}

- (void)getListDataWitTag:(NSString *)tag amount: (NSString *)amount andBadge: (NSString *)badge{
    WS(weakSelf);
   
    NSDictionary *dict = @{@"page":[NSString stringWithFormat:@"%ld",(long)_page],@"limit": @"10",@"tags" :badge, @"badge" : tag,@"amount": amount};
    [AFNetworkTool getJSONWithUrl:[URL_Base stringByAppendingString:@"api/getLoanList"] parameters:dict success:^(id responseObject) {
        if (responseObject) {
            if (weakSelf.isPull) {
                [weakSelf.homeListArray removeAllObjects];
            }
            NSDictionary *dataDic = responseObject[@"data"];
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

- (void)handleShuanXuan{
    NSArray *moneyFiltrate = self.dataDict[@"moneyFiltrate"];
    for (NSDictionary *dic in moneyFiltrate) {
        ShuanxuanModel *moel = [ShuanxuanModel new];
        [moel setValuesForKeysWithDictionary:dic];
        [self.oneTiaojianArray addObject:moel];
    }
    
    NSArray *tagsFiltrate = self.dataDict[@"tagsFiltrate"];
    for (NSDictionary *dic in tagsFiltrate) {
        ShuanxuanModel *moel = [ShuanxuanModel new];
        [moel setValuesForKeysWithDictionary:dic];
        [self.twoTiaojianArray addObject:moel];
    }
    
    NSArray *typesortFiltrate = self.dataDict[@"typesortFiltrate"];
    for (NSDictionary *dic in typesortFiltrate) {
        ShuanxuanModel *moel = [ShuanxuanModel new];
        [moel setValuesForKeysWithDictionary:dic];
        [self.threeTiaojianArray addObject:moel];
    }
    NSLog(@"11");

}

- (IBAction)clickShuanXuan:(UIButton *)sender {
    switch (sender.tag) {
        case 1:
            {
                if ([_judgeShowArray[0] isEqualToString:@"0"]) {
                    _judgeShowArray = @[@"1",@"0",@"0"];
                     [self showView];
                     [self.sortTableViw reloadData];
                }else{
                    [self changeView];
                }
                
               
            }
            break;
        case 2:
        {
            if ([_judgeShowArray[1] isEqualToString:@"0"]) {
                _judgeShowArray = @[@"0",@"1",@"0"];
                 [self showView];
                 [self.sortTableViw reloadData];
            }else{
               [self changeView];
            }
           
            
        }
            break;
        case 3:
        {
            if ([_judgeShowArray[2] isEqualToString:@"0"]) {
                _judgeShowArray = @[@"0",@"0",@"1"];
                 [self showView];
                [self.sortTableViw reloadData];
            }else{
                [self changeView];
            }
        }
            break;
            
        default:
            break;
    }
    
}

- (IBAction)hiedClick:(id)sender {
    [self changeView];
}

- (void)changeView{
    _judgeShowArray = @[@"0",@"0",@"0"];
    [self dismissView];
    for (NSInteger i = 0; i < _judgeShowArray.count; i++) {
        NSString *isNeedShow = _judgeShowArray[i];
        UIImageView *imgVC = _roteImgArray[i];
        if ([isNeedShow isEqualToString:@"1"]) {
            imgVC.transform = CGAffineTransformRotate(_oneImg.transform, M_PI);
        }else{
            imgVC.transform = CGAffineTransformIdentity;
        }
    }
}

- (void)dismissView{
    WS(weakSelf);
    _dismissBtn.hidden = YES;
    [self.view setNeedsUpdateConstraints];
    [UIView animateWithDuration:0.3 animations:^{
        weakSelf.heightConstant.constant = 0;
        [self.view layoutIfNeeded];
    }];
}

- (void)showView{
    for (NSInteger i = 0; i < _judgeShowArray.count; i++) {
        NSString *isNeedShow = _judgeShowArray[i];
        UIImageView *imgVC = _roteImgArray[i];
        if ([isNeedShow isEqualToString:@"1"]) {
            imgVC.transform = CGAffineTransformRotate(_oneImg.transform, M_PI);
        }else{
            imgVC.transform = CGAffineTransformIdentity;
        }
    }
    
    for (NSInteger i = 0; i < _judgeShowArray.count; i++) {
        NSString *isNeedShow = _judgeShowArray[i];
        if ([isNeedShow isEqualToString:@"1"]) {
            WS(weakSelf);
            _dismissBtn.hidden = NO;
            [self.view setNeedsUpdateConstraints];
            [UIView animateWithDuration:0.3 animations:^{
                weakSelf.heightConstant.constant = 160;
                [self.view layoutIfNeeded];
            }];
            
            return;
        }else{
            

            [self dismissView];
        }
        
    }
    
    
//    [self rotateView:_oneImg];
}

- (void)rotateView:(UIImageView *)view
{
    _oneImg.transform = CGAffineTransformRotate(_oneImg.transform, M_PI);

}



#pragma mark ----tableview
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    if (tableView == _sortTableViw){
        return 38;
    }else{
        return 100;
    }
    
    return 100;
}


- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    if (tableView == _sortTableViw){
        for (NSInteger i = 0; i < _judgeShowArray.count; i++) {
            NSString *isNeedShow = _judgeShowArray[i];

            if ([isNeedShow isEqualToString:@"1"]) {
                if (i == 0) {
                    return _oneTiaojianArray.count;
                }
                if (i == 1) {
                    return _twoTiaojianArray.count;
                }
                if (i == 2) {
                    return _threeTiaojianArray.count;
                }
            }
//            return 4;
        }
        
    }else{
        return _homeListArray.count;
    }
    return 0;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    if (tableView == _sortTableViw) {
        static NSString *identifier = @"ShuaiTableViewCell";
        
        ShuaiTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:identifier];
        if (!cell){
            cell = [[NSBundle mainBundle] loadNibNamed:@"ShuaiTableViewCell" owner:self options:nil][0];
        }
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
        
        for (NSInteger i = 0; i < _judgeShowArray.count; i++) {
            NSString *isNeedShow = _judgeShowArray[i];
            
            if ([isNeedShow isEqualToString:@"1"]) {
                if (i == 0) {
                    ShuanxuanModel *model = _oneTiaojianArray[indexPath.row];
                    cell.titleLab.text = model.name;
                    if ([model.isSelect isEqualToString:@"1"]) {
                        cell.titleLab.textColor = RGB(254, 100, 80);
                        _oneLab.text = model.name;
                        _oneLab.textColor = RGB(254, 100, 80);
                        _oneImg.image = [UIImage imageNamed:@"xialaSe"];
                    }else{
                        cell.titleLab.textColor = [UIColor blackColor];
                    }
                }
                if (i == 1) {
                    ShuanxuanModel *model = _twoTiaojianArray[indexPath.row];
                    cell.titleLab.text = model.name;
                    if ([model.isSelect isEqualToString:@"1"]) {
                        cell.titleLab.textColor = RGB(254, 100, 80);
                        _twoLab.text = model.name;
                        _twoLab.textColor = RGB(254, 100, 80);
                        _twoImg.image = [UIImage imageNamed:@"xialaSe"];
                        
                    }else{
                        cell.titleLab.textColor = [UIColor blackColor];
                    }
                }
                if (i == 2) {
                    ShuanxuanModel *model = _threeTiaojianArray[indexPath.row];
                    cell.titleLab.text = model.name;
                    if ([model.isSelect isEqualToString:@"1"]) {
                        cell.titleLab.textColor = RGB(254, 100, 80);
                        _threeLab.text = model.name;
                        _threeLab.textColor = RGB(254, 100, 80);
                        _threeImg.image = [UIImage imageNamed:@"xialaSe"];
                    }else{
                        cell.titleLab.textColor = [UIColor blackColor];
                    }
                }
            }
        }
        
        return cell;
    }else{
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
    
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    
    if (tableView == _sortTableViw){
        for (NSInteger i = 0; i < _judgeShowArray.count; i++) {
            NSString *isNeedShow = _judgeShowArray[i];
            
            if ([isNeedShow isEqualToString:@"1"]) {
                if (i == 0) {
                    for (NSInteger i = 0; i < _oneTiaojianArray.count; i++) {
                        ShuanxuanModel *model = _oneTiaojianArray[i];
                        if (i == indexPath.row) {
                            model.isSelect = @"1";
                            _jinerKey = model.key;
                        }else{
                            model.isSelect = @"0";
                        }
                    }
                    
                    
                }
                if (i == 1) {
                    for (NSInteger i = 0; i < _twoTiaojianArray.count; i++) {
                        ShuanxuanModel *model = _twoTiaojianArray[i];
                        if (i == indexPath.row) {
                            model.isSelect = @"1";
                            _sortKey = model.key;
                            
                        }else{
                            model.isSelect = @"0";
                        }
                    }
                }
                if (i == 2) {
                    for (NSInteger i = 0; i < _threeTiaojianArray.count; i++) {
                        ShuanxuanModel *model = _threeTiaojianArray[i];
                        if (i == indexPath.row) {
                            model.isSelect = @"1";
                            _shuanxuanKey = model.key;
                        }else{
                            model.isSelect = @"0";
                        }
                    }
                }
            }
           
           
            [_sortTableViw reloadData];
            WS(weakSelf);
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                 [self changeView];
                 weakSelf.isPull = YES;
                 [self getListDataWitTag:weakSelf.sortKey amount:weakSelf.jinerKey andBadge:weakSelf.shuanxuanKey];
                
            });
        }
    }else{
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
        
        MyWebViwViewController *vc = [MyWebViwViewController new];
        vc.titleString = model.title;
        vc.urlStr = model.applyurl;
        [self.navigationController pushViewController:vc animated:YES];
        
    }
}


- (IBAction)scorllToTop:(id)sender {
     [self.mainTableView scrollRectToVisible:CGRectMake(0, 0, 1, 1) animated:YES];
}

@end

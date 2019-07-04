//
//  HomeGjfTableViewCell.h
//  XFlowers
//
//  Created by zhangze on 2019/4/2.
//  Copyright © 2019 gjf. All rights reserved.
//

#import "ShouYeView.h"
#import "SDCycleScrollView.h"
#import "GJFTabbarViewController.h"
#import "MyWebViwViewController.h"

@interface ShouYeView ()<SDCycleScrollViewDelegate>

@end

@implementation ShouYeView

+ (id)customView{
    return [[[NSBundle mainBundle] loadNibNamed:@"ShouYeView" owner:nil options:nil] firstObject];
}

- (id)initWithCoder:(NSCoder *)aDecoder {
    if (self = [super initWithCoder:aDecoder]) {
        self.autoresizingMask = UIViewAutoresizingNone;
    }
    return self;
}

- (void)SendtypeArray: (NSArray<HomeTypeModel *> *)typeArray{
    
    _oneLab.text = typeArray[0].name;
    _twoLab.text = typeArray[1].name;
    _threeLab.text = typeArray[2].name;
    _fourLab.text = typeArray[3].name;
    
    
}


- (void)setBannerArray:(NSArray *)bannerArray{
    _bannerArray = bannerArray;
    
    NSMutableArray *imageUrl = [NSMutableArray arrayWithCapacity:0];
    for (NSDictionary *dict in bannerArray) {
        [imageUrl addObject:dict[@"imgurl"]];
    }
    
//    SDCycleScrollView *cycleScrollView = [SDCycleScrollView cycleScrollViewWithFrame:CGRectMake(_lunbo.frame.origin.x, _lunbo.frame.origin.y, _lunbo.frame.size.width * SCREEN_WIDTH_SCAL , _lunbo.frame.size.height) shouldInfiniteLoop:YES imageNamesGroup:imageNames];
    SDCycleScrollView *cycleScrollView = [SDCycleScrollView cycleScrollViewWithFrame:CGRectZero imageURLStringsGroup:imageUrl];
    [cycleScrollView cornerRadius:5];
    cycleScrollView.delegate = self;
    cycleScrollView.pageControlStyle = SDCycleScrollViewPageContolAlimentRight;
    [self addSubview:cycleScrollView];
    cycleScrollView.scrollDirection = UICollectionViewScrollDirectionHorizontal;
    WS(weakSelf);
    [cycleScrollView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.offset = 25;
        make.right.offset = -25;
        if (KIsiPhoneX) {
            weakSelf.topConatant.constant = 54;
            make.top.offset =  54;
            
        }else{
            weakSelf.topConatant.constant = 30;
            make.top.offset = 30;
        }
        
        
        make.height.offset = 160;
    }];
    
    
    
    
}

- (void)awakeFromNib{
    [super awakeFromNib];
    [_HomeShenqingBtn cornerRadius:10];
    
    
    
}


- (void)cycleScrollView:(SDCycleScrollView *)cycleScrollView didSelectItemAtIndex:(NSInteger)index
{
    AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
    UIViewController *controller = app.window.rootViewController;
    GJFTabbarViewController *vc = (GJFTabbarViewController*)controller;
    UINavigationController *nav = vc.viewControllers[0];
    
    NSString *uuid = [GSKeyChain getUUID];
    NSDictionary *dict = _bannerArray[index];
    NSString *mobile = __GetUserPhone;
    NSString* channel = __GetKChannel;
    NSDictionary *dicta = @{@"relId" : dict[@"loanId"],@"refer" :@"1",@"mobile" : mobile,@"uuid": uuid,@"channel" : channel};
    [AFNetworkTool  postJSONWithUrl:[URL_Base stringByAppendingString:@"api/traceProduct"] parameters:dicta success:^(id responseObject) {
        if (responseObject) {
            if ([responseObject[@"code"] integerValue] == 0) {
                
            }else{
                [DBCHUIViewTool showTipView:responseObject[@"msg"]];
            }
        }
        
    } fail:^{
        
    }];
    
//    MyWebViwViewController *vc1 = [MyWebViwViewController new];
//    vc1.titleString =dict[@"title"];
//    vc1.urlStr = dict[@"gourl"];
//    [nav pushViewController:vc1 animated:YES];
  
  MyWebViwViewController *vc1 = [MyWebViwViewController sharedSingleton];
  vc1.titleString = dict[@"title"];
  vc1.view.hidden = NO;
  vc1.urlStr = dict[@"gourl"];
  [vc1 startReload];
  [nav pushViewController:vc1 animated:YES];
    
    
    NSLog(@"---点击了第%ld张图片", (long)index);
    
   
    
//    [self.navigationController pushViewController:[NSClassFromString(@"DemoVCWithXib") new] animated:YES];
}

- (IBAction)click:(UIButton *)sender {
    BLOCK_EXEC(self.fourTypeClickBlock,sender.tag);
}




@end

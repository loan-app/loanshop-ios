//
//  LoginViewController.m
//  XFlowers
//
//  Created by zhangze on 2019/3/1.
//  Copyright © 2019 gjf. All rights reserved.
//

#import "LoginViewController.h"

#import "NSString+Checkout.h"

#import "OpenInstallSDK.h"


//#import <AdSupport/AdSupport.h>

@interface LoginViewController ()<UITextFieldDelegate>
@property (weak, nonatomic) IBOutlet UITextField *phoneTF;

@property (weak, nonatomic) IBOutlet UITextField *yanzhengmaTF;

@property (weak, nonatomic) IBOutlet UIButton *loginBtn;

@property (weak, nonatomic) IBOutlet UIView *huoquyanzhengmaView;

@property (weak, nonatomic) IBOutlet UILabel *timeLab;

@property (weak, nonatomic) IBOutlet UIButton *yanzhengmaBtn;

@property (nonatomic, strong) NSTimer *timer;

@property (nonatomic, assign) int time_60s;

@end

@implementation LoginViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [_yanzhengmaBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [_yanzhengmaBtn setBackgroundColor:RGB(237, 112, 92)];
    [_yanzhengmaBtn cornerRadius:5];
    _time_60s = 60;
    [_loginBtn cornerRadius:10];
    _phoneTF.delegate = self;
    _yanzhengmaTF.delegate = self;
    [_yanzhengmaTF addTarget:self action:@selector(tfChanged:) forControlEvents:UIControlEventEditingChanged];
    [_phoneTF addTarget:self action:@selector(tfChanged:) forControlEvents:UIControlEventEditingChanged];
}

- (void)tfChanged:(UITextField *)tf{
    if (_yanzhengmaTF.text.length > 0 && _phoneTF.text.length > 0) {
        _loginBtn.enabled = YES;
        [_loginBtn setBackgroundColor:RGB(237, 112, 92)];
    }else{
        _loginBtn.enabled = NO;
        [_loginBtn setBackgroundColor: RGB(201, 201, 201)];
    }
}

- (void)postTraceMdevic{
    NSString *uuid = [GSKeyChain getUUID];
//    NSString *adId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
    NSString* channel = __GetKChannel;
    NSDictionary *dict = @{@"uuid" :uuid,@"channel" :channel};
    [AFNetworkTool postJSONWithUrl: [URL_Base stringByAppendingString:@"api/traceMdevice"] parameters:dict success:^(id responseObject) {
        
    } fail:^{
        
    }];
}

- (void)postTraceChannel{
    NSString* channel = __GetKChannel;
    NSDictionary *dict = @{@"channel" :channel};
    [AFNetworkTool postJSONWithUrl: [URL_Base stringByAppendingString:@"api/traceChannel"] parameters:dict success:^(id responseObject) {
        
    } fail:^{
        
    }];
}




- (IBAction)getYanzhengmaClick:(id)sender {
    
        if ([_phoneTF.text firstMatchRegex:@"^1(3|4|5|6|7|8|9)[0-9]\\d{8}$"] == nil ) {
            [DBCHUIViewTool showTipView:@"手机号码格式不正确"];
            return;
        }
    
    [self askForSendCodeWithPhone:_phoneTF.text];
    _timer=[NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(ChangeTimer) userInfo:nil repeats:YES];
    _timeLab.hidden = NO;
    _yanzhengmaBtn.hidden = YES;
    [_yanzhengmaBtn setTitle:@"重新获取" forState:UIControlStateNormal];
    _yanzhengmaBtn.titleLabel.textColor = [UIColor whiteColor];
}

- (void)askForSendCodeWithPhone:(NSString *)phone{
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString *app_Name = [infoDictionary objectForKey:@"CFBundleDisplayName"];
    NSString* channel = __GetKChannel;
    NSDictionary *dic = @{@"mobile":phone,@"chName":app_Name,@"chCode":channel};
    [AFNetworkTool postWithUrl:[URL_Base stringByAppendingString:@"api/getVcode"] parameters:dic success:^(id responseObject) {
        if (responseObject) {
            if ([responseObject[@"code"] integerValue] == 0) {
                [DBCHUIViewTool showTipView:@"验证码已发送到您的手机~"];
            }else{
                [DBCHUIViewTool showTipView:responseObject[@"msg"]];
            }
        }
        
    } fail:^{
        
    }];
    
}

-(void)ChangeTimer{
    _time_60s--;
    _timeLab.text=[NSString stringWithFormat:@"%dS后",_time_60s];
    if (_time_60s==0) {
        [_timer invalidate];
        _timeLab.hidden = YES;
        _yanzhengmaBtn.hidden = NO;
        _timeLab.text=[NSString stringWithFormat:@"%dS后",60];
        _time_60s = 60;
        _yanzhengmaBtn.titleLabel.textColor = [UIColor whiteColor];
      
    }
}
- (IBAction)login:(id)sender {
    
    [self askForAuthLoginWithPhoneCode:_yanzhengmaTF.text];
}

- (void)askForAuthLoginWithPhoneCode: (NSString *)code{
    if (_phoneTF.text.length == 0) {
        [DBCHUIViewTool showTipView:@"请输入手机号码"];
        return;
    }
    
    if (_yanzhengmaTF.text.length == 0) {
        [DBCHUIViewTool showTipView:@"请输入验证码"];
        return;
    }
    
    if ([_phoneTF.text firstMatchRegex:@"^1(3|4|5|6|7|8|9)[0-9]\\d{8}$"] == nil ) {
        [DBCHUIViewTool showTipView:@"手机号码格式不正确"];
        return;
    }
    WS(weakSelf);
    NSString* channel = __GetKChannel;
    NSDictionary *dict = @{@"mobile" : _phoneTF.text,@"vcode" :_yanzhengmaTF.text,@"channel":channel};
    [AFNetworkTool  postJSONWithUrl:[URL_Base stringByAppendingString:@"api/mobileLogin"] parameters:dict success:^(id responseObject) {
        if (responseObject) {
            if ([responseObject[@"code"] integerValue] == 0) {
                [__UserDefaults setObject:responseObject forKey:KUserInfo];
                [__UserDefaults setObject:weakSelf.phoneTF.text forKey:KUserPhone];
                [weakSelf postTraceMdevic];
                [weakSelf postTraceChannel];
                [OpenInstallSDK reportRegister];
                [weakSelf dismissViewControllerAnimated:YES completion:nil];
            }else{
                [DBCHUIViewTool showTipView:responseObject[@"msg"]];
            }
        }else{
            [DBCHUIViewTool showTipView:responseObject[@"msg"]];
        }
        
    } fail:^{
        
    }];
}



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

- (IBAction)xieyiCLikc:(id)sender {
    UIViewController *VC = [UIViewController new];
    VC.title = @"个人信息使用协议";
    UIWebView *webview = [UIWebView new];
    VC.view = webview;
    
    NSURL *url = [NSURL URLWithString:@"http://101.132.162.163:9090"];
    [webview loadRequest:[NSURLRequest requestWithURL:url]];
    [self.navigationController pushViewController:VC animated:YES];
//    [self presentViewController:VC animated:YES completion:nil];
    
}

- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES animated:animated];
}



- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO animated:animated];
}




@end

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
#import <CommonCrypto/CommonCryptor.h>

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
@property (weak, nonatomic) IBOutlet UIImageView *tuxingImageVC;
@property (weak, nonatomic) IBOutlet UITextField *tuxingTF;

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
    if (_tuxingTF.text.length == 0) {
        [DBCHUIViewTool showTipView:@"请输入图形验证码"];
        return;
    }
    
  NSString *plainText = _phoneTF.text;
  NSString *key = @"dkmzz123";
  // 加密
  NSData *enDataRes = [LoginViewController DESEncrypt:[plainText dataUsingEncoding:NSUTF8StringEncoding] WithKey:key];
  NSLog(@"%@",[enDataRes base64EncodedStringWithOptions:NSUTF8StringEncoding]);
    [self askForSendCodeWithPhone:[enDataRes base64EncodedStringWithOptions:NSUTF8StringEncoding]];
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
    NSString *uuid = [GSKeyChain getUUID];
  NSDictionary *dic = @{@"mobile":phone,@"chName":app_Name,@"chCode":channel,@"imgCode":_tuxingTF.text,@"uuid":uuid};
    [AFNetworkTool postWithUrl:[URL_Base stringByAppendingString:@"api/v2/getVcode"] parameters:dic success:^(id responseObject) {
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
                [weakSelf postTAL];
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

//上报登录成功
- (void)postTAL{
  NSString *uuid = [GSKeyChain getUUID];
  NSString* channel = __GetKChannel;
  NSDictionary *dict = @{@"mac" :uuid,@"channel" :channel,@"type" : @"1"};
  [AFNetworkTool postJSONWithUrl: [URL_Base stringByAppendingString:@"api/tal"] parameters:dict success:^(id responseObject) {
    
  } fail:^{
    
  }];
}

- (IBAction)xieyiCLikc:(id)sender {
    UIViewController *VC = [UIViewController new];
    VC.title = @"个人信息使用协议";
    UIWebView *webview = [UIWebView new];
    VC.view = webview;
    NSURL *url = [NSURL URLWithString:@"http://101.132.162.163:9090"];
    [webview loadRequest:[NSURLRequest requestWithURL:url]];
    [self.navigationController pushViewController:VC animated:YES];
    
}

- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES animated:animated];
    [self askTuxingData];
}

- (void)askTuxingData{
    NSString *timeStr = [LoginViewController getNowTimeTimestamp];
    NSString *imgUrl = [URL_Base stringByAppendingString:@"api/captcha.jpg"];
    NSString *uuid = [GSKeyChain getUUID];
    NSString *changeUrl = [NSString stringWithFormat:@"%@?uuid=%@&t=%@",imgUrl,uuid,timeStr];
    [self.tuxingImageVC sd_setImageWithURL:[NSURL URLWithString:changeUrl]];
}

- (IBAction)tuxingchange:(id)sender {
    NSString *timeStr = [LoginViewController getNowTimeTimestamp];
    NSString *imgUrl = [URL_Base stringByAppendingString:@"api/captcha.jpg"];
    NSString *uuid = [GSKeyChain getUUID];
    NSString *changeUrl = [NSString stringWithFormat:@"%@?uuid=%@&t=%@",imgUrl,uuid,timeStr];
    [self.tuxingImageVC sd_setImageWithURL:[NSURL URLWithString:changeUrl]];
}

+(NSString *)getNowTimeTimestamp{
  
  NSDateFormatter *formatter = [[NSDateFormatter alloc] init] ;
  
  [formatter setDateStyle:NSDateFormatterMediumStyle];
  
  [formatter setTimeStyle:NSDateFormatterShortStyle];
  
  [formatter setDateFormat:@"YYYY-MM-dd HH:mm:ss"]; // ----------设置你想要的格式,hh与HH的区别:分别表示12小时制,24小时制
  
  //设置时区,这个对于时间的处理有时很重要
  
  NSTimeZone* timeZone = [NSTimeZone timeZoneWithName:@"Asia/Shanghai"];
  
  [formatter setTimeZone:timeZone];
  
  NSDate *datenow = [NSDate date];//现在时间,你可以输出来看下是什么格式
  
  NSString *timeSp = [NSString stringWithFormat:@"%ld", (long)[datenow timeIntervalSince1970]];
  
  return timeSp;
  
}


- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO animated:animated];
}

#pragma mark - CBC

+ (NSData *)DESEncrypt:(NSData *)data WithKey:(NSString *)key
{   // DES密钥参与运算的只有64位，超出的部分并不参与加密运算
  char keyPtr[kCCKeySizeAES256+1];
  bzero(keyPtr, sizeof(keyPtr));
  [key getCString:keyPtr maxLength:sizeof(keyPtr) encoding:NSUTF8StringEncoding];
  
  NSUInteger dataLength = [data length];
  
  size_t bufferSize = dataLength + kCCBlockSizeAES128;
  void *buffer = malloc(bufferSize);
  NSData *keybyte = [key dataUsingEncoding:NSUTF8StringEncoding];
  size_t numBytesEncrypted = 0;
  CCCryptorStatus cryptStatus = CCCrypt(kCCEncrypt, kCCAlgorithmDES,
                                        kCCOptionPKCS7Padding,
                                        keyPtr, kCCBlockSizeDES,
                                        [keybyte bytes],
                                        [data bytes], dataLength,
                                        buffer, bufferSize,
                                        &numBytesEncrypted);
  if (cryptStatus == kCCSuccess) {
    return [NSData dataWithBytesNoCopy:buffer length:numBytesEncrypted];
  }
  free(buffer);
  return nil;
}

+ (NSData *)DESDecrypt:(NSData *)data WithKey:(NSString *)key
{
  char keyPtr[kCCKeySizeAES256+1];
  bzero(keyPtr, sizeof(keyPtr));
  
  [key getCString:keyPtr maxLength:sizeof(keyPtr) encoding:NSUTF8StringEncoding];
  
  NSUInteger dataLength = [data length];
  
  size_t bufferSize = dataLength + kCCBlockSizeAES128;
  void *buffer = malloc(bufferSize);
  NSData *keybyte = [key dataUsingEncoding:NSUTF8StringEncoding];
  size_t numBytesDecrypted = 0;
  CCCryptorStatus cryptStatus = CCCrypt(kCCDecrypt, kCCAlgorithmDES,
                                        kCCOptionPKCS7Padding,
                                        keyPtr, kCCBlockSizeDES,
                                        [keybyte bytes],
                                        [data bytes], dataLength,
                                        buffer, bufferSize,
                                        &numBytesDecrypted);
  
  if (cryptStatus == kCCSuccess) {
    return [NSData dataWithBytesNoCopy:buffer length:numBytesDecrypted];
  }
  
  free(buffer);
  return nil;
}


#pragma mark - EBC
+ (NSData *)DESEncryptEBC:(NSData *)data WithKey:(NSString *)key
{   // DES密钥参与运算的只有64位，超出的部分并不参与加密运算
  char keyPtr[kCCKeySizeAES256+1];
  bzero(keyPtr, sizeof(keyPtr));
  [key getCString:keyPtr maxLength:sizeof(keyPtr) encoding:NSUTF8StringEncoding];
  
  NSUInteger dataLength = [data length];
  
  size_t bufferSize = dataLength + kCCBlockSizeAES128;
  void *buffer = malloc(bufferSize);
  size_t numBytesEncrypted = 0;
  CCCryptorStatus cryptStatus = CCCrypt(kCCEncrypt, kCCAlgorithmDES,
                                        kCCOptionPKCS7Padding | kCCOptionECBMode,
                                        keyPtr, kCCBlockSizeDES,
                                        NULL,
                                        [data bytes], dataLength,
                                        buffer, bufferSize,
                                        &numBytesEncrypted);
  if (cryptStatus == kCCSuccess) {
    return [NSData dataWithBytesNoCopy:buffer length:numBytesEncrypted];
  }
  free(buffer);
  return nil;
}

+ (NSData *)DESDecryptEBC:(NSData *)data WithKey:(NSString *)key
{
  char keyPtr[kCCKeySizeAES256+1];
  bzero(keyPtr, sizeof(keyPtr));
  
  [key getCString:keyPtr maxLength:sizeof(keyPtr) encoding:NSUTF8StringEncoding];
  
  NSUInteger dataLength = [data length];
  
  size_t bufferSize = dataLength + kCCBlockSizeAES128;
  void *buffer = malloc(bufferSize);
  size_t numBytesDecrypted = 0;
  CCCryptorStatus cryptStatus = CCCrypt(kCCDecrypt, kCCAlgorithmDES,
                                        kCCOptionPKCS7Padding | kCCOptionECBMode,
                                        keyPtr, kCCBlockSizeDES,
                                        NULL,
                                        [data bytes], dataLength,
                                        buffer, bufferSize,
                                        &numBytesDecrypted);
  
  if (cryptStatus == kCCSuccess) {
    return [NSData dataWithBytesNoCopy:buffer length:numBytesDecrypted];
  }
  
  free(buffer);
  return nil;
}




@end

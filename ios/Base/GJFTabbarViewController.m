

#import "GJFTabbarViewController.h"
#import "GJFNavigationViewController.h"
#import "UIImage+ImageColor.h"

@interface GJFTabbarViewController ()

@property (nonatomic, strong) NSMutableArray *navArr;

@end

@implementation GJFTabbarViewController

- (NSMutableArray *)navArr
{
    if (_navArr == nil)
    {
        _navArr = [NSMutableArray array];
    }
    return _navArr;
}


+ (void)initialize{
    // 通过appearance统一设置所有UITabBarItem的文字属性
    // 后面带有UI_APPEARANCE_SELECTOR的方法, 都可以通过appearance对象来统一设置
    NSMutableDictionary *attrs = [NSMutableDictionary dictionary];
    attrs[NSFontAttributeName] = [UIFont systemFontOfSize:12];
    attrs[NSForegroundColorAttributeName] = [UIColor grayColor];
    
    NSMutableDictionary *selectedAttrs = [NSMutableDictionary dictionary];
    selectedAttrs[NSFontAttributeName] = attrs[NSFontAttributeName];
    selectedAttrs[NSForegroundColorAttributeName] = [UIColor colorWithRed:30/255.f green:128/255.f blue:240/255.f alpha:1.0];
    UITabBarItem *item = [UITabBarItem appearance];
    [item setTitleTextAttributes:attrs forState:UIControlStateNormal];
    [item setTitleTextAttributes:selectedAttrs forState:UIControlStateSelected];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    
    [self creatControlles];
    [self askForCheckLoginStatus];
    
    [self.tabBar setBackgroundImage:[UIImage imageWithColor:[UIColor colorWithRed:0.97 green:0.97 blue:0.99 alpha:1.00] size:CGSizeMake(self.view.frame.size.width, .5)]];
    [self.tabBar setShadowImage:[UIImage imageWithColor:[UIColor colorWithRed:0.87 green:0.88 blue:0.90 alpha:1.00] size:CGSizeMake(self.view.frame.size.width, .5)]];
    
}

- (void)askForCheckLoginStatus {
    
}

-(void)creatControlles{
    
    
    NSArray * viewControllsName=@[@"HomeViewController",@"ListViewController",@"MineViewController"];
    
    NSArray * nomalArr=@[@"HomeN",@"listN",@"wodeN"];
    NSArray * selectArr=@[@"HomeS",@"listS",@"wodeS"];
    NSArray * titalArr=@[@"首页",@"大全",@"我的"];
    
    NSMutableArray * navArr=[NSMutableArray array];
    for (int i=0; i<titalArr.count; i++) {
        Class VCClass=NSClassFromString(viewControllsName[i]);
        UIViewController * controll=[[VCClass alloc]init];
        controll.tabBarItem=[[UITabBarItem alloc]initWithTitle:titalArr[i] image:[UIImage imageNamed:nomalArr[i]] selectedImage:[[UIImage imageNamed:selectArr[i]] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal] ];
        //设置默认状态的颜色
        NSMutableDictionary *attr3=[NSMutableDictionary dictionary];
        attr3[NSForegroundColorAttributeName]=RGB(153, 153, 153);
        attr3[NSFontAttributeName]=[UIFont systemFontOfSize:11];
        [controll.tabBarItem setTitleTextAttributes:attr3 forState:UIControlStateNormal];
         //设置选中状态的颜色
        NSMutableDictionary *attr4=[NSMutableDictionary dictionary];
        attr4[NSForegroundColorAttributeName]= RGB(36, 39, 45);
        attr4[NSFontAttributeName]=[UIFont systemFontOfSize:11];
        [controll.tabBarItem setTitleTextAttributes:attr4 forState:UIControlStateSelected];
        
        UINavigationController * nav=[[GJFNavigationViewController alloc]initWithRootViewController:controll];
        controll.navigationItem.title=titalArr[i];
        nav.navigationBar.barTintColor = RGB(255, 255, 255);
        [navArr addObject:nav];
    }
    self.viewControllers=navArr;
    
}


+(void)load {
//    NSMutableDictionary *attr3=[NSMutableDictionary dictionary];
//    attr3[NSForegroundColorAttributeName]=[UIColor blackColor];
//    attr3[NSFontAttributeName]=[UIFont systemFontOfSize:14];
//    [[UITabBarItem appearance]setTitleTextAttributes:attr3 forState:UIControlStateNormal];
//    
//    NSMutableDictionary *attr4=[NSMutableDictionary dictionary];
//    attr4[NSForegroundColorAttributeName]=[UIColor redColor];
//    attr4[NSFontAttributeName]=[UIFont systemFontOfSize:14];
//    [[UITabBarItem appearance]setTitleTextAttributes:attr4 forState:UIControlStateSelected];
    
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}



@end

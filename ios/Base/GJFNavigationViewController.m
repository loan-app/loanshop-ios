

#import "GJFNavigationViewController.h"

@interface GJFNavigationViewController ()<UINavigationControllerDelegate>

@end

@implementation GJFNavigationViewController

+ (void)initialize{
    
}

-(id)initWithRootViewController:(UIViewController *)rootViewController
{
    GJFNavigationViewController* nvc = [super initWithRootViewController:rootViewController];
//    [nvc.navigationBar setTintColor:[UIColor colorWithRed:30/255.f green:128/255.f blue:240/255.f alpha:1.0]];
    [nvc.navigationBar setTintColor:[UIColor redColor]];
//    self.navigationController.navigationBar.barTintColor = [UIColor redColor];
    nvc.delegate = self;
    return nvc;
}

- (void)viewDidLoad {
    [super viewDidLoad];
//     self.navigationController.navfigationBar.barTintColor = [UIColor redColor];
   
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated{
    if (self.childViewControllers.count > 0) {
        viewController.hidesBottomBarWhenPushed = YES;
    }
    [super pushViewController:viewController animated:animated];
}

//- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
//{
//    UIViewController *root = navigationController.viewControllers[0];
//    
//    if (root != viewController) {
//        UIBarButtonItem *itemleft = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"nav_back"] style:UIBarButtonItemStylePlain target:self action:@selector(popAction:)];
//        viewController.navigationItem.leftBarButtonItem = itemleft;
//    }
//}
//
//
//- (void)popAction:(UIBarButtonItem *)barButtonItem
//{
//    [self.navigationController popViewControllerAnimated:YES];
//}





@end

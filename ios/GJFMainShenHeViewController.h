
#import <UIKit/UIKit.h>

typedef void(^returnBlock)();

@interface GJFMainShenHeViewController : UIViewController
@property (nonatomic, copy) returnBlock returnBlock;

@end

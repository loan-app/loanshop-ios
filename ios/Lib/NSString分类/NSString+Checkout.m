

#import "NSString+Checkout.h"

@implementation NSString (Checkout)

- (NSString *)firstMatchRegex:(NSString *)pattern {
    NSRegularExpression *regex = [[NSRegularExpression alloc] initWithPattern:pattern
                                                                      options:NSRegularExpressionCaseInsensitive
                                                                        error:nil];
    NSRange range = [regex rangeOfFirstMatchInString:self options:0 range:NSMakeRange(0, self.length)];
    if (range.location == NSNotFound) {
        return nil;
    } else {
        return [self substringWithRange:range];
    }
}

@end

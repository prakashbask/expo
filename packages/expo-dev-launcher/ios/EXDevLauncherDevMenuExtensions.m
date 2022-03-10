#import "EXDevLauncherController.h"

@import EXDevMenuInterface;

@interface EXDevLauncherDevMenuExtensions : NSObject <RCTBridgeModule, EXExtensionProtocol>

@end

@implementation EXDevLauncherDevMenuExtensions


// Need to explicitly define `moduleName` here for dev menu to pick it up
RCT_EXTERN void RCTRegisterModule(Class);

+ (NSString *)moduleName
{
  return @"ExpoDevelopmentClientDevMenuExtensions";
}

+ (void)load
{
  RCTRegisterModule(self);
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

// EXExtensionProtocol

+ (NSString *)extensionName
{
  return @"DevLauncher";
}

+ (NSArray<EXDevExtensionFunction *> *)actions
{
  NSMutableArray *actions = [NSMutableArray new];
    
  EXDevExtensionFunction *navigateToLauncher = [[EXDevExtensionFunction alloc] initWithId:@"navigateToLauncherAsync" handler:^{
    dispatch_async(dispatch_get_main_queue(), ^{
      EXDevLauncherController *controller = [EXDevLauncherController sharedInstance];
      [controller navigateToLauncher];
    });
  }];
  
  [actions addObject:navigateToLauncher];
  
  return actions;
}


@end

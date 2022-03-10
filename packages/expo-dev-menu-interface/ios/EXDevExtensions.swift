// Copyright 2015-present 650 Industries. All rights reserved.

import Foundation
import React

@objc
public class EXDevExtensionFunction: NSObject {
  public var id: String;
  public var handler: () -> Void
  
  @objc
  public init(withId id: String, handler: @escaping () -> Void) {
    self.id = id
    self.handler = handler
  }
}


@objc
public protocol EXExtensionProtocol {
  @objc
  static var extensionName: String { get }
  
  @objc
  static func actions() -> [EXDevExtensionFunction]
}

@objc
public class EXDevExtensions: NSObject, RCTBridgeModule {
  var registry: [String: EXDevExtensionFunction] = [:]
  
  
  @objc
  public var bridge: RCTBridge!
  
  public static func moduleName() -> String! {
    return "EXModuleExtensions"
  }
  
  public static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  public func getExtensionsForBridge(bridge: RCTBridge) -> [AnyHashable : Any]! {
    // moduleName -> fnName -> [...functionArgs]
    var extensions: [String: [String: [String]]] = [:]
    
    if let modules = bridge.modulesConforming(to: EXExtensionProtocol.self) as? [EXExtensionProtocol] {
      modules.forEach { module in
        
        let moduleNamespace = type(of: module).extensionName
        
        if (extensions[moduleNamespace] == nil) {
          extensions[moduleNamespace] = [:]
        }
        
 
        let actions: [EXDevExtensionFunction] = type(of: module).actions()

        actions.forEach { action in
          let actionKey = "\(moduleNamespace)-\(action.id)"
          registry[actionKey] = action

          // TODO - extend action to support fn args?
          extensions[moduleNamespace]![action.id] = []
        }
      }
    }
    
    return extensions
  }
  
  @objc
  public func callById(_ id: String?, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    guard let id = id else {
      return reject("ERR_DEVEXTENSION_ACTION_FAILED", "Callable ID not provided.", nil)
    }
    
    guard let action = registry[id] else {
      return reject("ERR_DEVEXTENSION_ACTION_FAILED", "There is no function registered with the provided id.", nil)
    }
    
    action.handler()
    resolve(nil)
  }
}

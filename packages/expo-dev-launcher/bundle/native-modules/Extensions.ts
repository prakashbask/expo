import { NativeModules } from 'react-native';

const Extensions: { [moduleName: string]: any } = {};

Object.keys(NativeModules).forEach((nativeModuleName) => {
  const nativeModule = NativeModules[nativeModuleName];
  if (nativeModule.isDevExtension) {
    Extensions[nativeModuleName] = nativeModule;
  }
});

export { Extensions };

import { NativeModules } from 'react-native';

const DevMenu = NativeModules.ExpoDevMenuInternal;

const { Extensions } = DevMenu.getConstants();

Object.keys(Extensions).forEach((extensionName) => {
  const fns = Extensions[extensionName];
  Object.keys(fns).forEach((fnName) => {
    // TODO - args (if needed)
    Extensions[extensionName][fnName] = () => DevMenu.callById(`${extensionName}-${fnName}`);
  });
});

export function hasExtensionInstalled(extensionName: string) {
  return Object.keys(Extensions).includes(extensionName);
}

export { Extensions };

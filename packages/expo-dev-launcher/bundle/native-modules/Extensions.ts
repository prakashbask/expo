import { NativeModules } from 'react-native';

const DevLauncher = NativeModules.EXDevLauncherInternal;

const { Extensions } = DevLauncher.getConstants();

Object.keys(Extensions).forEach((extensionName) => {
  const fns = Extensions[extensionName];
  Object.keys(fns).forEach((fnName) => {
    // TODO - args (if needed)
    Extensions[extensionName][fnName] = () => DevLauncher.callById(`${extensionName}-${fnName}`);
  });
});

export function hasExtensionInstalled(extensionName: string) {
  return Object.keys(Extensions).includes(extensionName);
}

export { Extensions };

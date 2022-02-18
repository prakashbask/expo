import glob from 'fast-glob';
import fs from 'fs-extra';
import path from 'path';

import { ModuleDescriptor, PackageRevision, SearchOptions } from '../types';

async function findPodspecFile(revision: PackageRevision): Promise<string | undefined> {
  if (revision.config?.iosPodspecPath()) {
    return revision.config.iosPodspecPath();
  }

  const [podspecFile] = await glob('*/*.podspec', {
    cwd: revision.path,
    ignore: ['**/node_modules/**'],
  });

  return podspecFile;
}

export function getSwiftModuleName(podName: string, swiftModuleName?: string): string {
  // by default, non-alphanumeric characters in the pod name are replaced by _ in the module name
  return swiftModuleName ?? podName.replace(/[^a-zA-Z0-9]/g, '_');
}

/**
 * Resolves module search result with additional details required for iOS platform.
 */
export async function resolveModuleAsync(
  packageName: string,
  revision: PackageRevision,
  options: SearchOptions
): Promise<ModuleDescriptor | null> {
  const podspecFile = await findPodspecFile(revision);
  if (!podspecFile) {
    return null;
  }

  const podName = path.basename(podspecFile, path.extname(podspecFile));
  const podspecDir = path.dirname(path.join(revision.path, podspecFile));

  const swiftModuleName = getSwiftModuleName(podName, revision.config?.iosSwiftModuleName());

  return {
    podName,
    podspecDir,
    swiftModuleName,
    flags: options.flags,
    modules: revision.config?.iosModules(),
    appDelegateSubscribers: revision.config?.iosAppDelegateSubscribers(),
    reactDelegateHandlers: revision.config?.iosReactDelegateHandlers(),
  };
}

/**
 * Generates Swift file that contains all autolinked Swift packages.
 */
export async function generatePackageListAsync(
  modules: ModuleDescriptor[],
  targetPath: string
): Promise<void> {
  const className = path.basename(targetPath, path.extname(targetPath));
  const generatedFileContent = await generatePackageListFileContentAsync(modules, className);

  await fs.outputFile(targetPath, generatedFileContent);
}

/**
 * Generates the string to put into the generated package list.
 */
async function generatePackageListFileContentAsync(
  modules: ModuleDescriptor[],
  className: string
): Promise<string> {
  const modulesToImport = modules.filter(
    (module) =>
      module.modules.length ||
      module.appDelegateSubscribers.length ||
      module.reactDelegateHandlers.length
  );
  const swiftModules = modulesToImport.map((module) => module.swiftModuleName);

  const modulesClassNames = []
    .concat(...modulesToImport.map((module) => module.modules))
    .filter(Boolean);

  const appDelegateSubscribers = []
    .concat(...modulesToImport.map((module) => module.appDelegateSubscribers))
    .filter(Boolean);

  const reactDelegateHandlerModules = modulesToImport.filter(
    (module) => !!module.reactDelegateHandlers.length
  );

  return `/**
 * Automatically generated by expo-modules-autolinking.
 *
 * This autogenerated class provides a list of classes of native Expo modules,
 * but only these that are written in Swift and use the new API for creating Expo modules.
 */

import ExpoModulesCore
${swiftModules.map((moduleName) => `import ${moduleName}\n`).join('')}
@objc(${className})
public class ${className}: ModulesProvider {
  public override func getModuleClasses() -> [AnyModule.Type] {
    return ${formatArrayOfClassNames(modulesClassNames)}
  }

  public override func getAppDelegateSubscribers() -> [ExpoAppDelegateSubscriber.Type] {
    return ${formatArrayOfClassNames(appDelegateSubscribers)}
  }

  public override func getReactDelegateHandlers() -> [ExpoReactDelegateHandlerTupleType] {
    return ${formatArrayOfReactDelegateHandler(reactDelegateHandlerModules)}
  }
}
`;
}

/**
 * Formats an array of class names to Swift's array containing these classes.
 */
function formatArrayOfClassNames(classNames: string[]): string {
  const indent = '  ';
  return `[${classNames.map((className) => `\n${indent.repeat(3)}${className}.self`).join(',')}
${indent.repeat(2)}]`;
}

/**
 * Formats an array of modules to Swift's array containing ReactDelegateHandlers
 */
export function formatArrayOfReactDelegateHandler(modules: ModuleDescriptor[]): string {
  const values: string[] = [];
  for (const module of modules) {
    for (const handler of module.reactDelegateHandlers) {
      values.push(`(packageName: "${module.packageName}", handler: ${handler}.self)`);
    }
  }
  const indent = '  ';
  return `[${values.map((value) => `\n${indent.repeat(3)}${value}`).join(',')}
${indent.repeat(2)}]`;
}

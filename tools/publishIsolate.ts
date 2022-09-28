import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import getNpmPackageVersion from 'get-npm-package-version';
import { compareVersions } from 'compare-versions';
import isolateBuildConfig from '../conf/isolate.config.json';

async function main() {
  const isolatePackageRoot = './dist/isolate';

  const publishPackageList: { packageName: string; dir: string, version: string }[] = [];

  const configPackages = isolateBuildConfig.builds
    .map(build => ({ buildName: build.name, version: build.version }));

  for (const configPackage of configPackages) {
    const filePath = path.join(isolatePackageRoot, configPackage.buildName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Package ${configPackage.buildName} does not exist`);
    }
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // get package.json
      const packageJsonPath = path.join(filePath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      // check is built
      if (packageJson.version !== configPackage.version) {
        throw new Error(`Package ${configPackage.buildName} is not built`);
      }
      // get version
      const version = getNpmPackageVersion(packageJson.name) || '1.0.0';
      // compare version
      if (compareVersions(version, packageJson.version) < 0) {
        publishPackageList.push({
          packageName: packageJson.name,
          dir: filePath,
          version: packageJson.version
        });
      }
    } else {
      throw new Error(`isolate package ${filePath} is not a directory`);
    }
  }

  // publish packages
  for (const publishPackage of publishPackageList) {
    // eslint-disable-next-line compat/compat
    await new Promise<void>((resolve) => {
      const childProcessInstance = childProcess.spawn(
        'yarn',
        ['publish', publishPackage.dir]
      );

      childProcessInstance.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      childProcessInstance.stderr.on('data', (data) => {
        throw new Error(data.toString());
      });

      childProcessInstance.on('close', (code) => {
        if (code !== 0) {
          throw new Error(`Failed to publish package ${publishPackage.packageName}`);
        }
        console.log(`${publishPackage.packageName} version ${publishPackage.version} published.`);
        resolve();
      });
    });
  }
}

main();

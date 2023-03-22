import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';
import { compareVersions } from 'compare-versions';
import getNpmPackageVersion from 'get-npm-package-version';
import isolateBuildConfig from '../conf/isolate.config.json';
import PackageJson from '../package.json';

async function main() {
  const isolatePackageRoot = './dist/isolate';

  const configPackages = isolateBuildConfig.builds
    .map(build => ({ buildName: build.name, version: build.version }));

  for (const configPackage of configPackages) {
    const isolatePackageName = `@${PackageJson.name}/${configPackage.buildName}`;

    // get version
    const isolatePackageNpmVersion = getNpmPackageVersion(isolatePackageName) || '1.0.0';

    // compare version
    if (compareVersions(configPackage.version, isolatePackageNpmVersion) <= 0) {
      // skip because version is not newer
      continue;
    }

    // build
    await new Promise<void>(resolve => {
      const buildProcess = childProcess.spawn(
        'gulp',
        [`isolate:${configPackage.buildName}`]
      );

      buildProcess.stdout.on('data', data => {
        process.stdout.write(data);
      });

      buildProcess.stderr.on('data', data => {
        process.stderr.write(data);
      });

      buildProcess.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          throw new Error(`$ gulp isolate:${configPackage.buildName} failed with code ${code}`);
        }
      });
    });

    // check build
    const filePath = path.join(isolatePackageRoot, configPackage.buildName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Package ${configPackage.buildName} does not exist`);
    }
    const stat = fs.statSync(filePath);
    if (!stat.isDirectory()) {
      throw new Error(`isolate package ${filePath} is not a directory`);
    }

    // publish
    await new Promise<void>(resolve => {
      const childProcessInstance = childProcess.spawn(
        'yarn',
        ['publish', filePath, '--access', 'public']
      );

      childProcessInstance.stdout.on('data', data => {
        process.stdout.write(data);
      });

      childProcessInstance.stderr.on('data', data => {
        process.stderr.write(data);
      });

      childProcessInstance.on('close', code => {
        if (code !== 0) {
          throw new Error(`Failed to publish package ${isolatePackageName}`);
        }
        console.log(`${isolatePackageName} version ${configPackage.version} published.\n`);
        resolve();
      });
    });
  }
}

main();

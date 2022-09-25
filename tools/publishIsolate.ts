import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import getNpmPackageVersion from 'get-npm-package-version';

async function main() {
  const args = process.argv;
  const npmAuthToken = args[0];
  const isolatePackageRoot = './dist/isolate';

  const publishPackageList: string[] = [];

  // get directory listing
  const files = fs.readdirSync(isolatePackageRoot);
  for (const file of files) {
    const filePath = path.join(isolatePackageRoot, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // get package.json
      const packageJsonPath = path.join(filePath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      // get version
      const version = getNpmPackageVersion(packageJson.name);

      if (version === null) {
        throw new Error(`Package ${packageJson.name} not found on npm`);
      }

      // compare version
      if (compareVersions(version, packageJson.version) < 0) {
        publishPackageList.push(packageJson.name);
      }
    }
  }

  // publish packages
  for (const packageName of publishPackageList) {
    console.log(`Publishing ${packageName}`);
    const packagePath = path.join(isolatePackageRoot, packageName);
    const command = `npm publish --token ${npmAuthToken} ${packagePath}`;
    console.log(command);
    // eslint-disable-next-line compat/compat
    await new Promise<void>((resolve, reject) => {
      const process = childProcess.exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        console.log(stdout);
        console.log(stderr);
      });
      process.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });
  }
}

function compareVersions(a: string, b: string): number {
  const aParts = a.split('.');
  const bParts = b.split('.');
  for (let i = 0; i < aParts.length; i++) {
    const aPart = parseInt(aParts[i]);
    const bPart = parseInt(bParts[i]);
    if (aPart < bPart) {
      return -1;
    }
    if (aPart > bPart) {
      return 1;
    }
  }
  return 0;
}

main();

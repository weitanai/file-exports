import fs from 'fs';
import path from 'path';
import semver from 'semver';
import chalk from 'chalk';
import enquirer from 'enquirer';
import { execa } from 'execa';

// 读取 package.json 文件
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

// 确认版本号
const currentVersion = packageJson.version;

const versionIncrements = [
  'patch',
  'minor',
  'major'
];

const tags = [
  'latest',
  'next'
];

const inc = (i) => semver.inc(currentVersion, i)
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })
const step = (msg) => console.log(chalk.cyan(msg))
const warn = (msg) => console.log(chalk.red(msg))

async function main() {
  let targetVersion;

  const { release } = await enquirer.prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
  });

  if (release === 'custom') {
    targetVersion = (await enquirer.prompt({
      type: 'input',
      name: 'version',
      message: 'Input custom version',
      initial: currentVersion
    })).version;
  } else {
    targetVersion = release.match(/\((.*)\)/)[1]
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`Invalid target version: ${targetVersion}`);
  }
  if (!semver.gt(targetVersion, currentVersion)) {
    warn('new version must more then current version');
    return;
  }

  const { tag } = await enquirer.prompt({
    type: 'select',
    name: 'tag',
    message: 'Select tag type',
    choices: tags
  })

  const { yes: tagOk } = await enquirer.prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion} with the "${tag}" tag. Confirm?`
  })

  if (!tagOk) {
    warn('tag not ok');
    return
  }

  // Run tests before release.

  // Update the package version.
  step('\nUpdating the package version...')
  updatePackage(targetVersion)

  // Build the package.
  step('\nBuilding the package...')
  await run('npm', ['run', 'build'])

  // Generate the changelog.
  step('\nGenerating the changelog...')
  await run('npm', ['run', 'changelog'])

  const { yes: changelogOk } = await enquirer.prompt({
    type: 'confirm',
    name: 'yes',
    message: `Changelog generated. Does it look good?`
  })

  if (!changelogOk) {
    warn('change log not ok');
    return;
  }

  // Publish the package.
  step('\nPublishing the package...')
  try {
    await run('npm', ['publish']);
    step('has publish to npm');
  } catch (error) {
    warn('Publishing to npm failed, please publish manually');
  }

  // Push to GitHub.
  step('\nPushing to GitHub...');
  try {
    await run('git', ['add', '.']);
    step('\n  after git add all file');

    await run('git', ['commit', '-m', `release: v${targetVersion}`]);
    step('\n after git commint ');

    await run('git', ['push']);
    step('Code has been committed to GitHub');
  } catch (error) {
    warn('Failed to submit code to GitHub, please submit manually');
  }
}


function updatePackage(version) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  pkg.version = version;

  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
}

main().catch((err) => console.error(err));



// 通过 enquirer.prompt 获取用户选择的发布类型（major, minor, patch 或自定义版本号）。
// 如果用户选择了自定义版本号，再次提示用户输入自定义版本号。
// 检查目标版本号是否有效，以及是否大于当前版本号。
// 提示用户选择标签类型（如 latest、beta 等）。
// 确认用户是否同意使用所选标签发布新版本。
// 更新 package.json 文件中的版本号。
// 构建 npm 包。
// 生成变更日志。
// 确认用户是否同意生成的变更日志。
// 发布 npm 包。
// 将更改推送到 GitHub。
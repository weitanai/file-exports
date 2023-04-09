import fs from 'fs';
import path from 'path';
import semver from 'semver';
import chalk from 'chalk';
import enquirer from 'enquirer';
import {execa} from 'execa';
// 读取 package.json 文件
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

// 确认版本号
const currentVersion = packageJson.version;
enquirer
  .prompt([
    {
      type: 'input',
      name: 'version',
      message: `请输入新版本号 (当前版本号 ${currentVersion}):`,
      validate: (input) => {
        if (!semver.valid(input)) {
          return '版本号格式错误，请使用 Semantic Versioning 规范';
        }
        if (!semver.gt(input, currentVersion)) {
          return '新版本号应该大于当前版本号';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'commitMessage',
      message: '请输入提交信息:',
    },
  ])
  .then(async (answers) => {
    const { version, commitMessage } = answers;

    // 更新版本号
    packageJson.version = version;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // 构建代码
    await execa('npm', ['run', 'build']);

    // 提交代码到GitHub
    try {
      await execa('git', ['add', '.']);
      await execa('git', ['commit', '-m', commitMessage]);
      await execa('git', ['push']);
      console.log(chalk.green('代码已提交到GitHub'));
    } catch (error) {
      console.log(chalk.red('提交代码到GitHub失败，请手动提交'));
    }

    // 发布到 npm
    try {
      await execa('npm', ['publish']);
      console.log(chalk.green('已发布到npm'));
    } catch (error) {
      console.log(chalk.red('发布到npm失败，请手动发布'));
    }
  });

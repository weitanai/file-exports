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

const versionIncrements = [
    'patch',
    'minor',
    'major'
  ]
  
  const tags = [
    'latest',
    'next'
  ]
  
  const inc = (i) => semver.inc(currentVersion, i)
  const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })
  const step = (msg) => console.log(chalk.cyan(msg))
  
  async function main() {
    let targetVersion
  
    const { release } = await enquirer.prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
    })
  
    if (release === 'custom') {
      targetVersion = (await enquirer.prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion
      })).version
    } else {
      targetVersion = release.match(/\((.*)\)/)[1]
    }
  
    if (!semver.valid(targetVersion)) {
      throw new Error(`Invalid target version: ${targetVersion}`)
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
      return
    }
  
    // // Publish the package.
    step('\nPublishing the package...')
    try {
        await run('npm', ['publish']);
        step('已发布到npm');
      } catch (error) {
        step('发布到npm失败，请手动发布');
      }
  
    // // Push to GitHub.
    step('\nPushing to GitHub...')
   // 提交代码到GitHub
   try {
    await run('git', ['add', '.']);
    await run('git', ['commit', '-m', `release: v${targetVersion}`])

    await run('git', ['push']);
    step('代码已提交到GitHub');
  } catch (error) {
    step('提交代码到GitHub失败，请手动提交');
  }
  }
  
  function updatePackage(version) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  
    pkg.version = version
  
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n')
  }
  
  main().catch((err) => console.error(err))
  
  // 这段代码实现了一个自动化的包发布流程，主要功能包括：
  
  // 提供一个命令行交互式界面，用于选择发布版本类型、自定义版本号、选择发布tag等；
  // 运行测试、生成changelog、更新版本号、构建包、提交代码到Git、发布包到NPM，以及相关的Git操作，例如打tag、推送到远程仓库等。
  // 代码分为两部分：
  
  // 引入了一些第三方依赖和常量，如fs、path、chalk、semver、prompt、execa和currentVersion等。其中semver用于处理版本号，execa用于在命令行中执行shell命令，prompt用于提供命令行交互式界面。
  // 定义了几个函数和一个async函数main。其中inc函数用于增加版本号，bin函数用于生成可执行文件路径，run函数用于在命令行中执行shell命令并将结果输出到控制台，step函数用于输出步骤提示信息。updatePackage函数用于更新package.json文件中的版本号，main函数是主要的逻辑，它实现了整个发布流程的自动化。
  // 整个流程的逻辑如下：
  
  // 用户选择发布版本类型，可以选择patch、minor或major，或者选择custom自定义版本号；
  // 如果用户选择了custom，则需要输入自定义的版本号；
  // 判断输入的版本号是否合法；
  // 用户选择发布tag类型，可以选择latest或next；
  // 确认发布版本号和tag类型是否正确；
  // 运行测试、更新版本号、构建包、生成changelog等操作；
  // 确认生成的changelog是否正确；
  // 提交代码到Git，并打上tag；
  // 将代码推送到远程仓库；
  // 发布包到NPM。
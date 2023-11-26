// src/index.ts
import { promises as fs } from "fs";
import { resolve } from "path";
async function getStaticExports(path) {
  const url2 = resolve(path, "../");
  const allFilesPath = await getFilePath(url2, path);
  let readExportObj = {};
  for (const item of allFilesPath) {
    const resExports = await import(item);
    const keyOfEport = Object.keys(resExports);
    for (const keyItem of keyOfEport) {
      if (keyItem === "defaut") {
        const name = resExports.defaut.name;
        readExportObj[name] = resExports.defaut;
      } else {
        readExportObj[keyItem] = resExports[keyItem];
      }
    }
  }
  return readExportObj;
}
async function getFilePath(path) {
  let allFilePaths = [];
  const allFiles = await fs.readdir(path);
  for (let itme of allFiles) {
    const current = resolve(path, itme);
    allFilePaths.push(current);
  }
  return allFilePaths.map((item) => item.slice(path.length + 1));
}
var url = "/Users/max/workJob/static/src/templates/public/arise/templates";
getFilePath(url).then(console.log);
export {
  getStaticExports
};

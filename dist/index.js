// src/index.ts
import { promises as fs, lstatSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
async function getStaticExports(path) {
  const currentFile = fileURLToPath(path);
  const url = resolve(currentFile, "../");
  const allFilesPath = await getFilePath(url, path);
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
async function getFilePath(path, excludeFile) {
  let allFilePaths = [];
  const allFiles = await fs.readdir(path);
  for (let itme of allFiles) {
    const current = resolve(path, itme);
    if (lstatSync(current).isDirectory()) {
      const childPath = await getFilePath(current);
      allFilePaths = [...childPath, ...allFilePaths];
    } else if (current !== excludeFile) {
      allFilePaths.push(current);
    }
  }
  return allFilePaths;
}
export {
  getStaticExports
};

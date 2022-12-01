"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  getStaticExports: () => getStaticExports
});
module.exports = __toCommonJS(src_exports);
var import_fs = require("fs");
var import_path = require("path");
var import_url = require("url");
async function getStaticExports(path) {
  const currentFile = (0, import_url.fileURLToPath)(path);
  const url = (0, import_path.resolve)(currentFile, "../");
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
  const allFiles = await import_fs.promises.readdir(path);
  for (let itme of allFiles) {
    const current = (0, import_path.resolve)(path, itme);
    if ((0, import_fs.lstatSync)(current).isDirectory()) {
      const childPath = await getFilePath(current);
      allFilePaths = [...childPath, ...allFilePaths];
    } else if (current !== excludeFile) {
      allFilePaths.push(current);
    }
  }
  return allFilePaths;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getStaticExports
});

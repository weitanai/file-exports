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
async function getStaticExports(path) {
  const url2 = (0, import_path.resolve)(path, "../");
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
  const allFiles = await import_fs.promises.readdir(path);
  for (let itme of allFiles) {
    const current = (0, import_path.resolve)(path, itme);
    allFilePaths.push(current);
  }
  return allFilePaths.map((item) => item.slice(path.length + 1));
}
var url = "/Users/max/workJob/static/src/templates/public/arise/templates";
getFilePath(url).then(console.log);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getStaticExports
});

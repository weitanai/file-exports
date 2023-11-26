import { promises as fs, lstatSync } from 'fs';
import { resolve } from 'path'

// todo 
// 1 child dir file path resolve
// 2 export defaut conflict resolve
// 3 exclude current file 
// cmd esm resovle

// flag all solve

export async function getStaticExports(path: string) {
    const url = resolve(path, '../');
    const allFilesPath = await getFilePath(url, path);
    let readExportObj: Record<string, Function> = {};
    for (const item of allFilesPath) {
        const resExports = await import(item);
        
        const keyOfEport = Object.keys(resExports);
        for (const keyItem of keyOfEport) {
            if (keyItem === 'defaut') {
                const name =  resExports.defaut.name;
                readExportObj[name] = resExports.defaut;
            } else {
                readExportObj[keyItem] = resExports[keyItem];
            }
        }
    }
    return readExportObj;
}

async function getFilePath(path) {
    let allFilePaths: string[] = [];
    const allFiles = await fs.readdir(path);
    for (let itme of allFiles) {
        const current = resolve(path, itme);
        allFilePaths.push(current);
    }

    return allFilePaths.map(item=> item.slice(path.length+1))
}
const url = '/Users/max/workJob/static/src/templates/public/arise/templates';
getFilePath(url).then(console.log)

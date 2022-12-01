import { promises as fs, lstatSync } from 'fs';
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import os from 'os';

// todo 
// 1 child dir file path resolve
// 2 export defaut conflict resolve
// 3 exclude current file 
// cmd esm resovle

// flag all solve

export async function getStaticExports(path: string) {
    const currentFile = fileURLToPath(path);
    const url = resolve(currentFile, '../');
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

async function getFilePath(path: string, excludeFile?: string): Promise<string[]> {
    let allFilePaths: string[] = [];
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
    return allFilePaths
}

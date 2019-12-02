import * as shell from 'shelljs';
import { existsSync } from 'fs';


export interface Copy {
    from: string;
    to: string;
}

/**
 * @description apply the copy array using the copy function 
 * @param arr 
 */
export function copyArray(arr: Copy[]) {
    for (let copyOp of arr) {
        copy(copyOp.from, copyOp.to);
    }
}

/**
 * @description function that copy files or folders and take the from path and the toPath
 * @param fromPath 
 * @param toPath 
 */
export function copy(fromPath: string, toPath: string) {

    // validate file paths
    if (!isValidatePath(fromPath))
        return;

    shell.cp('-r', fromPath, toPath);
}

/**
 * @description function that validate that file or folder actually exists
 * @param path 
 */
function isValidatePath(path: string) {
    if (!existsSync(path)) {
        console.error(`Path "${path}" does not exist`);
        return false;
    }

    return true;
}
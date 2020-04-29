import * as cpx from 'cpx';

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
    cpx.copySync(fromPath, toPath);
}

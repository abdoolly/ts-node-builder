import { BuilderOutput, createBuilder, BuilderContext } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import * as concurrently from 'concurrently';

export interface Options extends JsonObject {
    /**
     * @description this is the main file to run in the output path
     */
    mainInOutput: string;

    /**
     * @description tsconfig.json path
     */
    tsconfig: string;

    /**
     * @description array file paths to make nodemon watch (optional)
     */
    watch: string[];

    /**
     * @description if you want to set the node env
     * @default development
     */
    NODE_ENV: string;

    /**
     * @description this is the delay in seconds which is passed to nodemon it's measured in seconds
     * ex: 1 , 2 or 2000ms or 1.5 = 1500ms
     * @default 1.5 seconds
     */
    delayBetweenRestarts: number;

    /**
     * @description this is a flag to run the process in debug mode 
     * @default false
     */
    debug: boolean,

    /**
     * @description this is the debug port it's 9229 by default
     */
    debugPort: number;
}

let buildFunc = createBuilder<Options>((options, context): Promise<BuilderOutput> | Observable<BuilderOutput> => {
    let observable = new Observable<BuilderOutput>((observer) => {
        try {
            concurrentlyRun(context, options);
            observer.next({ success: true });

        } catch (err) {
            observer.next({ success: false });
            observer.complete();
        }
    });

    return observable;
});

export default buildFunc

function concurrentlyRun(context: BuilderContext, options: Options) {
    // setting the node env option by default it's production 
    let NODE_ENV = options.NODE_ENV || 'development';
    let inspectWithPort = options.debugPort === undefined ? '--inspect' : `--inspect=${options.debugPort}`;
    let debug = options.debug === undefined || options.debug === false ? '' : inspectWithPort;

    concurrently([
        {
            command: `tsc --build ${context.currentDirectory}/${options.tsconfig} --pretty --watch`,
            name: 'TSC',
            prefixColor: 'cyan'
        },
        {
            command: `NODE_ENV=${NODE_ENV} nodemon --signal SIGINT ${getWatchFilesString(options)} ${debug}  --delay ${options.delayBetweenRestarts || 1.5} -r tsconfig-paths/register -r ts-node/register ${context.currentDirectory}/${options.mainInOutput}`,
            name: 'NODE',
            prefixColor: 'yellow',
        }
    ], { killOthers: ['failure', 'success'] });
}

/**
 * @description this will receive the options and return a string of the files needs to be watched
 * @param context 
 * @param options 
 */
let getWatchFilesString = (options: Options) => {
    let watchArgs: string = '';
    if (options.watch.length !== 0)
        return `--watch ${options.watch.join(' --watch ')}`;

    return watchArgs;
}
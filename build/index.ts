import { BuilderOutput, createBuilder, BuilderContext } from '@angular-devkit/architect';
import * as childProcess from 'child_process';
import { JsonObject } from '@angular-devkit/core';

export interface Options extends JsonObject {
    /**
     * @description this is the main file to run the output path
     */
    mainInOutput: string;

    /**
     * @description tsconfig.json path
     */
    tsconfig: string;

    /**
     * @description this is the output path for the build operation
     */
    outputPath: string;

    /**
     * @description this is an option that will run the node server 
     * after building if false it will only build 
     */
    runAndBuild: boolean;
}


let buildFunc = createBuilder<Options>((): Promise<BuilderOutput> => {
    // return new Promise<BuilderOutput>(async (resolve) => {
    // tsc using the supplied tsconfig
    // make all the production compile options 

    let result = childProcess.spawnSync('tsc');
    console.log('stdout', Buffer.from(result.stdout).toString('utf8'));

    return new Promise(() => { success: true });

    // return buildOnlyMode(context, options);

    // resolve({ success: true });
    // });
});

export default buildFunc


function buildOnlyMode(context: BuilderContext, options: Options): Promise<any> {
    return new Promise((resolve, reject) => {
        const child = spawnTSC(context, options);

        child.stdout.on('end', () => {
            console.log("I AM ENDED");
            resolve({ success: true });
        });

        // logging the tsc output to the user
        child.stdout.on('data', (data: any) => console.log(Buffer.from(data).toString('utf8')));

        child.stdout.on('error', (err: Error) => {
            console.log('Error: ', err);
            reject();
        });

        child.stderr.on('data', (data: any) => child.stdout.emit('data', data));
    });
}

function spawnTSC(context: BuilderContext, options: Options) {
    return childProcess.spawn('tsc',
        [
            '--pretty',
            '--build',
            `${context.currentDirectory}/${options.tsconfig}`,
            '--outDir',
            `${context.currentDirectory}/${options.outputPath}`
        ],
        { stdio: 'pipe', env: { NODE_ENV: 'production' } });
}


// /**
//  * @description run a typescript project in dev mode where it restarts on change of the directories
//  * that are being watched
//  * @param context 
//  * @param options 
//  */
// function devMode(context: BuilderContext, options: Options) {
//     const child = spawnNodemon(context, options);

//     // piping any inputs to the process to the nodemon child process
//     // so if the user entered `rs` it's directed to nodemon so it restarts it's process
//     process.stdin.on('data', (data: any) => child.stdin.write(data));

//     // logging the nodemon output to the user
//     child.stdout.on('data', (data: any) => console.log(Buffer.from(data).toString('utf8')));

//     child.stdout.on('error', (err: Error) => {
//         console.log('Error: ', err);
//     });

//     child.stderr.on('data', (data: any) => child.stdout.emit('data', data));
// }

// function spawnNodemon(context: BuilderContext, options: Options) {
//     let watchArgs: string[] = [];
//     if (options.watch.length !== 0) {
//         options.watch = options.watch.map((value: string) => `${context.currentDirectory}/${value}`);
//         watchArgs = `--watch ${options.watch.join(' --watch ')}`.split(' ');
//     }

//     // get the transpile only value
//     // false => false
//     // undefined => true
//     // true => true
//     let transpileValue: string[] = [];
//     let transpileOnly = options.transpileOnly === false ? false : true;
//     if (transpileOnly)
//         transpileValue = ['-T']


//     options.debug = options.debug === false || options.debug === undefined ? false : true;
//     options.debugPort = options.debugPort === undefined ? 9229 : options.debugPort;

//     if (!options.debug) {
//         // nodemon --watch "file/path/to/watch" --ext ts,json --exec "ts-node -T --project tsconfig.app.json -r tsconfig-paths/register ./main/path.ts"
//         return childProcess.spawn('nodemon',
//             [
//                 ...watchArgs,
//                 '--ext',
//                 'ts,json',
//                 '--exec',
//                 'ts-node',
//                 ...transpileValue,
//                 '--project',
//                 `${context.currentDirectory}/${options.tsconfig}`,
//                 '-r',
//                 'tsconfig-paths/register',
//                 `${context.currentDirectory}/${options.main}`
//             ], { stdio: 'pipe' });
//     }

//     // nodemon --watch "file/path/to/watch" --ext ts,json --exec "node --inspect=PORT -r ts-node/register -r tsconfig-paths/register ./main/path.ts"
//     return childProcess.spawn('nodemon',
//         [
//             ...watchArgs,
//             '--ext',
//             'ts,json',
//             '--exec',
//             'node',
//             `--inspect=${options.debugPort}`,
//             '-r',
//             'ts-node/register',
//             '-r',
//             'tsconfig-paths/register',
//             `${context.currentDirectory}/${options.main}`
//         ], { stdio: 'pipe' });
// }
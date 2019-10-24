import { BuilderOutput, createBuilder, BuilderContext } from '@angular-devkit/architect';
import * as childProcess from 'child_process';
import { JsonObject } from '@angular-devkit/core';
import { Observable } from 'rxjs';

export interface Options extends JsonObject {
    /**
     * @description this is the main file to run
     * @required
     */
    main: string,

    /**
     * @description this is the array of folder to watch and restart if any changes happened 
     * inside them
     * @required
     */
    watch: string[],

    /**
     * @description this is a flag to control the transpileOnly mode in the ts-node 
     * @default true
     */
    transpileOnly: boolean,

    /**
     * @description this is the tsconfig file path to use 
     * @required
     */
    tsconfig: string;

    /**
     * @description this is a flag to run the process in debug mode 
     * @default false
     */
    debug: boolean,

    /**
     * @description
     */
    debugPort: number;

}


let buildFunc = createBuilder<Options>((options, context): Observable<BuilderOutput> => {
    return new Observable(() => {
        devMode(context, options);
    })
});

export default buildFunc

/**
 * @description run a typescript project in dev mode where it restarts on change of the directories
 * that are being watched
 * @param context 
 * @param options 
 */
function devMode(context: BuilderContext, options: Options) {
    const child = spawnNodemon(context, options);

    // piping any inputs to the process to the nodemon child process
    // so if the user entered `rs` it's directed to nodemon so it restarts it's process
    process.stdin.on('data', (data: any) => child.stdin.write(data));

    // logging the nodemon output to the user
    child.stdout.on('data', (data: any) => console.log(Buffer.from(data).toString('utf8')));

    child.stdout.on('error', (err: Error) => {
        console.log('Error: ', err);
    });

    child.stderr.on('data', (data: any) => child.stdout.emit('data', data));
}

function spawnNodemon(context: BuilderContext, options: Options) {
    let watchArgs: string[] = [];
    if (options.watch.length !== 0) {
        options.watch = options.watch.map((value: string) => `${context.currentDirectory}/${value}`);
        watchArgs = `--watch ${options.watch.join(' --watch ')}`.split(' ');
    }

    // get the transpile only value
    // false => false
    // undefined => true
    // true => true
    let transpileValue: string[] = [];
    let transpileOnly = options.transpileOnly === false ? false : true;
    if (transpileOnly)
        transpileValue = ['-T']


    options.debug = options.debug === false || options.debug === undefined ? false : true;
    options.debugPort = options.debugPort === undefined ? 9229 : options.debugPort;

    if (!options.debug) {
        // nodemon --watch "file/path/to/watch" --ext ts,json --exec "ts-node -T --project tsconfig.app.json -r tsconfig-paths/register ./main/path.ts"
        return childProcess.spawn('nodemon',
            [
                ...watchArgs,
                '--ext',
                'ts,json',
                '--exec',
                'ts-node',
                ...transpileValue,
                '--project',
                `${context.currentDirectory}/${options.tsconfig}`,
                '-r',
                'tsconfig-paths/register',
                `${context.currentDirectory}/${options.main}`
            ], { stdio: 'pipe' });
    }

    // nodemon --watch "file/path/to/watch" --ext ts,json --exec "node --inspect=PORT -r ts-node/register -r tsconfig-paths/register ./main/path.ts"
    return childProcess.spawn('nodemon',
        [
            ...watchArgs,
            '--ext',
            'ts,json',
            '--exec',
            'node',
            `--inspect=${options.debugPort}`,
            '-r',
            'ts-node/register',
            '-r',
            'tsconfig-paths/register',
            `${context.currentDirectory}/${options.main}`
        ], { stdio: 'pipe' });
}
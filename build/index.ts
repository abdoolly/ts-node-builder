import { BuilderOutput, createBuilder, BuilderContext } from '@angular-devkit/architect';
import * as childProcess from 'child_process';
import { JsonObject } from '@angular-devkit/core';
import { Observable } from 'rxjs';

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
     * @description this is an option that will run the node server 
     * after building if false it will only build 
     */
    runAndBuild: boolean;

    /**
     * @description if you want to set the node env
     * @default production
     */
    NODE_ENV: string;
}


let buildFunc = createBuilder<Options>((options, context): Promise<BuilderOutput> | Observable<BuilderOutput> => {
    let runAndBuild = options.runAndBuild === undefined || options.runAndBuild === true ? true : false;
    let buildPromise = buildOnlyMode(context, options);
    if (!runAndBuild)
        return buildPromise;

    let observable = new Observable<BuilderOutput>((observer) => {
        buildPromise.then(({ success }) => {

            // only run the node server if the build was successfull
            if (success) {
                let pid = runNodeServer(context, options);
                if (pid !== undefined)
                    return observer.next({ success: true });

                return observer.next({ success: false });
            }

            // end the observer and publish that it was not successful
            if (!success) {
                observer.next({ success: false });
                observer.complete();
            }
        });

    });

    return observable;
});

export default buildFunc


function runNodeServer(context: BuilderContext, options: Options) {
    // setting the node env option by default it's production 
    let NODE_ENV = options.NODE_ENV || 'production';

    // spawn a node process
    let child = childProcess.fork(`${context.currentDirectory}/${options.mainInOutput}`, [], { env: { NODE_ENV } });

    if (child.stdout) {
        child.stdout.on('data', (data: Buffer) => {
            console.log(Buffer.from(data).toString('utf8'))
        });
    }

    if (child.stderr) {
        child.stderr.on('data', (data: Buffer) => {
            if (child.stdout)
                child.stdout.emit('data', data)
        });
    }

    return child.pid;
}

async function buildOnlyMode(context: BuilderContext, options: Options): Promise<BuilderOutput> {
    let tscResult = spawnTSC(context, options);

    console.log(Buffer.from(tscResult.stdout).toString('utf8'));

    if (tscResult.status === 0) {
        context.logger.info('Typescript compiled successfully');
        console.log('Typescript compiled successfully');
    }

    return { success: tscResult.status === 0 };
}

function spawnTSC(context: BuilderContext, options: Options) {
    return childProcess.spawnSync('tsc', [
        '--build', `${context.currentDirectory}/${options.tsconfig}`,
        '--pretty'
    ]);
}
import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { logging, schema } from '@angular-devkit/core';
import * as fs from 'fs';
import { Options } from './index';

const { join } = require('path');

describe('Command Runner Builder', () => {
    let architect: Architect;
    let architectHost: TestingArchitectHost;

    beforeEach(async () => {
        const registry = new schema.CoreSchemaRegistry();
        registry.addPostTransform(schema.transforms.addUndefinedDefaults);

        // Arguments to TestingArchitectHost are workspace and current directories.
        // Since we don't use those, both are the same in this case.
        architectHost = new TestingArchitectHost(__dirname, __dirname);
        architect = new Architect(architectHost, registry);


        // This will either take a Node package name, or a path to the directory
        // for the package.json file.
        await architectHost.addBuilderFromPackage(join(__dirname, '..'));
        console.log('#', Array.from((architectHost as any)._builderMap.keys()));

        jasmine.DEFAULT_TIMEOUT_INTERVAL = (1000 * 60) * 2; // 1 min
    });

    it('should build the project successfully', async () => {
        // Create a logger that keeps an array of all messages that were logged.
        const logger = new logging.Logger('');
        let logs: string[] = [];
        logger.subscribe(ev => logs.push(ev.message));

        let options: Options = {
            mainInOutput: 'testapp/dist/test.js',
            tsconfig: 'testapp/tsconfig.json',
            runAndBuild: false,
            NODE_ENV: 'production',
            copy: [
                { from: './build/testapp/', to: './testos/' }
            ],
            clean: []
        };

        // A "run" can contain multiple outputs, and contains progress information.
        const run = await architect.scheduleBuilder('ts-node-builder:build', options, { logger });  // We pass the logger for checking later.

        // The "result" member is the next output of the runner.
        // This is of type BuilderOutput.
        let output = await run.result;

        // Stop the builder from running. This really stops Architect from keeping
        // the builder associated states in memory, since builders keep waiting
        // to be scheduled.
        await run.stop();

        // Expect that it succeeded.
        expect(output.success).toBe(true);

        // Expect that this file was listed. It should be since we're running
        // `ls $__dirname`.
        expect(logs.toString()).toContain('Typescript compiled successfully');

        options = {
            mainInOutput: 'testapp/dist/test.js',
            tsconfig: 'testapp/tsconfig.json',
            runAndBuild: false,
            NODE_ENV: 'production',
            copy: [],
            clean: [
                'testapp/dist'
            ]
        };

        // A "run" can contain multiple outputs, and contains progress information.
        const cleanRun = await architect.scheduleBuilder('ts-node-builder:build', options, { logger });  // We pass the logger for checking later.

        // The "result" member is the next output of the runner.
        // This is of type BuilderOutput.
        let cleanOutput = await cleanRun.result;

        // Stop the builder from running. This really stops Architect from keeping
        // the builder associated states in memory, since builders keep waiting
        // to be scheduled.
        await cleanRun.stop();

        // Expect that it succeeded.
        expect(cleanOutput.success).toBe(true);

        // Since the directory was cleared and testos was not copied the second run, it should not exist
        expect(fs.existsSync(join(__dirname, 'testapp/dist/testos'))).toBe(false)

        // Expect that this file was listed. It should be since we're running
        // `ls $__dirname`.
        expect(logs.toString()).toContain('Typescript compiled successfully');
    });

    it('should build and run successfully', async () => {
        // Create a logger that keeps an array of all messages that were logged.
        const logger = new logging.Logger('');
        const logs: string[] = [];
        logger.subscribe(ev => logs.push(ev.message));

        let options: Options = {
            mainInOutput: 'testapp/dist/test.js',
            tsconfig: 'testapp/tsconfig.json',
            runAndBuild: true,
            NODE_ENV: 'production',
            copy: [
                { from: './build/testapp/', to: './testos/' }
            ],
            clean: []
        };

        // A "run" can contain multiple outputs, and contains progress information.
        const run = await architect.scheduleBuilder('ts-node-builder:build', options, { logger });  // We pass the logger for checking later.

        // The "result" member is the next output of the runner.
        // This is of type BuilderOutput.
        await run.result;

        // Stop the builder from running. This really stops Architect from keeping
        // the builder associated states in memory, since builders keep waiting
        // to be scheduled.
        await run.stop();
    });

});
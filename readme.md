# Ts-node-builder

This is an angular cli builder tool compatible and made for the use in [nx.dev](https://nx.dev/) tool.
It helps in building and developing typescript node apps using nodemon , ts-node and helps get away from webpack since it has many problems when used with node js.

[![npm version](https://badge.fury.io/js/ts-node-builder.svg)](https://badge.fury.io/js/ts-node-builder)

## Installation

```
npm i ts-node-builder
```

or using yarn

```
yarn add ts-node-builder
```

## How to use

Since this is a builder I am assuming that you already have a nrwl workspace installed you can checkout their guide on how to make a fullstack app [here](https://nx.dev/web/fundamentals/build-full-stack-applications) if you don't have one already.

In your workspace.json file inside the `architect` property add a new property 
lets call it `build` or you can call it whatever you want.

Example of as the json below

```
{
    "architect": {
        "build": {
            "builder": "ts-node-builder:build",
            "options": {
                "mainInOutput": "dist/out-tsc/apps/api/src/app.js",
                "tsconfig": "apps/api/tsconfig.app.json",
                "runAndBuild": false
            }
        }
    }
}
```
As you can see above first we needed specify the builder in this case it is 
`ts-node-builder:build`
then we need to specify the builder options.

Now we will talk in details what are the available builders and their available options

## ts-node-builder:dev

#### Description 
This builder help in the development process by using nodemon and ts-node to 
compile and run typescript and watch for change to recompile and restart the node server.

#### Builder name  
`ts-node-builder:dev`

#### Builder options

| name | mandatory|datatype | default | description
|--|--|--|--|--|
| main | yes |string | N/A |this is the main file to run ex: app.ts |
| watch | yes |string[] | N/A |this is the array of folder to watch and restart if any changes happened inside them |
| transpileOnly | no | boolean | true | this is a flag to control the transpileOnly mode in the ts-node |
| tsconfig | yes | string | N/A | this is the tsconfig file path to use |
| debug | no | boolean | false|this is a flag to run the process in debug mode |
| debugPort | no | number | 9229 |this is the debug port if specified it's used also it's value was `0` then it will auto assign a free port each time it runs|



## ts-node-builder:build

#### Description

This builder will help you to build the project by running the tsc command and use the tsconfig
that will provide and it optionally have the ability to run the server after the compilation, usually 
this builder is used in deployments to build the project.

#### Builder name 

`ts-node-builder:build`

#### Builder options

| name | mandatory|datatype | default | description
|--|--|--|--|--|
|mainInOutput|yes|string|N/A|This is the main file to run in the output path ex: dist/src/app.js |
|tsconfig|yes|string|N/A|tsconfig.json path to be used in the build process|
|runAndBuild|no|boolean|false|this is an option that will run the node server after building if false it will only build|
|NODE_ENV|no|string|production|if you want to set the node env it's production by default since usually it's assumed that this command will be used for the build process|


Please raise any issues if there is any problem and don't forget to put a star :star: :wink: if you like this package.

**Made with :heart: to my organization and to the opensource world**.
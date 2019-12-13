# Ts-node-builder

  

This is an angular cli builder tool compatible and made for the use in [nx.dev](https://nx.dev/) tool.

It helps in building and developing typescript node apps using nodemon , tsc also , helps get away from webpack since it has many problems when used with node js.

  
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
| mainInOutput | yes |string | N/A |This is the main file to run in the output path ex: dist/src/app.js |
| tsconfig | yes | string | N/A | this is the tsconfig file path to use |
| watch | no |string[] | N/A | array of folders to pass to nodemon by default nodemon watch the project based directory it's recommended to specify this value but, it's optional |
| debug | no | boolean | false|this is a flag to run the process in debug mode |
| debugPort | no | number | 9229 |this is the debug port if specified it's used also it's value was `0` then it will auto assign a free port each time it runs|
 |NODE_ENV| no | string | development | node environment variable you can put it with any value you want |
 |delayBetweenRestarts|no|number or string | 1.5 seconds | this is the delay in seconds which is passed to nodemon it's measured in seconds or milliseconds when specified check [nodemon docs here]([https://github.com/remy/nodemon#delaying-restarting](https://github.com/remy/nodemon#delaying-restarting))
 |copy|no|array|N/A|this option is used to copy commands it's an array of objects ``` [ {"from":"./from/path", "to": "./to/path" } ] ``` it can copy files or directories|

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
|copy|no|array|N/A|this option is used to copy commands it's an array of objects ``` [ {"from":"./from/path", "to": "./to/path" } ] ``` it can copy files or directories|
|clean|no|string []|N/A| this options allow cleaning before build by giving it an array of paths to delete before the build happen `"clean":["folder/to/delete"]` |
  
**NICE NOTE** usually the users of this builder are [nx.dev](https://nx.dev/) users so , I have also made a nx helper cli to help run for example all the microservices with just one command based on a json file check it out [here](https://www.npmjs.com/package/nx-helper-cli)
  

Please raise any issues if there is any problem and don't forget to put a star :star: :wink: if you like this package.
 
**Made with :heart: to my organization and to the opensource world**.

## Release Notes

#### 1.0.0
This was the first version it included the two commands dev and build .
dev was using the ts-node and nodemon. build was using tsc and node commands normally.

#### 2.0.0
Changed the `dev` command and made it use tsc and nodemon instead of ts-node since sometimes ts-node make problems in typescript weird problems.
also added new features like delayDelayBetweenRestarts flag to prevent nodemon from restarting multiple times unnecessary and NODE_ENV too so if we wanted to develop on a different env than the development but, it's development by default.

#### 2.1.0

new feature adding a copy option to take an array of object from and to for  things like assets and those stuff.
it looks like that 
```
[
	{
		"from":"./from/path",
		"to": "./to/path"
	}
]
```

#### 2.2.0

new feature thanks to [gibsonjoshua55](https://github.com/gibsonjoshua55) who implemented it which is to be able to clean up or delete folders before the build and it's used like that 

```
{
    "clean": ["folder/to/delete","other/folder/to_delete"]
}
```



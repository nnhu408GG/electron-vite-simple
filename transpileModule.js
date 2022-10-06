// "main": "./electron/main.ts",
const path = require("path");
const ts = require("typescript");
const fs = require("fs");

/* 载入package.json配置中的main，该mian记录入口文件：main.ts */
const { electronMain } = require("./package.json");
/* 载入typescript.json配置 */
const compilerOptions = require("./electron/tsconfig.json");

/* 读取main指定路径的文件 main.ts 源文件 */
const content = fs.readFileSync(path.resolve(__dirname, electronMain), "utf-8");
/* 将ts编译成js源文件 */
const { outputText } = ts.transpileModule(content, { compilerOptions });
/* 执行js */
module._compile(outputText, path.resolve(__dirname, electronMain));

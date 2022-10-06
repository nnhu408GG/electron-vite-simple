# ELectron + Vue 3 + TypeScript + Vite

简易配置

## 热更新模块的核心

- transpileModule.js

```js
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
/* todo 这里还不太懂 */
module._compile(outputText, path.resolve(__dirname, electronMain));
```

## 主要变动

- index.html

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'">
```

- /electron/tsconfig.json

> 注意要严格的json格式，特别是最后不要多加逗号！😭

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "CommonJS",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,

    "noEmit": false,
    "outDir": "../dist/electron"
  },
  "include": ["./"]
}
```

- package.json 

```json
{
  "electronMain": "./electron/main.ts",   // electron的入口文件（在这里开发）
  "main": "./dist/electron/main.js",      // 打包后的目标入口文件
  "scripts": {
    "dev": "vite & npm run nodemon",
    "nodemon": "export NODE_ENV='development' && nodemon --exec electron transpileModule.js --watch ./electron --ext .ts",
    "build": "vite build && tsc -p ./electron && electron-builder"
  },
  "build": {
    "files": [
      "./dist/**/*"
    ],
    "extends": null
  },
}
```

- vite.config.ts

```js
export default defineConfig({
  base: "./",
  plugins: [vue()],
})
```
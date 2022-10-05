# ELectron + Vue 3 + TypeScript + Vite

简易配置

## 主要变动

- index.html

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'">
```

- /electron/main.ts require引用的ts提示

```ts
/**
 * @type {import('electron')}
 */
const { app, BrowserWindow } = require("electron")

/**
 * @type {import('electron-win-state')}
 */
const WinState = require("electron-win-state").default

/** 
 * @type {import('path')} 
 * */
const path = require("path")
```

- /electron/tsconfig.json

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
  "include": ["./"],
}
```

- package.json 

```json
{
  "type": "commonjs",
  "main": "electron/main.ts",
  "scripts": {
    "build": "vite build && tsc -p ./electron && electron-builder",
    "reload": "electron .",
    "nodemon": "nodemon --exec electron . --watch ./electron --ext .ts"
  },
  "devDependencies": {
    "electron": "^21.0.1",
    "electron-builder": "^23.3.3",
    "nodemon": "^2.0.20",
  }
}
```

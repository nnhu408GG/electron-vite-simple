import { app, BrowserWindow } from "electron"
import WinState from "electron-win-state"
import * as path from "path"
import * as dotenv from "dotenv"

const NODE_ENV_DEVELOPMENT = "development"
const NODE_ENV_PRODUCTRON = "production"

// const NODE_ENV = process.env?.NODE_ENV === NODE_ENV_DEVELOPMENT ? NODE_ENV_DEVELOPMENT : NODE_ENV_PRODUCTRON

let NODE_ENV = NODE_ENV_PRODUCTRON

if (process.env?.NODE_ENV === NODE_ENV_DEVELOPMENT) {
    NODE_ENV = NODE_ENV_DEVELOPMENT
}

console.log("NODE_ENV:", NODE_ENV);

if (NODE_ENV === NODE_ENV_DEVELOPMENT) dotenv.config({ path: ".env.development" });
if (NODE_ENV === NODE_ENV_PRODUCTRON) dotenv.config({ path: ".env.production" });

const __DEV__ = NODE_ENV === NODE_ENV_DEVELOPMENT ? true : false

function createWindow() {
    const winstate = new WinState({
        defaultWidth: 1200,
        defaultHeight: 800,
    })

    const win = new BrowserWindow({
        ...winstate.winOptions,
        webPreferences: {
            // preload: path.resolve(__dirname, "./preload/index")
            preload: "./preload"
        }
    })

    winstate.manage(win)

    win.loadURL(__DEV__ ? "http://localhost:5173/" : `file://${path.join(__dirname, '../index.html')}`)

    /* 启动时打开 开发者工具 */
    if (__DEV__) {
        win.webContents.openDevTools({ mode: "detach", activate: false });
    }

    win.once("ready-to-show", () => {
        win.show();
    });
}

app.whenReady().then(() => {
    createWindow()
})

// 在MacOS下，点击dock图标时触发
app.on("activate", () => {
    console.log("activate");
    /* 当全部窗口数量为0时 */
    if (BrowserWindow.getAllWindows().length === 0) {
        console.log("createWindow");
        createWindow();
    }
});

// MacOS下，关闭窗口是否直接退出应用
app.on("window-all-closed", () => {
    console.log("window-all-closed"); // 在终端能看到
    if (process.platform !== "darwin") {
        // darwin表示MacOS系统
        app.quit();
    }
});


app.on("quit", () => {
    console.log("quit");
});
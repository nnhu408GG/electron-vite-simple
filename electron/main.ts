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

function createWindow() {
    const winstate = new WinState({
        defaultWidth: 1200,
        defaultHeight: 800,
    })

    const win = new BrowserWindow({
        ...winstate.winOptions,
        webPreferences: {
            preload: path.resolve(__dirname, "./preload/index.ts")
        }
    })

    winstate.manage(win)

    win.loadURL("http://localhost:5173/")

    /* 启动时打开 开发者工具 */
    win.webContents.openDevTools({ mode: "detach", activate: false });

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
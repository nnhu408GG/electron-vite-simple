# 概念

web技术

Electron = Chromium + Node.js + Native APIs

# electron 核心概念
主进程 Main Process : 启动项目时运行的 main.js 脚本就是主进程。在主进程运行的脚本可以 以创建 web 页面的形式 展示 GUI。主进程只有一个。

渲染进程 Render Process : 每个 Electron 的窗口页面都有自己的进程，这样的进程称之为渲染进程（基于Chromium的多线程结构）

# 安装

- electron

```sh
npm i electron -D
```

- nodemon

```sh
npm i nodemon -D
```

package.json配置

```js
"nodemon": "nodemon --exec electron ."
or
"nodemon": "nodemon --exec electron . -- watch ./ --ext .js,.html,.css,.vue"
```


# 沙箱隔离机制

主进程使用 BrowserWindow 创建实例，主进程销毁后，对应的渲染进程会被终止。主进程与渲染进程通过 **IPC** 方式（事件驱动）进行通信。

> 早期Electron不太关心安全，在渲染进程是可以直接操作主进程的模块，后来发现并不好。因此需要主进程与渲染进程之间的隔离。

关闭隔离配置（让渲染进程使用到node.js模块）

```js
// main.js

const createWindow = () => {
  const win = new BrowserWindow({
    /* webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }, */
  });
};
```



# 配置csp
> HTTP 协议的 `Content-Security-Policy` 响应头允许网站管理员控制用户代理可以为给定页面加载的资源
在 <head> 中配置
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'">
```

default-src 'self'
> 默认情况下所有的src都是本地的


# 入门

- app
它控制应用程序的事件生命周期。

- BrowserWindow
它创建和管理应用程序 窗口。

- preload
预加载

# 主进程

## 主进程的生命周期

- `app.whenReady()` 当主进程初始化完成时
- `app.on("window-all-closed")` 当全部窗口都关闭的时候
- `app.on("activate")`  在MacOS下，点击dock图标时触发
- `app.on("before-quit")` 在关闭窗口之前触发
- `app.on("quit")`  该应用退出时执行（若操作系统关机、重启、注销而关闭则不会触发）
- `app.on("browser-window-blur")` 在 browserWindow 失去焦点时触发
- `app.on("browser-window-focus")` 在 browserWindow 获得焦点时触发
- `BrowserWindow.webContents.on("did-finish-load")` 当页面的所有资源加载完毕后触发
- `BrowserWindow.webContents.on("dom-ready")` 当dom元素加载完毕后触发
- `BrowserWindow.webContents.on("new-window")` 监测是否打开了某些窗口
- `BrowserWindow.webContents.on("context-menu")` 鼠标右键触发，可监测页面上的dom上下文信息（便于实现鼠标右键的菜单功能）

## 主进程方法
- `app.quit()` 退出应用
- `app.getPath(name)` name: desktop|music|temp|userData  获取到系统里的目录

## BrowserWindow
> 创建和控制浏览器窗口

- 当页面完全加载完毕后才显示窗口
```js
win.once("ready-to-show", () => {
  win.show();
});
```

## 父子窗口
```js
const win2 = new BrowserWindow({
    frame: false,   // 关闭窗口的顶部菜单
    // parent: win, // 定义父级窗口
    // modal: true, // 固定为模态窗口
});

win2.loadURL("./index.html");
```


## 拖动body来拖动窗口
```css
html {
    height: 100%;
}

body {
  height: 100%;
  user-select: none;
  -webkit-app-region: drag;
  background-color: #fff;
}
```
为了避免`<input>`标签中也发生拖动窗口的效果
```css
input {
  -webkit-app-region: no-drag;
}
```

## 保存窗口状态state
```sh
npm i electron-win-state -S
```
```js
// 重点注意引入方式后面有个 .default
const WinState = require("electron-win-state").default;

const createWindow = () => {
  const winstate = new WinState({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  win = new BrowserWindow({
    ...winstate.winOptions, // 当使用winstate的时候，不要在 BrowserWindow 中定义 width 和 height。
    // width: 1200,
    // height: 800,
  });

  winstate.manage(win)
}
```



# IPC通信
- `ipcMain`      从主进程到渲染进程的异步通信
- `ipcRenderer`  从渲染器进程到主进程的异步通信

- ./main.js
```js
ipcMain.handle("my-invokable-ioc", async (event, msg) => {
  console.log("my-invokable-ioc", msg);
  return msg;
});
```

- ./preload.js
```js
const { contextBridge, ipcRenderer } = require("electron");

const handleSend = async (msg) => {
  let res = await ipcRenderer.invoke("my-invokable-ioc", msg);
  console.log("res:", res);
};

// 将对象注入到 位于window上的 myapi-demo1
contextBridge.exposeInMainWorld("myapi-demo1", {
  handleSend,
});
```

- ./app.js
```js
window["myapi-demo1"].handleSend("qqqqq");
```


# dialog

- showOpenDialog

```js
dialog.showOpenDialog({
    buttonLabel: "选择1", // 确认选择的按钮
    defaultPath: app.getPath("desktop"),
    properties: [
        //   "multiSelections", // 选择多个文件
        "createDirectory", // 新建文件夹
        //   "openFile", // 选择文件
        //   "openDirectory", // 可以打开文件夹
    ],
}).then((res) => {
    console.log(res);
});
```

- showSaveDialog

- showMessageBox

> 操作系统带的消息框

```js
const answers = ["Yes", "No", "Maybe","fffvv","2342"];
  dialog.showMessageBox({
    title: "message box",
    message: "please select an option",
    detail: "message details.",
    buttons: answers,
  }).then(res=>{
    console.log(res);
  })
```

# 系统按键+组合键

```js
globalShortcut.register("G", () => {
  console.log("g");
});

globalShortcut.register("CommandOrControl+G", () => {
  console.log("CommandOrControl+G");
  globalShortcut.unregister("CommandOrControl+G")  // 卸载
});
```

# 定制菜单
## 定制顶部菜单
```js
let mainMenu = Menu.buildFromTemplate(require("./mainMenu"));
```

```js
const createWindow = () => {
  Menu.setApplicationMenu(mainMenu);
};
```

```js
module.exports = [
  {
    label: "Electron",
    submenu: [
      { label: "Item 1" },
      { label: "Item 2", submenu: [{ label: "Sub Item 1" }] },
      { label: "Item 3" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { role: "copy" },
      { role: "paste" },
    ],
  },
  {
    label: "Actions",
    submenu: [
      {
        label: "DevTools",
        role: "toggleDevTools",
      },
      {
        role: "toggleFullScree",
      },
      {
        label: "Greet",
        click: () => {
          console.log("hello from main menu");
        },
        acceleratro: "Shift+Alt+G",
      },
    ],
  },
];
```

## 定制右键菜单
```js
let contextMenu = Menu.buildFromTemplate([
  { label: "Item 1" },
  { role: "editMenu" },
]);
```

```js
const createWindow = () => {
  win.webContents.on("context-menu", (e, params) => {
      contextMenu.popup();
  });
};
```

# 托盘 小图标
```js
let tray = new Tray("./tray.png");

const contextMenu = Menu.buildFromTemplate([{ label: "Item 1 " }, { role: "quit" }])

tray.setToolTip("Tray details 123");
tray.on("click", (e) => {
  if (e.shiftKey) {
    app.quit();
  } else {
    win.isVisible() ? win.hide() : win.show();
  }
});
tray.setContextMenu(contextMenu);
```

---

# 渲染进程

- clipboard
```js
clipboard.writeText("Example string sbsbsbsv");
```



# Axios下载
```js
let res = await axios.get(blob, {
  // headers: {
  //   "Content-Type": "multipart/form-data",
  // },
  responseType: "arraybuffer",
});

fs.writeFile(
  "/Users/nnhu/Desktop/gallery-target-path/text.png",
  res.data,
  (err) => {
    console.log("err:", err);
  }
);
```
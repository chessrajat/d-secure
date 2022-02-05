const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const decrypt = require("../Code/Decrypt");
const encrypt = require("../Code/Encrypt");

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../index.html")}`;

  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});

const menuTemplate = [{ role: "fileMenu" }];

ipcMain.on("encrypt", (e, { filePath, pass, keepfile }) => {
  console.log({ filePath, pass, keepfile });
  encrypt(
    {
      file: filePath,
      password: pass,
      keepOriginal: keepfile,
    },
    mainWindow
  );
});

ipcMain.on("decrypt", (e, { filePath, pass, keepfile }) => {
  console.log({ filePath, pass, keepfile });
  decrypt(
    {
      file: filePath,
      password: pass,
      keepOriginal: keepfile,
    },
    mainWindow
  );
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Stop error
app.allowRendererProcessReuse = true;

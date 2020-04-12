'use strict';

import {
    app,
    BrowserWindow,
    dialog,
    ipcMain,
    Menu,
    protocol,
    screen,
    Tray,
} from 'electron';
import {
    createProtocol,
    installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';

import path from 'path';
import {
    appConfigStore,
    Defaults,
    IAppConf,
    ReadyAppConfig,
} from './appConfig';

interface IIpcMainOnEvent {
    sender: { send: (arg0: string, arg1: any) => void };
}

const isDevelopment: boolean = process.env.NODE_ENV !== 'production';

let appConf: IAppConf;
let appIcon: Tray;
const appVersion: string = '1.0';
// keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let advancedWin: BrowserWindow | null;
let minimalWin: BrowserWindow;
// let aboutWin: BrowserWindow;

// ----------------
let lockSaveSizeInConfig: boolean = false;
let advancedWinSize: number[];

// scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true } },
]);

function createWindow(): void {
    const screenWorkAreaSize: Electron.Size = screen.getPrimaryDisplay()
        .workAreaSize;
    advancedWin = new BrowserWindow({
        width:
            appConf.window.advanced.size.width > screenWorkAreaSize.width
                ? Defaults.window.advanced.size.width
                : appConf.window.advanced.size.width,
        height:
            appConf.window.advanced.size.height > screenWorkAreaSize.height
                ? Defaults.window.advanced.size.height
                : appConf.window.advanced.size.height,
        minHeight: Defaults.window.advanced.size.minHeight,
        minWidth: Defaults.window.advanced.size.minWidth,
        center: true,
        // x:appConf.window.advanced.position.x,
        // y:appConf.window.advanced.position.y,
        frame: false,
        transparent: true,
        hasShadow: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });

    advancedWin.on('focus', () => {
        if (!advancedWin) {
            return;
        }
        if (appConf.window.advanced.state === 'maximized') {
            advancedWin.maximize();
        }
    });

    minimalWin = new BrowserWindow({
        width: 350,
        height: 80,
        show: false,
        parent: advancedWin,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // aboutWin = new BrowserWindow({
    //     width: 400, height: 400,
    //     parent: advancedWin, show: false});

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // load the url of the dev server if in development mode
        advancedWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        minimalWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '/#/minimal');
        // aboutWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "/#/about");

        if (!process.env.IS_TEST) {
            advancedWin.webContents.openDevTools();
            //  minimalWin.webContents.openDevTools()
        }
    } else {
        createProtocol('app');
        // load the index.html when not in development
        advancedWin.loadURL('app://./index.html');
        minimalWin.loadURL(`file://${__dirname}/index.html#minimal`);
        //   aboutWin.loadURL(`file://${__dirname}/index.html#about`);
    }

    advancedWin.on('closed', () => {
        advancedWin = null;
    });

    advancedWin.on('resize', (event: any) => {
        if (!advancedWin) {
            return;
        }

        appConfigStore.set(
            'window.advanced.state',
            advancedWin.isMaximized() ? 'maximized' : 'normal'
        );
        // we put the last size in advancedWinSize variable but prevent of save config file in short intervals by lockSaveSizeInConfig
        advancedWinSize = advancedWin.getSize();

        if (!lockSaveSizeInConfig) {
            saveSizeInConfig();
        }
    });

    minimalWin.on('close', event => {
        event.preventDefault();
        minimalWin.hide();
    });

    // aboutWin.on("close", (e) => {
    //   e.preventDefault();
    //   aboutWin.hide();
    // });

    // if(appConf.window.advanced.position.x<0 ||
    //   appConf.window.advanced.position.y<0) {
    //     let bounds:Electron.Rectangle =advancedWin.getBounds();
    //     const workAreaSize:Electron.Size = screen.getPrimaryDisplay().workAreaSize;
    //     let x:number = Math.ceil((workAreaSize.width - bounds.width) / 2);
    //     let y:number = Math.ceil((workAreaSize.height -bounds.height) / 2);
    //     advancedWin.setPosition(x,y);
    //     appConfigStore.set("appConf.window.advanced.position.x",x);
    //     appConfigStore.set("appConf.window.advanced.position.y",y);
    // }
}

function saveSizeInConfig(): void {
    if (!advancedWin) {
        return;
    }
    lockSaveSizeInConfig = true;
    // delay befor each save config to prevent repeatitive write files during moveing the advancedWin window
    setTimeout(() => {
        try {
            const width = advancedWinSize[0];
            const height = advancedWinSize[1];
            appConfigStore.set('window.advanced.size.width', width);
            appConfigStore.set('window.advanced.size.height', height);
        } finally {
            lockSaveSizeInConfig = false;
        }
    }, 1000);
}

// quit when all windows are closed.
app.on(`window-all-closed`, () => {
    // on macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }

    if (appIcon) {
        appIcon.destroy();
    }
});

app.on('activate', () => {
    // on macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (advancedWin === null) {
        const forceDefaults: boolean = false;
        // this method ready the appConfig and return an instance of it as promise
        ReadyAppConfig(appVersion, forceDefaults).then(
            (resultAppConf: IAppConf) => {
                appConf = resultAppConf;
                createWindow();
            }
        );
    }
});

// this method will be called when Electron has finished
// initialization and is ready to create browser windows.
// some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // install Vue Devtools
        try {
            await installVueDevtools();
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }

    const forceDefaults: boolean = false;
    // this method ready the appConfig and return an instance of it as promise
    ReadyAppConfig(appVersion, forceDefaults).then(
        (resultAppConf: IAppConf) => {
            appConf = resultAppConf;
            createWindow();
            setTrayIcon();
        }
    );
});

// exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}

// --------------------------------------------------------------------------

ipcMain.on('toggle-image', (event: IIpcMainOnEvent, arg: any) => {
    if (advancedWin) {
        advancedWin.hide();
    }
    minimalWin.show();
    minimalWin.webContents.send('image', arg);
});

ipcMain.on('switch-2-advanced-window', (event: IIpcMainOnEvent, arg: any) => {
    minimalWin.hide();
    if (advancedWin) {
        advancedWin.show();
    }
});

// --------------------------------------------------------------------------
// setting the SysTray Icon of the app
function setTrayIcon(): void {
    const iconName: string =
        process.platform === 'win32'
            ? 'coderplay_windows_icon.png'
            : 'coderplay_os_icon.png';
    const iconPath: string = path.join(
        __dirname,
        '..\\src\\assets\\tray',
        iconName
    );
    appIcon = new Tray(iconPath);

    const contextMenu: Menu = Menu.buildFromTemplate([
        {
            label: 'Remove',
            click: (event: any) => {
                event.sender.send('tray-removed');
            },
        },
    ]);

    ipcMain.on('tray-removed', () => {
        appIcon.destroy();
    });

    appIcon.setToolTip('CoderPlay');
    appIcon.setContextMenu(contextMenu);
}

// --------------------------------------------------------------------------
// information dialog
ipcMain.on('open-information-dialog', (event: IIpcMainOnEvent) => {
    const options: any = {
        type: 'info',
        title: 'Information',
        message: "This is an information dialog. Isn't it nice?",
        buttons: ['Yes', 'No'],
    };
    dialog.showMessageBox(options, index => {
        event.sender.send('information-dialog-selection', index);
    });
});

// --------------------------------------------------------------------------
// open file dialog
ipcMain.on('open-file-dialog', (event: IIpcMainOnEvent) => {
    dialog.showOpenDialog(
        {
            properties: ['openFile', 'openDirectory'],
        },
        files => {
            if (files) {
                event.sender.send('selected-directory', files);
            }
        }
    );
});

// --------------------------------------------------------------------------
// save dialog
ipcMain.on('save-dialog', (event: IIpcMainOnEvent) => {
    const options: any = {
        title: 'Save an Image',
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
    };
    dialog.showSaveDialog(options, (filename: any) => {
        event.sender.send('saved-file', filename);
    });
});

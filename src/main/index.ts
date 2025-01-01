import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { dependencyService, DependencyName } from '@mcpm/sdk'
import icon from '../../resources/icon.svg?asset'
import { setupRegistryHandlers } from './handlers/registry'
import { setupImageHandlers } from './handlers/image'
import { IPC_CHANNELS } from '@shared/constants'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // 设置 CSP
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self';",
          "img-src 'self' data: https: http:;",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
          "style-src 'self' 'unsafe-inline';",
          "connect-src 'self' https://registry.mcphub.io https://app.mcphub.net;"
        ].join(' ')
      }
    })
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // disable web security for development
    }
  })

  setupImageHandlers()

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      console.error('"mainWindow" is not defined')
      return
    }
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
ipcMain.on(IPC_CHANNELS.CHECK_DEPENDENCIES, async () => {
  if (!mainWindow) return
  try {
    const dependencies = await Promise.all([
      dependencyService.checkDependency(DependencyName.NPM),
      dependencyService.checkDependency(DependencyName.UX)
    ])
    mainWindow.webContents.send(IPC_CHANNELS.DEPENDENCY_STATUS, dependencies)
  } catch (error) {
    console.error('Failed to check dependencies:', error)
  }
})

ipcMain.on(IPC_CHANNELS.INSTALL_DEPENDENCY, async (_, name: string) => {
  if (!mainWindow) return
  console.log(`Installing ${name}`)
  try {
    await dependencyService.installDependency(name)
    const dependencies = await Promise.all([
      dependencyService.checkDependency(DependencyName.NPM),
      dependencyService.checkDependency(DependencyName.UX)
    ])
    mainWindow.webContents.send(IPC_CHANNELS.DEPENDENCY_STATUS, dependencies)
  } catch (error) {
    console.error(`Failed to install ${name}:`, error)
  }
})

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Register MCPM IPC handlers
  // ipcMain.handle('mcpm:install', async (_, packageName) => {
  //   return await mcpmService.install(packageName)
  // })

  // ipcMain.handle('mcpm:uninstall', async (_, packageName) => {
  //   return await mcpmService.uninstall(packageName)
  // })

  // ipcMain.handle('mcpm:list', async () => {
  //   return await mcpmService.list()
  // })

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Setup handlers
  setupRegistryHandlers()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

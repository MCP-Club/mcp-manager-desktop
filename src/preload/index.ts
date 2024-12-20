import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  mcpm: {
    install: (packageName: string): Promise<unknown> =>
      ipcRenderer.invoke('mcpm:install', packageName),
    uninstall: (packageName: string): Promise<unknown> =>
      ipcRenderer.invoke('mcpm:uninstall', packageName),
    list: (): Promise<unknown> => ipcRenderer.invoke('mcpm:list')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

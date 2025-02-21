import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '@shared/constants'
import Debug from 'debug'

const debug = Debug('app::main::handlers::image')

export function setupImageHandlers() {
  ipcMain.handle(IPC_CHANNELS.FETCH_IMAGE, async (_event, url: string) => {
    console.log('Fetching image from:', url)
    try {
      const response = await fetch(url)
      if (!response.ok) {
        console.error('Failed to fetch image:', response.status, response.statusText)
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      debug('Image content type:', contentType)

      const buffer = await response.arrayBuffer()
      const base64Data = Buffer.from(buffer).toString('base64')
      const dataUrl = `data:${contentType || 'image/svg+xml'};base64,${base64Data}`
      debug('Successfully converted image to base64')
      return dataUrl
    } catch (error) {
      console.error('Error in fetch-image handler:', error)
      throw error
    }
  })
}

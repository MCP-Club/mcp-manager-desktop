import { IPC_CHANNELS } from '@shared/constants'
import { RegistryMCPServerItem } from '@shared/types'
import { ipcMain } from 'electron'

export function setupRegistryHandlers() {
  ipcMain.handle(IPC_CHANNELS.FETCH_REGISTRY, async (_, query?: string) => {
    try {
      const url = query
        ? `https://registry.mcphub.io/search?q=${encodeURIComponent(query)}`
        : 'https://registry.mcphub.io/registry'
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch servers')
      }
      return await response.json() as RegistryMCPServerItem[]
    } catch (error) {
      console.error('Error fetching registry:', error)
      throw error
    }
  })

  ipcMain.handle(IPC_CHANNELS.FETCH_SERVER_DETAIL, async (_, id: string) => {
    try {
      const response = await fetch(`https://registry.mcphub.io/registry/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch server details')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching server detail:', error)
      throw error
    }
  })
}

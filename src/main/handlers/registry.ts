import { ipcMain } from 'electron'

export function setupRegistryHandlers() {
  ipcMain.handle('fetch-registry', async (_, query?: string) => {
    try {
      const url = query
        ? `https://registry.mcphub.io/search?q=${encodeURIComponent(query)}`
        : 'https://registry.mcphub.io/registry'
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch servers')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching registry:', error)
      throw error
    }
  })

  ipcMain.handle('fetch-server-detail', async (_, id: string) => {
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

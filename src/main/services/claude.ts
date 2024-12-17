import { access } from 'fs/promises'
import fs, { constants } from 'fs'
import { platform } from '@electron-toolkit/utils'

const MAC_CONFIG_PATH = '~/Library/Application Support/Claude/claude_desktop_config.json'
// $env:AppData\Claude\claude_desktop_config.json
const WIN_CONFIG_PATH =
  'C:\\Users\\%username%\\AppData\\Roaming\\Claude\\claude_desktop_config.json'

export interface ClaudeConfig {
  mcpServers?: {
    [key: string]: {
      name: string
      url: string
      token: string
    }
  }
}

export class ClaudeHostService {
  async findClaudeAppDataPath(): Promise<string | null> {
    if (platform.isMacOS) {
      return this.findClaudeAppDataPathMac()
    }

    return null
  }

  async findClaudeAppDataPathMac(): Promise<string | null> {
    const DEFAULT_APP_PATH = '/Applications/Claude.app'
    // test if the app is installed
    try {
      await access(DEFAULT_APP_PATH, constants.F_OK)
      return DEFAULT_APP_PATH
    } catch {
      return null
    }
  }

  async findClaudeAppDataPathLinux(): Promise<string | null> {
    return null
  }

  async findClaudeAppDataPathWindows(): Promise<string | null> {
    return null
  }

  async getClaudeConfigPath(): Promise<string | null> {
    if (platform.isMacOS) {
      return MAC_CONFIG_PATH
    }
    if (platform.isWindows) {
      return WIN_CONFIG_PATH
    }
    return null
  }

  async getClaudeConfig(): Promise<ClaudeConfig | null> {
    const path = await this.getClaudeConfigPath()
    if (!path) {
      return null
    }
    try {
      const content = await fs.promises.readFile(path, 'utf8')
      return JSON.parse(content)
    } catch {
      console.log('Claude config not found')
      return null
    }
  }

  async createDefaultClaudeConfig(): Promise<ClaudeConfig> {
    return {
      mcpServers: {}
    }
  }

  private stringifyClaudeConfig(config: ClaudeConfig): string {
    return JSON.stringify(config, null, 2)
  }

  async createClaudeConfigFile(): Promise<ClaudeConfig> {
    const path = await this.getClaudeConfigPath()
    if (!path) {
      throw new Error('Claude config path not found')
    }
    const defaultConfig = await this.createDefaultClaudeConfig()
    await fs.promises.writeFile(path, this.stringifyClaudeConfig(defaultConfig))
    console.log('Claude config created')
    return defaultConfig
  }

  async getOrCreateClaudeConfig(): Promise<ClaudeConfig> {
    const content = await this.getClaudeConfig()
    if (content) {
      return content
    }
    return await this.createClaudeConfigFile()
  }
}

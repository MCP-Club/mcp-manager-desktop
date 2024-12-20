import { platform } from '@electron-toolkit/utils'
import { app } from 'electron'
import path from 'path'
import os from 'os'

export interface ClaudeConfig {
  mcpServers?: {
    [key: string]: {
      name: string
      url: string
      token: string
    }
  }
}

const MAC_CONFIG_PATH = path.join(
  os.homedir(),
  'Library/Application Support/Claude/claude_desktop_config.json'
)
const WIN_CONFIG_PATH = path.join(app.getPath('appData'), 'Claude', 'claude_desktop_config.json')

export class ClaudeHostService {
  constructor(
    private readonly fs = fs.promises,
    private readonly configPaths = {
      mac: MAC_CONFIG_PATH,
      win: WIN_CONFIG_PATH
    }
  ) {}

  private async getClaudeConfigPath(): Promise<string | null> {
    const configPath = platform.isMacOS
      ? this.configPaths.mac
      : platform.isWindows
        ? this.configPaths.win
        : null

    if (!configPath) {
      console.log('Unsupported platform')
      return null
    }

    return configPath
  }

  async getClaudeConfig(): Promise<ClaudeConfig | null> {
    try {
      const configPath = await this.getClaudeConfigPath()
      if (!configPath) return null
      const content = await this.fs.readFile(configPath, 'utf8')
      return JSON.parse(content)
    } catch {
      console.log('Claude config not found')
      return null
    }
  }

  private async createDefaultClaudeConfig(): Promise<ClaudeConfig> {
    return {
      mcpServers: {}
    }
  }

  private stringifyClaudeConfig(config: ClaudeConfig): string {
    return JSON.stringify(config, null, 2)
  }

  async createClaudeConfigFile(): Promise<ClaudeConfig> {
    const defaultConfig = await this.createDefaultClaudeConfig()
    const configPath = await this.getClaudeConfigPath()
    if (!configPath) throw new Error('Unsupported platform')
    await this.fs.writeFile(configPath, this.stringifyClaudeConfig(defaultConfig))
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

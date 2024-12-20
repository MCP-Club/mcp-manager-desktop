import { exec, ExecException } from 'child_process'
import { promisify } from 'util'
import { join } from 'path'
import { app } from 'electron'

const execAsync = promisify(exec)

export class MCPMCliError extends Error {
  constructor(
    message: string,
    public readonly stderr?: string,
    public readonly command?: string
  ) {
    super(message)
    this.name = 'MCPMCliError'
  }
}

export class MCPMService {
  private get cliPath(): string {
    const isDev = !app.isPackaged
    if (isDev) {
      // 在开发环境中，使用项目node_modules中的CLI
      return join(process.cwd(), 'node_modules', '@mcpm', 'cli', 'bin', 'index.js')
    } else {
      // 在生产环境中，使用打包后的resources目录中的CLI
      return join(app.getPath('userData'), 'node_modules', '@mcpm', 'cli', 'bin', 'index.js')
    }
  }

  private async runCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    const fullCommand = `node "${this.cliPath}" ${command}`
    try {
      return await execAsync(fullCommand)
    } catch (error) {
      if (error instanceof Error) {
        const execError = error as ExecException
        throw new MCPMCliError(
          `MCPM CLI command failed: ${error.message}`,
          execError.stderr,
          fullCommand
        )
      }
      throw error
    }
  }

  async install(packageName: string): Promise<string> {
    const { stdout } = await this.runCommand(`install ${packageName}`)
    return stdout
  }

  async uninstall(packageName: string): Promise<string> {
    const { stdout } = await this.runCommand(`uninstall ${packageName}`)
    return stdout
  }

  async list(): Promise<string> {
    const { stdout } = await this.runCommand('list')
    return stdout
  }

  // 可以根据需要添加更多CLI命令的封装
}

export const mcpmService = new MCPMService()

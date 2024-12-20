import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MCPMService, MCPMCliError } from '../mcpm'
import { app } from 'electron'
import { exec } from 'child_process'
import { join } from 'path'

vi.mock('electron', () => ({
  app: {
    isPackaged: false,
    getPath: vi.fn((name: string) => {
      if (name === 'userData') {
        return '/mock/user/data/path'
      }
      return ''
    })
  }
}))

vi.mock('child_process', () => ({
  exec: vi.fn((cmd: string, callback: (error: Error | null, result: { stdout: string; stderr: string }) => void) => {
    callback(null, { stdout: '', stderr: '' })
  })
}))

describe('MCPMService', () => {
  let mcpmService: MCPMService

  beforeEach(() => {
    vi.clearAllMocks()
    mcpmService = new MCPMService()
  })

  it('should use development CLI path when not packaged', async () => {
    const mockExec = vi.mocked(exec)
    mockExec.mockImplementation((cmd: string, callback: (error: Error | null, result: { stdout: string; stderr: string }) => void) => {
      callback(null, { stdout: 'success', stderr: '' })
    })

    await mcpmService.install('test-package')

    const expectedCliPath = join(process.cwd(), 'node_modules', '@mcpm', 'cli', 'bin', 'index.js')
    expect(mockExec).toHaveBeenCalledWith(
      `node "${expectedCliPath}" install test-package`,
      expect.any(Function)
    )
  })

  it('should use production CLI path when packaged', async () => {
    // 修改 app.isPackaged 为 true
    vi.mocked(app).isPackaged = true

    const mockExec = vi.mocked(exec)
    mockExec.mockImplementation((cmd: string, callback: (error: Error | null, result: { stdout: string; stderr: string }) => void) => {
      callback(null, { stdout: 'success', stderr: '' })
    })

    await mcpmService.install('test-package')

    const expectedCliPath = join('/mock/user/data/path', 'node_modules', '@mcpm', 'cli', 'bin', 'index.js')
    expect(mockExec).toHaveBeenCalledWith(
      `node "${expectedCliPath}" install test-package`,
      expect.any(Function)
    )
  })

  it('should handle CLI errors with proper error object', async () => {
    const mockExec = vi.mocked(exec)
    const errorMessage = 'Command failed'
    const stderrOutput = 'Package not found'
    
    const mockError = new Error(errorMessage) as any
    mockError.stderr = stderrOutput
    
    mockExec.mockImplementation((cmd: string, callback: (error: Error | null, result: { stdout: string; stderr: string }) => void) => {
      callback(mockError, { stdout: '', stderr: stderrOutput })
    })

    try {
      await mcpmService.install('test-package')
      fail('Expected error to be thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(MCPMCliError)
      const cliError = error as MCPMCliError
      expect(cliError.message).toContain(errorMessage)
      expect(cliError.stderr).toBe(stderrOutput)
      expect(cliError.command).toContain('install test-package')
    }
  })

  it('should successfully list packages', async () => {
    const mockExec = vi.mocked(exec)
    const mockOutput = 'package1\npackage2'
    mockExec.mockImplementation((cmd: string, callback: (error: Error | null, result: { stdout: string; stderr: string }) => void) => {
      callback(null, { stdout: mockOutput, stderr: '' })
    })

    const result = await mcpmService.list()
    expect(result).toBe(mockOutput)
  })

  it('should successfully uninstall package', async () => {
    const mockExec = vi.mocked(exec)
    const mockOutput = 'Successfully uninstalled'
    mockExec.mockImplementation((cmd: string, callback: (error: Error | null, result: { stdout: string; stderr: string }) => void) => {
      callback(null, { stdout: mockOutput, stderr: '' })
    })

    const result = await mcpmService.uninstall('test-package')
    expect(result).toBe(mockOutput)
  })
})

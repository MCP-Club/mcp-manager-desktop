import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ClaudeHostService } from '../claude'

const mockFs = {
  readFile: vi.fn(),
  writeFile: vi.fn()
}

vi.mock('electron', () => ({
  app: {
    getPath: (): string => '/mock/path'
  }
}))

describe('ClaudeHostService', () => {
  let service: ClaudeHostService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new ClaudeHostService(mockFs as unknown)
  })

  describe('getClaudeConfig', () => {
    it('should return parsed config when file exists', async () => {
      const mockConfig = {
        mcpServers: {
          test: {
            name: 'Test Server',
            url: 'http://test.com',
            token: 'test-token'
          }
        }
      }
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockConfig))

      const result = await service.getClaudeConfig()
      expect(result).toEqual(mockConfig)
    })

    it('should return null when file read fails', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'))

      const result = await service.getClaudeConfig()
      expect(result).toBeNull()
    })
  })

  describe('createClaudeConfigFile', () => {
    it('should create config file with default config', async () => {
      const defaultConfig = {
        mcpServers: {}
      }

      mockFs.writeFile.mockResolvedValue(undefined)

      const result = await service.createClaudeConfigFile()

      expect(result).toEqual(defaultConfig)
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify(defaultConfig, null, 2)
      )
    })
  })

  describe('getOrCreateClaudeConfig', () => {
    it('should return existing config if available', async () => {
      const mockConfig = {
        mcpServers: {
          test: {
            name: 'Test Server',
            url: 'http://test.com',
            token: 'test-token'
          }
        }
      }
      vi.spyOn(service, 'getClaudeConfig').mockResolvedValue(mockConfig)

      const result = await service.getOrCreateClaudeConfig()
      expect(result).toEqual(mockConfig)
    })

    it('should create new config if none exists', async () => {
      const mockConfig = {
        mcpServers: {}
      }
      vi.spyOn(service, 'getClaudeConfig').mockResolvedValue(null)
      vi.spyOn(service, 'createClaudeConfigFile').mockResolvedValue(mockConfig)

      const result = await service.getOrCreateClaudeConfig()
      expect(result).toEqual(mockConfig)
    })
  })
})

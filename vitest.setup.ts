import { vi } from 'vitest'

vi.mock('@electron-toolkit/utils', () => ({
  platform: {
    isMacOS: false,
    isWindows: true,
    isLinux: false
  }
}))

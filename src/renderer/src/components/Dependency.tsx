import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IpcRendererEvent } from 'electron'
import { IPC_CHANNELS } from '@shared/constants'
import nodejsLogo from '@/assets/nodejs_logo.svg'
import uvLogo from '@/assets/uv_logo.svg'

interface Dependency {
  name: string
  isInstalled: boolean
  version: string | null
}

const DependencyIcons: Record<string, string> = {
  NPM: nodejsLogo,
  UX: uvLogo
}

export function DependencyList(): JSX.Element {
  const [dependencies, setDependencies] = useState<Dependency[]>([
    { name: 'UX', isInstalled: false, version: null },
    { name: 'NPM', isInstalled: false, version: null }
  ])

  const checkDependencies = async (): Promise<void> => {
    // 这里需要通过 electron 的 IPC 来检查依赖
    window.electron.ipcRenderer.send(IPC_CHANNELS.CHECK_DEPENDENCIES)
  }

  const installDependency = async (name: string): Promise<void> => {
    // 这里需要通过 electron 的 IPC 来安装依赖
    window.electron.ipcRenderer.send(IPC_CHANNELS.INSTALL_DEPENDENCY, name)
  }

  useEffect(() => {
    checkDependencies()

    // 监听依赖检查结果
    const handleDependencyStatus = (_event: IpcRendererEvent, data: Dependency[]): void => {
      setDependencies(data)
    }

    window.electron.ipcRenderer.on(IPC_CHANNELS.DEPENDENCY_STATUS, handleDependencyStatus)

    return (): void => {
      window.electron.ipcRenderer.removeListener(
        IPC_CHANNELS.DEPENDENCY_STATUS,
        handleDependencyStatus
      )
    }
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Core Dependencies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dependencies.map((dep) => (
          <Card key={dep.name} className="px-3 py-6">
            <CardHeader className="text-center pb-8">
              <div className="flex flex-col items-center gap-3">
                <img
                  src={DependencyIcons[dep.name]}
                  alt={`${dep.name} logo`}
                  className="w-16 h-16"
                />
                <CardTitle className="text-2xl">{dep.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  {dep.isInstalled ? (
                    <Badge variant="default" className="bg-green-500">
                      Installed
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Not Installed</Badge>
                  )}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Version</div>
                  <div className="font-medium">{dep.isInstalled ? dep.version : '-'}</div>
                </div>
              </div>
              {!dep.isInstalled && (
                <Button variant="outline" onClick={() => installDependency(dep.name)}>
                  Install
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

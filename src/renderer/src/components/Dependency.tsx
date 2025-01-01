import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IpcRendererEvent } from 'electron'
import { IPC_CHANNELS } from '@shared/constants'

interface Dependency {
  name: string
  isInstalled: boolean
  version: string | null
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {dependencies.map((dep) => (
        <Card key={dep.name}>
          <CardHeader>
            <CardTitle className="text-xl">{dep.name}</CardTitle>
            <CardDescription>
              {dep.isInstalled ? (
                <Badge variant="default" className="bg-green-500">
                  Installed - {dep.version}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Installed</Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!dep.isInstalled && (
              <Button variant="outline" onClick={() => installDependency(dep.name)}>
                Install
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

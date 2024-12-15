import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import './styles/globals.css'
import { Button } from './components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from './components/ui/card'
import { Input } from './components/ui/input'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from './components/ui/dialog'
import { MainLayout } from './components/layout/main-layout'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <MainLayout>
      <div className="mx-auto max-w-[800px]">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Electron</CardTitle>
            <CardDescription>Using shadcn/ui components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img src={electronLogo} alt="electron" className="h-32 w-32" />
            </div>
            <div className="space-y-2">
              <Input placeholder="Type something..." />
              <Versions />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>IPC Test</DialogTitle>
                  <DialogDescription>
                    Click the button below to test IPC communication
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                  <Button onClick={ipcHandle}>Test IPC</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button>Click me</Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  )
}

export default App

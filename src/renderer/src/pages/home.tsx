import { DependencyList } from '@/components/Dependency'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'

export default function HomePage(): JSX.Element {
  return (
    <div className="mx-auto max-w-[800px] p-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to MCP Manager</CardTitle>
          <CardDescription>Model Context Protocol Management Tool</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <p className="mb-4">
            Manage your Model Context Protocol configurations and deployments with ease. This tool helps you:
          </p> */}
          {/* <ul className="list-disc pl-6 space-y-2">
            <li>Configure and manage model contexts</li>
            <li>Deploy and monitor protocol implementations</li>
            <li>Manage model packages and dependencies</li>
            <li>Configure system settings and preferences</li>
          </ul> */}
        </CardContent>
      </Card>
      <DependencyList />
    </div>
  )
}

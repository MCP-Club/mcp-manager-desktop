import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'

export default function PackagesPage(): JSX.Element {
  return (
    <div className="mx-auto max-w-[800px] p-6">
      <Card>
        <CardHeader>
          <CardTitle>Protocol Implementations</CardTitle>
          <CardDescription>Manage your MCP implementations and dependencies</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Manage your protocol implementations:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Install and update protocol implementations</li>
            <li>Manage implementation versions</li>
            <li>Configure implementation settings</li>
            <li>View implementation documentation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

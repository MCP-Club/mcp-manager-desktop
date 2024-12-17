import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'

export default function HostsPage(): JSX.Element {
  return (
    <div className="mx-auto max-w-[800px] p-6">
      <Card>
        <CardHeader>
          <CardTitle>Model Contexts</CardTitle>
          <CardDescription>Manage your model contexts and configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Configure and manage your model contexts:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create and edit model contexts</li>
            <li>Configure context parameters</li>
            <li>Monitor context status</li>
            <li>View context logs and metrics</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

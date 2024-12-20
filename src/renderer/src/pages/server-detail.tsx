import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ServerRegistryItem } from '@/types/server'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RefreshCw, Calendar, Star, User, Tag, Box, Shield, Zap, Globe, Cloud, Key, Terminal } from 'lucide-react'
import { SecureImage } from '@/components/ui/secure-image'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ServerDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [server, setServer] = useState<ServerRegistryItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchServerDetail = async () => {
        if (!id) return
        try {
            setLoading(true)
            setError(null)
            const data = await window.electron.ipcRenderer.invoke('fetch-server-detail', id)
            setServer(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch server details')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchServerDetail()
    }, [id])

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />Back
                </Button>
                <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                    <div className="text-red-500 text-center">
                        <p className="text-lg font-semibold mb-2">Failed to load server details</p>
                        <p className="text-sm text-gray-500">{error}</p>
                    </div>
                    <Button onClick={fetchServerDetail} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />Try Again
                    </Button>
                </div>
            </div>
        )
    }

    if (loading || !server) {
        return (
            <div className="container mx-auto p-6">
                <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />Back
                </Button>
                <div className="space-y-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-48 w-full" />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>
        )
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button onClick={() => navigate(-1)} variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />Back
                </Button>
                <Button onClick={fetchServerDetail} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />Refresh
                </Button>
            </div>

            {/* Server Header */}
            <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 flex-shrink-0">
                    <SecureImage
                        src={server.logoUrl}
                        alt={server.title}
                        className="w-full h-full object-contain rounded-lg"
                    />
                </div>
                <div className="flex-grow">
                    <h1 className="text-3xl font-bold mb-2">{server.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {server.creator}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(server.publishDate)}
                        </div>
                        <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {server.rating} / 5
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {server.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="configuration">Configuration</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">{server.description}</p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Server Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center">
                                    <Box className="w-4 h-4 mr-2" />
                                    <span className="font-medium mr-2">Type:</span>
                                    <span>{server.type}</span>
                                </div>
                                <div className="flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    <span className="font-medium mr-2">Creator:</span>
                                    <span>{server.creator}</span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span className="font-medium mr-2">Published:</span>
                                    <span>{formatDate(server.publishDate)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Services</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                {server.features?.services?.cdn && (
                                    <div className="flex items-center">
                                        <Cloud className="w-4 h-4 mr-2 text-green-500" />
                                        <span>CDN</span>
                                    </div>
                                )}
                                {server.features?.services?.ddos && (
                                    <div className="flex items-center">
                                        <Shield className="w-4 h-4 mr-2 text-green-500" />
                                        <span>DDoS Protection</span>
                                    </div>
                                )}
                                {server.features?.services?.analytics && (
                                    <div className="flex items-center">
                                        <Zap className="w-4 h-4 mr-2 text-green-500" />
                                        <span>Analytics</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Capabilities</CardTitle>
                            <CardDescription>Available features and operations</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {server.features?.capabilities && Object.entries(server.features.capabilities).map(([category, operations]) => (
                                <div key={category} className="space-y-2">
                                    <h3 className="font-semibold capitalize flex items-center">
                                        <Globe className="w-4 h-4 mr-2" />
                                        {category}
                                    </h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                        {Array.isArray(operations) ? (
                                            operations.map((op) => (
                                                <li key={op} className="capitalize">{op}</li>
                                            ))
                                        ) : (
                                            operations && Object.entries(operations).map(([key, value]) => (
                                                <li key={key} className="capitalize">
                                                    {key}: {String(value)}
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="configuration" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Command Information</CardTitle>
                            <CardDescription>Server execution configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Command</h3>
                                <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-lg font-medium">
                                    {server.commandInfo?.command} {server.commandInfo?.args?.join(' ')}
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Environment Variables</h3>
                                    <Badge variant="outline" className="text-xs font-medium">
                                        {server.commandInfo?.env ? Object.keys(server.commandInfo.env).length : 0} Variables
                                    </Badge>
                                </div>
                                {server.commandInfo?.env && (
                                    <div className="grid gap-2">
                                        {Object.entries(server.commandInfo.env).map(([key, value]) => (
                                            <div key={key} 
                                                className="group relative rounded-xl p-4 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <div className="flex flex-col space-y-1.5">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {key}
                                                        </span>
                                                    </div>
                                                    <div className="pl-0">
                                                        <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-lg flex items-center">
                                                            {value}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Parameters</h3>
                                    <Badge variant="outline" className="text-xs font-medium">
                                        {server.parameters ? Object.keys(server.parameters).length : 0} Parameters
                                    </Badge>
                                </div>
                                {server.parameters && (
                                    <div className="grid gap-4">
                                        {Object.entries(server.parameters).map(([key, param]) => (
                                            <div key={key} 
                                                className="group relative rounded-xl p-4 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <div className="flex flex-col space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {key}
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                            <Badge variant="secondary" 
                                                                className="text-[10px] px-2 py-0.5 font-medium bg-gray-100 text-gray-600"
                                                            >
                                                                {param.type}
                                                            </Badge>
                                                            {param.required && (
                                                                <Badge variant="destructive" 
                                                                    className="text-[10px] px-2 py-0.5 font-medium"
                                                                >
                                                                    Required
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {param.description}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-xs text-gray-600 bg-gray-50 px-4 py-2.5 rounded-lg font-medium w-full">
                                                            {param.argTemplate}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

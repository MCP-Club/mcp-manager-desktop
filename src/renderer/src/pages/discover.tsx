import { useEffect, useState } from 'react'
import { ServerCard } from '@/components/ServerCard'
import { ServerRegistryItem, convertToServerCardData } from '@/types/server'
import { Input } from '@/components/ui/input'
import { Search, Filter, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function DiscoverPage() {
    const [servers, setServers] = useState<ServerRegistryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchServers()
    }, [])

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            fetchServers(searchQuery)
        }, 500)  // Debounce search requests

        return () => clearTimeout(debounceTimeout)
    }, [searchQuery])

    const fetchServers = async (query: string = '') => {
        try {
            setLoading(true)
            setError(null)
            const data = await window.electron.ipcRenderer.invoke('fetch-registry', query)
            setServers(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch servers')
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = () => {
        fetchServers(searchQuery)
    }

    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[200px] rounded-lg">
                    <Skeleton className="w-full h-full" />
                </div>
            ))}
        </div>
    )

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="text-red-500 text-center">
                    <p className="text-lg font-semibold mb-2">Failed to load servers</p>
                    <p className="text-sm text-gray-500">{error}</p>
                </div>
                <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Discover Servers</h1>
                    <Button onClick={handleRefresh} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                    Browse and discover available server configurations
                </p>
            </div>

            {/* Search and Filter Section */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                        placeholder="Search servers by name, description, or tags..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </Button>
            </div>

            {/* Results Section */}
            <div className="min-h-[400px]">
                {loading ? (
                    <LoadingSkeleton />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {servers.length > 0 ? (
                            servers.map((server) => (
                                <ServerCard key={server.id} {...convertToServerCardData(server)} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <p className="text-gray-500">No servers found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

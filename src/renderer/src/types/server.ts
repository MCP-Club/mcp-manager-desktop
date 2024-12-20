export interface ServerParameter {
    type: string
    required: boolean
    description: string
    argTemplate: string
}

export interface ServerCommand {
    command: string
    args: string[]
    env: Record<string, string>
}

export interface ServerFeatures {
    capabilities: Record<string, string[]>
    services: Record<string, boolean>
}

export interface ServerRegistryItem {
    id: string
    name: string
    title: string
    description: string
    tags: string[]
    creator: string
    logoUrl: string
    publishDate: string
    rating: number
    type: string
    commandInfo: ServerCommand
    parameters: Record<string, ServerParameter>
    features: ServerFeatures
}

export function convertToServerCardData(registryItem: ServerRegistryItem) {
    return {
        id: registryItem.id,
        title: registryItem.title,
        description: registryItem.description,
        creator: registryItem.creator,
        logoUrl: registryItem.logoUrl,
        publishDate: registryItem.publishDate,
        rating: registryItem.rating,
        tags: registryItem.tags,
        isInstalled: false, // 这个值需要从本地存储或状态管理中获取
        env: registryItem.commandInfo.env,
        guide: '' // 如果有guide内容，可以从其他地方获取
    }
}

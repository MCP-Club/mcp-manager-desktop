import { Tag } from "@/components/Tag"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Download, Loader2, Settings, Star, Trash } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { SecureImage } from "@/components/ui/secure-image"

export type InstallStatus = 'install' | 'installing' | 'installed'

export interface ServerCardData {
    id: string
    title: string
    description: string
    creator: string
    logoUrl: string
    publishDate: string
    rating: number
    tags: string[]
    isInstalled: boolean
    env: Record<string, string>
    guide: string
}

type ServerCardProps = ServerCardData

export function ServerCard({
    id,
    title,
    description,
    creator,
    logoUrl,
    publishDate,
    rating = 0,
    tags = [],
    isInstalled = false,
    env = {},
    guide = ''
}: ServerCardProps) {
    const navigate = useNavigate();
    const [installStatus, setInstallStatus] = useState<InstallStatus>(isInstalled ? 'installed' : 'install');
    const [buttonHovered, setButtonHovered] = useState(false);

    const handleCardClick = () => {
        navigate(`/discover/${id}`);
    };

    const getButtonContent = () => {
        switch (installStatus) {
            case 'install':
                return (
                    <>
                        <Download className="mr-2 h-4 w-4" />
                        Install
                    </>
                )
            case 'installing':
                return (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Installing...
                    </>
                )
            case 'installed':
                return buttonHovered ? (
                    <>
                        <Trash className="mr-2 h-4 w-4" />
                        Uninstall
                    </>
                ) : (
                    <>
                        <Check className="mr-2 h-4 w-4" />
                        Installed
                    </>
                )
            default:
                return 'Install'
        }
    }

    return (
        <Card
            className="w-full max-w-sm h-[200px] overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-200"
            onClick={handleCardClick}
        >
            <CardContent className="p-4 h-full flex flex-col">
                <div 
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage asChild>
                            <SecureImage
                                src={logoUrl}
                                alt={title}
                                onError={(error) => console.error('Failed to load server logo:', error)}
                            />
                        </AvatarImage>
                        <AvatarFallback>{title[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate">{title}</h3>
                        <p className="text-xs text-gray-500 truncate">by {creator}</p>
                    </div>
                    <Button
                        variant={installStatus === 'installed' ? 'outline' : 'default'}
                        size="sm"
                        className="ml-auto"
                        onClick={(e) => {
                            e.stopPropagation()
                            setInstallStatus(installStatus === 'install' ? 'installing' : 'install')
                        }}
                        onMouseEnter={() => setButtonHovered(true)}
                        onMouseLeave={() => setButtonHovered(false)}
                    >
                        {getButtonContent()}
                    </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-auto line-clamp-2 hover:line-clamp-none transition-all duration-200">{description}</p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex-1 min-w-0 mr-2">
                        <div className="flex flex-wrap gap-1.5 max-h-[28px] overflow-hidden">
                            {tags.map((tag, index) => (
                                <Tag key={index} name={tag} />
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
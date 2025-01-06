/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tag } from '@/components/Tag'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, Download, Loader2, Trash } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSecureImage } from '@/hooks/useSecureImage'
import { RegistryMCPServerItem } from '@shared/types'

export type InstallStatus = 'install' | 'installing' | 'installed'

export interface MCPServerCardData {
  registryInfo: RegistryMCPServerItem;
  isInstalled: boolean;
}

export const ServerCard: React.FC<MCPServerCardData> = ({
  registryInfo, 
  isInstalled,
}) => {
  const {
    id,
    title,
    description,
    tags,
    creator,
    logoUrl,
  } = registryInfo

  const navigate = useNavigate()
  const [installStatus, setInstallStatus] = useState<InstallStatus>(
    isInstalled ? 'installed' : 'install'
  )
  const [buttonHovered, setButtonHovered] = useState(false)
  const onError = useCallback((error: Error) => {
    console.error('Failed to load server logo:', error)
  }, [])
  const { imageSrc } = useSecureImage(logoUrl!, {
    onError
  })

  const handleCardClick = () => {
    navigate(`/discover/${id}`)
  }

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
      className="w-full h-[280px] overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg"
      onClick={handleCardClick}
    >
      <CardContent className="p-4 h-full flex flex-col">
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={imageSrc} />
            <AvatarFallback>{title[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate">{title}</h3>
            <p className="text-xs text-gray-500 truncate">by {creator}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-auto line-clamp-4 transition-all duration-200">
          {description}
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 max-h-[28px] overflow-hidden">
                {tags.map((tag, index) => (
                  <Tag key={index} name={tag} />
                ))}
              </div>
            </div>
          </div>
          <Button
            variant={installStatus === 'installed' ? 'outline' : 'default'}
            size="sm"
            className="w-full"
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
      </CardContent>
    </Card>
  )
}

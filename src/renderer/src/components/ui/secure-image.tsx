import { useEffect, useState } from 'react'

interface SecureImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'src'> {
  src: string
  fallback?: string
  onError?: (error: Error) => void
  onLoad?: () => void
}

export function SecureImage({ 
  src, 
  fallback, 
  onError,
  onLoad,
  ...props 
}: SecureImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallback || '')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadImage = async () => {
      if (!src) {
        setLoading(false)
        return
      }

      try {
        console.log('Requesting image:', src)
        setLoading(true)
        setError(null)

        const base64Image = await window.electron.ipcRenderer.invoke('fetch-image', src)
        console.log('Received base64 image')
        
        setImageSrc(base64Image)
        setLoading(false)
        onLoad?.()
      } catch (err) {
        console.error('Error loading image:', err)
        const error = err instanceof Error ? err : new Error('Failed to load image')
        setError(error)
        setLoading(false)
        if (fallback) {
          setImageSrc(fallback)
        }
        onError?.(error)
      }
    }

    loadImage()
  }, [src, fallback, onError, onLoad])

  if (loading) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700" {...props} />
  }

  if (error && !fallback) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400" 
        {...props}
      >
        !
      </div>
    )
  }

  return <img src={imageSrc} {...props} />
}

import { IPC_CHANNELS } from '@shared/constants'
import { useEffect, useState } from 'react'
import Debug from 'debug'

const debug = Debug('app::renderer::useSecureImage')

interface UseSecureImageOptions {
  onError?: (error: Error) => void
  onLoad?: (base64Url: string) => void
}

export function useSecureImage(src: string | undefined, options?: UseSecureImageOptions) {
  const [imageSrc, setImageSrc] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    const loadImage = async () => {
      if (!src) {
        setLoading(false)
        return
      }

      try {
        debug('Requesting image:', src)
        setLoading(true)
        setError(null)

        const base64Image = await window.electron.ipcRenderer.invoke(IPC_CHANNELS.FETCH_IMAGE, src)
        debug('Received base64 image')
        
        if (mounted) {
          setImageSrc(base64Image)
          setLoading(false)
          options?.onLoad?.(base64Image)
        }
      } catch (err) {
        console.error('Error loading image:', err)
        if (!mounted) return
        
        const error = err instanceof Error ? err : new Error('Failed to load image')
        setError(error)
        setLoading(false)
        options?.onError?.(error)
      }
    }

    loadImage()

    return () => {
      mounted = false
    }
  }, [src, options?.onError, options?.onLoad])

  return {
    imageSrc,
    loading,
    error,
    isError: !!error
  }
}

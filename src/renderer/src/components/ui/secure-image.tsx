import { useSecureImage } from '@/hooks/useSecureImage'

interface SecureImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'src'> {
  src: string
  fallback?: string
  onError?: (error: Error) => void
  alt?: string
}

export const SecureImage: React.FC<SecureImageProps> = ({ 
  src, 
  fallback, 
  onError,
  alt,
  ...props 
}) => {
  const { imageSrc, loading, error } = useSecureImage(src, { onError })

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700" style={{ width: props.width || '100%', height: props.height || '100%' }} />
    )
  }

  if (error && fallback) {
    return <img src={fallback} alt={alt} {...props} />
  }

  if (!imageSrc) {
    return null
  }

  return <img src={imageSrc} alt={alt} {...props} />
}

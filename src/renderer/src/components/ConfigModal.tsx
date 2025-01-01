import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

interface ConfigModalProps {
  isOpen: boolean
  onClose: () => void
  env: Record<string, string>
  guide: string
  onSave: (config: Record<string, string>) => void
}

export function ConfigModal({ isOpen, onClose, env = {}, guide = '', onSave }: ConfigModalProps) {
  const [config, setConfig] = useState<Record<string, string>>(env)

  useEffect(() => {
    setConfig(env)
  }, [env])

  const handleInputChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave(config)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <DialogHeader className="p-6 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold">Configuration</DialogTitle>
          </div>
          {guide && (
            <div className="bg-muted/50 rounded-lg p-4 prose dark:prose-invert max-w-none">
              <ReactMarkdown>{guide}</ReactMarkdown>
            </div>
          )}
        </DialogHeader>
        <div className="px-6 py-4 border-y">
          <div className="space-y-4">
            {Object.entries(env).map(([key, defaultValue]) => (
              <div key={key} className="flex flex-col space-y-2">
                <Label htmlFor={key} className="font-medium">
                  {key}
                </Label>
                <Input
                  id={key}
                  placeholder={`Enter your ${key.toLowerCase()}`}
                  value={config[key] || defaultValue}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="p-6 pt-4">
          <Button type="submit" onClick={handleSave} className="w-full sm:w-auto">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

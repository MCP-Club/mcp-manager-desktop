import React from 'react'
import { Menu, Home, Settings, Package } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const menuItems = [
  {
    title: 'Home',
    icon: Home,
    href: '/'
  },
  {
    title: 'Packages',
    icon: Package,
    href: '/packages'
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings'
  }
]

export function MainLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <Sidebar className="hidden lg:block" />

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed left-4 top-4">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  )
}

function Sidebar({ className }: SidebarProps): JSX.Element {
  return (
    <div className={cn('w-64 min-h-screen border-r bg-background', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">MCP Manager</h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  // Handle navigation here
                  console.log('Navigate to:', item.href)
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

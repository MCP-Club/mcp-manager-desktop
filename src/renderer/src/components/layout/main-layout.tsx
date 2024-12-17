import React from 'react'
import { Menu, Home, Settings, Package, Server } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const menuItems = [
  {
    title: 'Home',
    icon: Home,
    href: '/'
  },
  {
    title: 'Contexts',
    icon: Server,
    href: '/hosts'
  },
  {
    title: 'Protocols',
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
    <div className="flex min-h-screen bg-background w-[100vw]">
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
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">{children}</main>
    </div>
  )
}

function Sidebar({ className }: SidebarProps): JSX.Element {
  const location = useLocation()
  
  return (
    <div className={cn('pb-12 w-60 border-r bg-background', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Model Context Protocol</h2>
          <p className="mb-4 px-4 text-sm text-muted-foreground">MCP Manager</p>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

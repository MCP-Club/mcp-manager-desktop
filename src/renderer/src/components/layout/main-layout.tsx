import React from 'react'
import { Menu, Home, Settings, Search,  Server } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Link, useLocation } from 'react-router-dom'
import electronLogo from '../../assets/electron.svg'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const menuItems = [
  {
    title: 'Welcome',
    icon: Home,
    href: '/'
  },
  {
    title: 'Discover',
    icon: Search,
    href: '/discover'
  },
  {
    title: 'My Servers',
    icon: Server,
    href: '/hosts'
  },
  // {
  //   title: 'Chat',
  //   icon: MessageSquare,
  //   href: '/chat'
  // },
  // {
  //   title: 'Settings',
  //   icon: Settings,
  //   href: '/settings'
  // }
]

export function MainLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0">
        <Sidebar className="w-[240px]" />
      </div>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed left-4 top-4 z-20">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 lg:pl-[240px]">
        <main className="h-screen overflow-y-auto pt-16 lg:pt-4 px-4">
          {children}
        </main>
      </div>
    </div>
  )
}

function Sidebar({ className }: SidebarProps): JSX.Element {
  const location = useLocation()
  
  return (
    <div className={cn('h-full flex flex-col border-r bg-background', className)}>
      <div className="flex-1 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-4 mb-2">
            <img src={electronLogo} className="w-6 h-6" alt="logo" />
            <h2 className="text-lg font-semibold">MCPHub</h2>
          </div>
          <nav className="space-y-1">
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
          </nav>
        </div>
      </div>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Calendar, 
  Home, 
  MessageCircle, 
  Settings, 
  TrendingUp,
  Facebook,
  Instagram
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Content Manager", href: "/content", icon: Calendar },
  { name: "Performance", href: "/performance", icon: TrendingUp },
  { name: "WhatsApp", href: "/whatsapp", icon: MessageCircle },
  { name: "Settings", href: "/settings", icon: Settings },
]

const platforms = [
  { name: "Facebook", href: "/platform/facebook", icon: Facebook },
  { name: "Instagram", href: "/platform/instagram", icon: Instagram },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Social Analytics
            </h2>
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Platforms
          </h2>
          <div className="space-y-1">
            {platforms.map((platform) => (
              <Button
                key={platform.name}
                variant={pathname === platform.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={platform.href}>
                  <platform.icon className="mr-2 h-4 w-4" />
                  {platform.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
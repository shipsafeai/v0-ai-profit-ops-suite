"use client"

import { useStore } from "@/lib/store"
import { 
  Bell, 
  Search, 
  Plus,
  MessageSquare,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function Header() {
  const { 
    sidebarOpen, 
    activeView, 
    setActiveView,
    setShowNewEmpireModal, 
    setShowNewProjectModal,
    activeEmpire 
  } = useStore()

  const getTitle = () => {
    switch (activeView) {
      case "dashboard": return "Command Centre"
      case "empires": return "Empire Management"
      case "projects": return "Project Operations"
      case "agents": return "AI Workforce"
      case "browser": return "Browser Automation"
      case "console": return "AI Console"
      case "settings": return "Settings"
      default: return "AI Profit Ops"
    }
  }

  const getSubtitle = () => {
    switch (activeView) {
      case "dashboard": return "Overview of all operations and metrics"
      case "empires": return "Manage your containerized empires"
      case "projects": return "Track and launch autonomous projects"
      case "agents": return "Monitor your AI agent hierarchy"
      case "browser": return "Real-time Playwright browser sessions"
      case "console": return "Talk to your AI workforce and take real action"
      case "settings": return "Configure system preferences"
      default: return ""
    }
  }

  return (
    <header className={cn(
      "fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 transition-all duration-300",
      sidebarOpen ? "left-64" : "left-20"
    )}>
      <div>
        <h1 className="text-lg font-semibold text-foreground">{getTitle()}</h1>
        <p className="text-sm text-muted-foreground">{getSubtitle()}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search empires, projects, agents..." 
            className="w-64 pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {activeView === "empires" && (
            <Button 
              onClick={() => setShowNewEmpireModal(true)}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md shadow-primary/25"
            >
              <Plus className="h-4 w-4" />
              New Empire
            </Button>
          )}
          
          {activeView === "projects" && activeEmpire && (
            <Button 
              onClick={() => setShowNewProjectModal(true)}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md shadow-primary/25"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          )}

          {activeView === "dashboard" && (
            <Button 
              onClick={() => setShowNewEmpireModal(true)}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md shadow-primary/25"
            >
              <Plus className="h-4 w-4" />
              New Empire
            </Button>
          )}
        </div>

        {/* Chat with Kassandra */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setActiveView("console")}
          aria-label="Open AI Console"
          className="relative border-primary/20 hover:bg-primary/5 hover:border-primary/40"
        >
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
        </Button>

        {/* Notifications */}
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            3
          </span>
        </Button>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5">
          <Zap className="h-3.5 w-3.5 text-success" />
          <span className="text-xs font-medium text-success">All Systems Online</span>
        </div>
      </div>
    </header>
  )
}

"use client"

import { useStore, type Agent } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { 
  X, 
  Globe, 
  Activity, 
  Settings, 
  MoreHorizontal,
  Crown,
  Building2,
  FolderKanban,
  Wrench,
  Play,
  Pause,
  MessageSquare,
  Zap,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

export function AgentDetailModal() {
  const { showAgentDetailModal, setShowAgentDetailModal, selectedAgent, browserSessions, setActiveView } = useStore()

  if (!showAgentDetailModal || !selectedAgent) return null

  const agentSessions = browserSessions.filter(s => s.agentId === selectedAgent.id)
  const activeSessions = agentSessions.filter(s => s.status === "active")

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ceo": return Crown
      case "empire-manager": return Building2
      case "project-manager": return FolderKanban
      case "worker": return Wrench
      default: return Wrench
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ceo": return "from-primary to-accent"
      case "empire-manager": return "from-accent/80 to-accent"
      case "project-manager": return "from-info/80 to-info"
      case "worker": return "from-warning/80 to-warning"
      default: return "from-muted to-muted"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success"
      case "working": return "bg-info text-info"
      case "idle": return "bg-warning text-warning"
      case "offline": return "bg-muted-foreground text-muted-foreground"
      default: return "bg-muted-foreground text-muted-foreground"
    }
  }

  const RoleIcon = getRoleIcon(selectedAgent.role)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowAgentDetailModal(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-card border border-border/50 shadow-2xl">
        {/* Header */}
        <div className={cn(
          "relative px-6 py-8 bg-gradient-to-br text-white",
          getRoleColor(selectedAgent.role)
        )}>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowAgentDetailModal(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold">
                {selectedAgent.name[0]}
              </div>
              <span className={cn(
                "absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-card",
                selectedAgent.status === "active" && "bg-success",
                selectedAgent.status === "working" && "bg-info animate-pulse",
                selectedAgent.status === "idle" && "bg-warning",
                selectedAgent.status === "offline" && "bg-muted-foreground"
              )} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{selectedAgent.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <RoleIcon className="h-4 w-4" />
                <span className="capitalize">{selectedAgent.role.replace("-", " ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 py-4 space-y-5">
          {/* Status & Performance */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <div className={cn(
                "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium capitalize mb-2",
                getStatusColor(selectedAgent.status),
                selectedAgent.status === "active" && "bg-success/20",
                selectedAgent.status === "working" && "bg-info/20",
                selectedAgent.status === "idle" && "bg-warning/20"
              )}>
                {selectedAgent.status}
              </div>
              <p className="text-xs text-muted-foreground">Status</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{selectedAgent.performance}%</p>
              <p className="text-xs text-muted-foreground">Performance</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{selectedAgent.browserSessions}</p>
              <p className="text-xs text-muted-foreground">Browser Sessions</p>
            </div>
          </div>

          {/* Current Task */}
          {selectedAgent.currentTask && (
            <div className="rounded-xl border border-info/30 bg-info/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-info" />
                <span className="text-sm font-medium text-foreground">Current Task</span>
              </div>
              <p className="text-sm text-muted-foreground">{selectedAgent.currentTask}</p>
              <div className="mt-3">
                <Progress value={65} className="h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">65% complete</p>
              </div>
            </div>
          )}

          {/* Capabilities */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {selectedAgent.capabilities.map((cap) => (
                <span 
                  key={cap}
                  className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Active Browser Sessions */}
          {activeSessions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-success" />
                <h3 className="text-sm font-semibold text-foreground">Active Browser Sessions</h3>
                <span className="relative flex h-2 w-2 ml-auto">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
              </div>
              <div className="space-y-2">
                {activeSessions.map((session) => (
                  <div key={session.id} className="rounded-lg border border-success/30 bg-success/5 p-3">
                    <p className="text-sm font-medium text-foreground">{session.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.url}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Started {Math.floor((Date.now() - session.startedAt.getTime()) / 60000)}m ago
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setShowAgentDetailModal(false)
                setActiveView("console")
              }}
            >
              <MessageSquare className="h-4 w-4" />
              Send Message
            </Button>
            <Button variant="outline" className="gap-2">
              <Globe className="h-4 w-4" />
              New Browser Task
            </Button>
            {selectedAgent.status === "working" && (
              <Button variant="outline" className="gap-2 border-warning/30 text-warning hover:bg-warning/10">
                <Pause className="h-4 w-4" />
                Pause Agent
              </Button>
            )}
            {selectedAgent.status === "idle" && (
              <Button variant="outline" className="gap-2 border-success/30 text-success hover:bg-success/10">
                <Play className="h-4 w-4" />
                Activate Agent
              </Button>
            )}
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Configure
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 px-6 py-4 bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Agent ID: {selectedAgent.id}</span>
            <span>Uptime: 99.8%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

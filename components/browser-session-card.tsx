"use client"

import { type BrowserSession, useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Globe, ExternalLink, Play, Pause, Square, Eye, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BrowserSessionCardProps {
  session: BrowserSession
  compact?: boolean
}

export function BrowserSessionCard({ session, compact = false }: BrowserSessionCardProps) {
  const { availableAgents, ceoAgent } = useStore()
  const agent = session.agentId === ceoAgent.id 
    ? ceoAgent 
    : availableAgents.find(a => a.id === session.agentId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success"
      case "completed": return "bg-muted-foreground text-muted-foreground"
      case "error": return "bg-destructive text-destructive"
      default: return "bg-muted-foreground text-muted-foreground"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "active": return "bg-success/10 border-success/30"
      case "completed": return "bg-muted/50 border-muted"
      case "error": return "bg-destructive/10 border-destructive/30"
      default: return "bg-muted/50 border-muted"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)
    if (diff < 1) return "Just now"
    if (diff < 60) return `${diff}m ago`
    return `${Math.floor(diff / 60)}h ${diff % 60}m ago`
  }

  if (compact) {
    return (
      <div className={cn(
        "rounded-lg border p-3 transition-all hover:shadow-sm",
        getStatusBg(session.status)
      )}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                {agent?.name[0] || "?"}
              </div>
              <span className={cn(
                "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background",
                session.status === "active" ? "bg-success animate-pulse" : "bg-muted-foreground"
              )} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{session.action}</p>
              <p className="text-xs text-muted-foreground truncate">{agent?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {session.status === "active" && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all hover:shadow-md",
      getStatusBg(session.status)
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-semibold">
              {agent?.name[0] || "?"}
            </div>
            <span className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
              session.status === "active" ? "bg-success animate-pulse" : "bg-muted-foreground"
            )} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground">{agent?.name || "Unknown Agent"}</p>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                getStatusColor(session.status),
                session.status === "active" && "bg-success/20",
                session.status === "error" && "bg-destructive/20",
                session.status === "completed" && "bg-muted"
              )}>
                {session.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{session.action}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {session.status === "active" && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-warning hover:text-warning/80 hover:bg-warning/10">
                <Pause className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10">
                <Square className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* URL Bar */}
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-background/50 border border-border/50 px-3 py-2">
        <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm text-muted-foreground truncate flex-1">{session.url}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Browser Preview Placeholder */}
      <div className="mt-3 aspect-video rounded-lg bg-gradient-to-br from-muted/50 to-muted border border-border/50 flex items-center justify-center">
        <div className="text-center">
          <Globe className="h-8 w-8 text-muted-foreground/50 mx-auto" />
          <p className="text-xs text-muted-foreground mt-1">Live browser preview</p>
        </div>
      </div>

      {/* Logs */}
      <div className="mt-3">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Activity Log</span>
        </div>
        <div className="rounded-lg bg-background/50 border border-border/50 p-2 max-h-24 overflow-y-auto">
          {session.logs.map((log, i) => (
            <p key={i} className="text-xs text-muted-foreground font-mono">
              <span className="text-primary/60">[{formatTime(session.startedAt)}]</span> {log}
            </p>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Started {formatTime(session.startedAt)}</span>
        <span>Session ID: {session.id}</span>
      </div>
    </div>
  )
}

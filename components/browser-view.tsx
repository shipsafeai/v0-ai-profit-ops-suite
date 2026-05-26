"use client"

import { useStore } from "@/lib/store"
import { BrowserSessionCard } from "./browser-session-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Plus, RefreshCw, Filter, Grid, List } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function BrowserView() {
  const { browserSessions, availableAgents, ceoAgent } = useStore()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "error">("all")

  const filteredSessions = browserSessions.filter(s => {
    if (filter === "all") return true
    return s.status === filter
  })

  const activeSessions = browserSessions.filter(s => s.status === "active").length
  const completedSessions = browserSessions.filter(s => s.status === "completed").length
  const errorSessions = browserSessions.filter(s => s.status === "error").length

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{browserSessions.length}</p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </div>
              <Globe className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">{activeSessions}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <div className="relative">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{completedSessions}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-destructive">{errorSessions}</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
            className={filter === "active" ? "" : "border-success/30 text-success hover:bg-success/10"}
          >
            Active ({activeSessions})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed ({completedSessions})
          </Button>
          <Button
            variant={filter === "error" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("error")}
            className={filter === "error" ? "" : "border-destructive/30 text-destructive hover:bg-destructive/10"}
          >
            Errors ({errorSessions})
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <div className="flex rounded-lg border border-border/50 p-0.5">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button className="gap-2 bg-gradient-to-r from-primary to-accent text-white">
            <Plus className="h-4 w-4" />
            New Session
          </Button>
        </div>
      </div>

      {/* Sessions Grid/List */}
      <div className={cn(
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "space-y-4"
      )}>
        {filteredSessions.map(session => (
          <BrowserSessionCard key={session.id} session={session} />
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No browser sessions</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === "all" 
                ? "No browser sessions have been created yet" 
                : `No ${filter} sessions found`}
            </p>
            <Button className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Create Browser Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Playwright Capabilities Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Playwright Browser Automation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Each agent has full browser automation capabilities powered by Playwright, enabling them to:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "Navigate & interact with any website",
              "Fill forms & submit data",
              "Handle authentication flows",
              "Take screenshots & recordings",
              "Extract data & scrape content",
              "Execute JavaScript in browser",
              "Handle popups & dialogs",
              "Multi-tab orchestration"
            ].map((capability, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {capability}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

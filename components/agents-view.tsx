"use client"

import { useStore, type Agent } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Bot, 
  Activity, 
  Globe, 
  Settings, 
  MoreHorizontal,
  Filter,
  Search,
  Plus,
  Crown,
  Building2,
  FolderKanban,
  Wrench
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function AgentsView() {
  const { ceoAgent, availableAgents, setSelectedAgent, setShowAgentDetailModal } = useStore()
  const [filter, setFilter] = useState<"all" | "ceo" | "empire-manager" | "project-manager" | "worker">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const allAgents = [ceoAgent, ...availableAgents]
  
  const filteredAgents = allAgents.filter(agent => {
    const matchesFilter = filter === "all" || agent.role === filter
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ceo": return Crown
      case "empire-manager": return Building2
      case "project-manager": return FolderKanban
      case "worker": return Wrench
      default: return Bot
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ceo": return "from-primary to-accent text-white"
      case "empire-manager": return "from-accent/80 to-accent text-white"
      case "project-manager": return "from-info/80 to-info text-white"
      case "worker": return "from-warning/80 to-warning text-white"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ceo": return "bg-primary/20 text-primary border-primary/30"
      case "empire-manager": return "bg-accent/20 text-accent border-accent/30"
      case "project-manager": return "bg-info/20 text-info border-info/30"
      case "worker": return "bg-warning/20 text-warning border-warning/30"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success"
      case "working": return "bg-info animate-pulse"
      case "idle": return "bg-warning"
      case "offline": return "bg-muted-foreground"
      default: return "bg-muted-foreground"
    }
  }

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent)
    setShowAgentDetailModal(true)
  }

  const stats = [
    { label: "Total Agents", value: allAgents.length, icon: Bot },
    { label: "Active", value: allAgents.filter(a => a.status === "active" || a.status === "working").length, icon: Activity },
    { label: "Browser Sessions", value: allAgents.reduce((acc, a) => acc + a.browserSessions, 0), icon: Globe },
    { label: "Avg Performance", value: `${Math.round(allAgents.reduce((acc, a) => acc + a.performance, 0) / allAgents.length)}%`, icon: Activity }
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <Icon className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({allAgents.length})
          </Button>
          <Button
            variant={filter === "ceo" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("ceo")}
            className={filter !== "ceo" ? getRoleBadgeColor("ceo") : ""}
          >
            <Crown className="h-3.5 w-3.5 mr-1" />
            CEO (1)
          </Button>
          <Button
            variant={filter === "empire-manager" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("empire-manager")}
            className={filter !== "empire-manager" ? getRoleBadgeColor("empire-manager") : ""}
          >
            <Building2 className="h-3.5 w-3.5 mr-1" />
            Empire ({availableAgents.filter(a => a.role === "empire-manager").length})
          </Button>
          <Button
            variant={filter === "project-manager" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("project-manager")}
            className={filter !== "project-manager" ? getRoleBadgeColor("project-manager") : ""}
          >
            <FolderKanban className="h-3.5 w-3.5 mr-1" />
            Project ({availableAgents.filter(a => a.role === "project-manager").length})
          </Button>
          <Button
            variant={filter === "worker" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("worker")}
            className={filter !== "worker" ? getRoleBadgeColor("worker") : ""}
          >
            <Wrench className="h-3.5 w-3.5 mr-1" />
            Workers ({availableAgents.filter(a => a.role === "worker").length})
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search agents..." 
              className="w-48 pl-9 bg-muted/50 border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="gap-2 bg-gradient-to-r from-primary to-accent text-white">
            <Plus className="h-4 w-4" />
            Add Agent
          </Button>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAgents.map((agent) => {
          const RoleIcon = getRoleIcon(agent.role)
          return (
            <Card 
              key={agent.id} 
              className={cn(
                "border-border/50 bg-card/50 hover:shadow-lg transition-all cursor-pointer group",
                agent.role === "ceo" && "border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5"
              )}
              onClick={() => handleAgentClick(agent)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br font-bold text-lg",
                        getRoleColor(agent.role)
                      )}>
                        {agent.name[0]}
                      </div>
                      <span className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                        getStatusColor(agent.status)
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{agent.name}</h3>
                      <div className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize",
                        getRoleBadgeColor(agent.role)
                      )}>
                        <RoleIcon className="h-3 w-3" />
                        {agent.role.replace("-", " ")}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {agent.currentTask && (
                  <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2">
                    <p className="text-xs text-muted-foreground">Current Task</p>
                    <p className="text-sm font-medium text-foreground truncate">{agent.currentTask}</p>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 3).map((cap) => (
                    <span key={cap} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {cap}
                    </span>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      +{agent.capabilities.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" />
                      {agent.browserSessions}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Activity className="h-3.5 w-3.5" />
                      {agent.performance}%
                    </div>
                  </div>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                    agent.status === "active" && "bg-success/20 text-success",
                    agent.status === "working" && "bg-info/20 text-info",
                    agent.status === "idle" && "bg-warning/20 text-warning",
                    agent.status === "offline" && "bg-muted text-muted-foreground"
                  )}>
                    {agent.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

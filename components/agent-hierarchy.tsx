"use client"

import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Activity, ChevronDown, ChevronRight, Globe } from "lucide-react"
import { useState } from "react"

export function AgentHierarchy() {
  const { ceoAgent, availableAgents, setSelectedAgent, setShowAgentDetailModal } = useStore()
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["ceo", "empire"]))

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  const empireManagers = availableAgents.filter(a => a.role === "empire-manager")
  const projectManagers = availableAgents.filter(a => a.role === "project-manager")
  const workers = availableAgents.filter(a => a.role === "worker")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success"
      case "working": return "bg-info animate-pulse"
      case "idle": return "bg-warning"
      case "offline": return "bg-muted-foreground"
      default: return "bg-muted-foreground"
    }
  }

  const handleAgentClick = (agent: typeof ceoAgent) => {
    setSelectedAgent(agent)
    setShowAgentDetailModal(true)
  }

  return (
    <div className="space-y-1">
      {/* CEO Level */}
      <div 
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-3 border border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
        onClick={() => handleAgentClick(ceoAgent)}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); toggleNode("ceo") }}
          className="flex h-5 w-5 items-center justify-center rounded hover:bg-primary/20"
        >
          {expandedNodes.has("ceo") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold">
            K
          </div>
          <span className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background", getStatusColor(ceoAgent.status))} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{ceoAgent.name}</span>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">CEO Clone</span>
          </div>
          <p className="text-xs text-muted-foreground">Strategic oversight and direct communication</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            {ceoAgent.browserSessions}
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-3.5 w-3.5 text-success" />
            {ceoAgent.performance}%
          </div>
        </div>
      </div>

      {/* Empire Managers */}
      {expandedNodes.has("ceo") && (
        <div className="ml-6 space-y-1 border-l-2 border-border/50 pl-4">
          <button 
            onClick={() => toggleNode("empire")}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            {expandedNodes.has("empire") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="font-medium">Empire Managers ({empireManagers.length})</span>
          </button>

          {expandedNodes.has("empire") && (
            <div className="space-y-1">
              {empireManagers.map((agent) => (
                <div 
                  key={agent.id}
                  className="flex items-center gap-2 rounded-lg bg-muted/30 p-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleAgentClick(agent)}
                >
                  <div className="relative">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold text-sm">
                      {agent.name[0]}
                    </div>
                    <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background", getStatusColor(agent.status))} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{agent.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{agent.currentTask || "Available"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    {agent.browserSessions}
                  </div>
                </div>
              ))}

              {/* Project Managers under Empire */}
              <button 
                onClick={() => toggleNode("project")}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 transition-colors ml-4"
              >
                {expandedNodes.has("project") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="font-medium">Project Managers ({projectManagers.length})</span>
              </button>

              {expandedNodes.has("project") && (
                <div className="ml-4 space-y-1 border-l-2 border-border/30 pl-4">
                  {projectManagers.map((agent) => (
                    <div 
                      key={agent.id}
                      className="flex items-center gap-2 rounded-lg bg-muted/20 p-2 cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => handleAgentClick(agent)}
                    >
                      <div className="relative">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-info/20 text-info font-semibold text-xs">
                          {agent.name[0]}
                        </div>
                        <span className={cn("absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-background", getStatusColor(agent.status))} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{agent.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{agent.currentTask || "Available"}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        {agent.browserSessions}
                      </div>
                    </div>
                  ))}

                  {/* Workers under Project Managers */}
                  <button 
                    onClick={() => toggleNode("workers")}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 transition-colors ml-4"
                  >
                    {expandedNodes.has("workers") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <span className="font-medium">Workers ({workers.length})</span>
                  </button>

                  {expandedNodes.has("workers") && (
                    <div className="ml-4 grid grid-cols-2 gap-1.5 border-l-2 border-border/20 pl-4">
                      {workers.map((agent) => (
                        <div 
                          key={agent.id}
                          className="flex items-center gap-2 rounded-lg bg-muted/10 p-2 cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => handleAgentClick(agent)}
                        >
                          <div className="relative">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/20 text-warning font-semibold text-[10px]">
                              {agent.name[0]}
                            </div>
                            <span className={cn("absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border border-background", getStatusColor(agent.status))} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{agent.name}</p>
                          </div>
                          <Globe className="h-3 w-3 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

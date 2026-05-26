"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Building2, 
  Plus, 
  Settings, 
  MoreHorizontal,
  Activity,
  Globe,
  FolderKanban,
  Bot,
  DollarSign,
  TrendingUp,
  FileText,
  ChevronRight,
  Play,
  Pause
} from "lucide-react"

export function EmpiresView() {
  const { empires, activeEmpire, setActiveEmpire, setShowNewEmpireModal, setShowNewProjectModal, setActiveView } = useStore()

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Your Empires</h2>
          <p className="text-sm text-muted-foreground">Manage containerized business empires</p>
        </div>
        <Button 
          onClick={() => setShowNewEmpireModal(true)}
          className="gap-2 bg-gradient-to-r from-primary to-accent text-white"
        >
          <Plus className="h-4 w-4" />
          New Empire
        </Button>
      </div>

      {/* Empires List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {empires.map((empire) => (
          <Card 
            key={empire.id} 
            className={cn(
              "border-border/50 bg-card/50 hover:shadow-lg transition-all cursor-pointer group",
              activeEmpire?.id === empire.id && "border-primary/50 ring-2 ring-primary/20"
            )}
            onClick={() => setActiveEmpire(empire)}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{empire.name}</h3>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                        empire.status === "active" && "bg-success/20 text-success",
                        empire.status === "inactive" && "bg-muted text-muted-foreground",
                        empire.status === "scaling" && "bg-info/20 text-info"
                      )}>
                        {empire.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{empire.description}</p>
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

              {/* Metrics Grid */}
              <div className="mt-6 grid grid-cols-5 gap-3">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <DollarSign className="h-4 w-4 mx-auto text-success mb-1" />
                  <p className="text-lg font-bold text-foreground">${(empire.metrics.revenue / 1000).toFixed(0)}k</p>
                  <p className="text-[10px] text-muted-foreground">Revenue</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <TrendingUp className="h-4 w-4 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold text-success">+{empire.metrics.growth}%</p>
                  <p className="text-[10px] text-muted-foreground">Growth</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <FolderKanban className="h-4 w-4 mx-auto text-accent mb-1" />
                  <p className="text-lg font-bold text-foreground">{empire.metrics.activeProjects}</p>
                  <p className="text-[10px] text-muted-foreground">Projects</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <Bot className="h-4 w-4 mx-auto text-warning mb-1" />
                  <p className="text-lg font-bold text-foreground">{empire.metrics.totalAgents}</p>
                  <p className="text-[10px] text-muted-foreground">Agents</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <Globe className="h-4 w-4 mx-auto text-info mb-1" />
                  <p className="text-lg font-bold text-foreground">{empire.metrics.browserSessions}</p>
                  <p className="text-[10px] text-muted-foreground">Sessions</p>
                </div>
              </div>

              {/* Files Summary */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                {Object.entries(empire.files).map(([type, files]) => (
                  files.length > 0 && (
                    <div key={type} className="flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span className="capitalize">{type}</span>
                      <span className="font-medium text-foreground">{files.length}</span>
                    </div>
                  )
                ))}
              </div>

              {/* Manager & Actions */}
              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                <div className="flex items-center gap-2">
                  {empire.manager && (
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold text-sm">
                        {empire.manager.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{empire.manager.name}</p>
                        <p className="text-xs text-muted-foreground">Empire Manager</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveEmpire(empire)
                      setShowNewProjectModal(true)
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Project
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveEmpire(empire)
                      setActiveView("projects")
                    }}
                  >
                    View Projects
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {empires.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No empires yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Create your first containerized empire to get started</p>
            <Button 
              className="mt-4 gap-2 bg-gradient-to-r from-primary to-accent text-white"
              onClick={() => setShowNewEmpireModal(true)}
            >
              <Plus className="h-4 w-4" />
              Create First Empire
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

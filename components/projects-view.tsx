"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  FolderKanban, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  MoreHorizontal,
  Activity,
  Globe,
  Bot,
  FileText,
  Key,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Rocket
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function ProjectsView() {
  const { empires, activeEmpire, setActiveEmpire, setShowNewProjectModal, setActiveProject, launchProject } = useStore()

  const allProjects = activeEmpire 
    ? activeEmpire.projects 
    : empires.flatMap(e => e.projects.map(p => ({ ...p, empireName: e.name })))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planning": return Clock
      case "active": return Activity
      case "paused": return Pause
      case "completed": return CheckCircle
      default: return AlertCircle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "bg-warning/20 text-warning border-warning/30"
      case "active": return "bg-success/20 text-success border-success/30"
      case "paused": return "bg-muted text-muted-foreground border-muted"
      case "completed": return "bg-primary/20 text-primary border-primary/30"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Empire Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {activeEmpire ? `${activeEmpire.name} Projects` : "All Projects"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {allProjects.length} projects total
            </p>
          </div>
          {empires.length > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant={!activeEmpire ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveEmpire(null)}
              >
                All Empires
              </Button>
              {empires.map(empire => (
                <Button
                  key={empire.id}
                  variant={activeEmpire?.id === empire.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveEmpire(empire)}
                >
                  {empire.name}
                </Button>
              ))}
            </div>
          )}
        </div>
        {activeEmpire && (
          <Button 
            onClick={() => setShowNewProjectModal(true)}
            className="gap-2 bg-gradient-to-r from-primary to-accent text-white"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {allProjects.map((project) => {
          const StatusIcon = getStatusIcon(project.status)
          return (
            <Card 
              key={project.id} 
              className="border-border/50 bg-card/50 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setActiveProject(project)}
            >
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 text-accent">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{project.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize",
                    getStatusColor(project.status)
                  )}>
                    <StatusIcon className="h-3 w-3" />
                    {project.status}
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-medium text-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>

                {/* Resources */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Bot className="h-3.5 w-3.5" />
                    <span>{project.workers.length + (project.manager ? 1 : 0)} agents</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                    <span>{project.browserSessions.length} sessions</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{project.files.length} files</span>
                  </div>
                </div>

                {/* APIs & Credentials */}
                <div className="mt-3 flex items-center gap-2">
                  {project.apis.length > 0 && (
                    <div className="flex items-center gap-1 rounded-full bg-info/10 px-2 py-0.5 text-[10px] text-info">
                      <Zap className="h-3 w-3" />
                      {project.apis.length} APIs
                    </div>
                  )}
                  {project.credentials.length > 0 && (
                    <div className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] text-warning">
                      <Key className="h-3 w-3" />
                      {project.credentials.length} credentials
                    </div>
                  )}
                </div>

                {/* Tasks Summary */}
                {project.tasks.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    {project.tasks.filter(t => t.status === "completed").length > 0 && (
                      <span className="text-[10px] text-success">
                        {project.tasks.filter(t => t.status === "completed").length} completed
                      </span>
                    )}
                    {project.tasks.filter(t => t.status === "in-progress").length > 0 && (
                      <span className="text-[10px] text-info">
                        {project.tasks.filter(t => t.status === "in-progress").length} in progress
                      </span>
                    )}
                    {project.tasks.filter(t => t.status === "pending").length > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        {project.tasks.filter(t => t.status === "pending").length} pending
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                  {project.manager ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info/20 text-info font-semibold text-[10px]">
                        {project.manager.name[0]}
                      </div>
                      <span className="text-xs text-muted-foreground">{project.manager.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No manager assigned</span>
                  )}
                  
                  <div className="flex items-center gap-1.5">
                    {project.status === "planning" && (
                      <Button 
                        size="sm" 
                        className="h-7 gap-1 bg-gradient-to-r from-primary to-accent text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          launchProject(project.id)
                        }}
                      >
                        <Rocket className="h-3 w-3" />
                        Launch
                      </Button>
                    )}
                    {project.status === "active" && (
                      <Button variant="outline" size="sm" className="h-7 gap-1">
                        <Pause className="h-3 w-3" />
                        Pause
                      </Button>
                    )}
                    {project.status === "paused" && (
                      <Button variant="outline" size="sm" className="h-7 gap-1">
                        <Play className="h-3 w-3" />
                        Resume
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Settings className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {allProjects.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No projects yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {activeEmpire 
                ? "Create your first project in this empire" 
                : "Select an empire and create your first project"}
            </p>
            {activeEmpire && (
              <Button 
                className="mt-4 gap-2 bg-gradient-to-r from-primary to-accent text-white"
                onClick={() => setShowNewProjectModal(true)}
              >
                <Plus className="h-4 w-4" />
                Create First Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

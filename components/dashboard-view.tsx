"use client"

import { useStore } from "@/lib/store"
import { 
  Building2, 
  FolderKanban, 
  Bot, 
  Globe,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Play,
  Pause,
  Eye
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AgentHierarchy } from "./agent-hierarchy"
import { BrowserSessionCard } from "./browser-session-card"

export function DashboardView() {
  const { empires, availableAgents, browserSessions, setActiveView, setActiveEmpire, ceoAgent } = useStore()
  
  const totalRevenue = empires.reduce((acc, e) => acc + e.metrics.revenue, 0)
  const totalProjects = empires.reduce((acc, e) => acc + e.projects.length, 0)
  const activeAgents = availableAgents.filter(a => a.status === "active" || a.status === "working").length
  const activeBrowserSessions = browserSessions.filter(s => s.status === "active").length

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+23.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-success"
    },
    {
      label: "Active Empires",
      value: empires.length.toString(),
      change: "+1",
      trend: "up",
      icon: Building2,
      color: "text-primary"
    },
    {
      label: "Total Projects",
      value: totalProjects.toString(),
      change: "+4",
      trend: "up",
      icon: FolderKanban,
      color: "text-accent"
    },
    {
      label: "Active Agents",
      value: `${activeAgents}/${availableAgents.length + 1}`,
      change: "98% uptime",
      trend: "up",
      icon: Bot,
      color: "text-warning"
    },
    {
      label: "Browser Sessions",
      value: activeBrowserSessions.toString(),
      change: "Live",
      trend: "up",
      icon: Globe,
      color: "text-info"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-muted", stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  )}>
                    {stat.change}
                    {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Agent Hierarchy */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Agent Hierarchy</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setActiveView("agents")} className="text-primary hover:text-primary/80">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <AgentHierarchy />
          </CardContent>
        </Card>

        {/* Live Browser Sessions */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Live Browser Sessions
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setActiveView("browser")} className="text-primary hover:text-primary/80">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {browserSessions.filter(s => s.status === "active").slice(0, 3).map((session) => (
              <BrowserSessionCard key={session.id} session={session} compact />
            ))}
            {activeBrowserSessions === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No active browser sessions</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Empires Overview */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Active Empires</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setActiveView("empires")} className="text-primary hover:text-primary/80">
            Manage Empires
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {empires.map((empire) => (
              <div
                key={empire.id}
                className="group relative rounded-xl border border-border/50 bg-background/50 p-4 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setActiveEmpire(empire)
                  setActiveView("empires")
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{empire.name}</h3>
                      <p className="text-xs text-muted-foreground">{empire.projects.length} projects</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-lg font-bold text-foreground">${(empire.metrics.revenue / 1000).toFixed(0)}k</p>
                    <p className="text-[10px] text-muted-foreground">Revenue</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-lg font-bold text-foreground">{empire.metrics.totalAgents}</p>
                    <p className="text-[10px] text-muted-foreground">Agents</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-lg font-bold text-success">+{empire.metrics.growth}%</p>
                    <p className="text-[10px] text-muted-foreground">Growth</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-success" />
                    <span className="text-xs font-medium text-success capitalize">{empire.status}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                    {empire.metrics.browserSessions} sessions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

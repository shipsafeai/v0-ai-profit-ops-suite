"use client"

import { useStore, type Agent } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bot, 
  Activity, 
  Globe, 
  MoreHorizontal,
  Search,
  Plus,
  Crown,
  Building2,
  FolderKanban,
  Wrench,
  Code,
  Copy,
  Play,
  Sparkles,
  Package,
  GitBranch,
  Cpu,
  Layers,
  Blocks,
  Zap,
  Download,
  Upload,
  Save,
  Settings2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

// Agent Templates for spawning custom workforces
const agentTemplates = [
  {
    id: "full-stack-team",
    name: "Full Stack Development Team",
    description: "Complete team for building web applications end-to-end",
    agents: [
      { role: "project-manager", name: "Lead PM", capabilities: ["project-management", "agile", "browser-automation"] },
      { role: "worker", name: "Frontend Dev", capabilities: ["react", "typescript", "tailwind", "browser-testing"] },
      { role: "worker", name: "Backend Dev", capabilities: ["nodejs", "python", "api-design", "database"] },
      { role: "worker", name: "DevOps", capabilities: ["docker", "kubernetes", "ci-cd", "deployment"] },
    ],
    category: "development"
  },
  {
    id: "marketing-team",
    name: "Digital Marketing Squad",
    description: "AI workforce for marketing campaigns and growth",
    agents: [
      { role: "project-manager", name: "Marketing Lead", capabilities: ["strategy", "analytics", "browser-automation"] },
      { role: "worker", name: "Content Creator", capabilities: ["copywriting", "seo", "social-media"] },
      { role: "worker", name: "Ads Specialist", capabilities: ["ppc", "facebook-ads", "google-ads", "browser-automation"] },
      { role: "worker", name: "Designer", capabilities: ["graphics", "video", "branding"] },
    ],
    category: "marketing"
  },
  {
    id: "saas-builder",
    name: "SaaS Builder Team",
    description: "End-to-end SaaS product development workforce",
    agents: [
      { role: "project-manager", name: "Product Manager", capabilities: ["product-strategy", "roadmap", "user-research"] },
      { role: "worker", name: "Full Stack Dev", capabilities: ["nextjs", "react", "database", "stripe"] },
      { role: "worker", name: "UI/UX Designer", capabilities: ["figma", "user-flows", "prototyping"] },
      { role: "worker", name: "QA Engineer", capabilities: ["testing", "playwright", "browser-automation"] },
    ],
    category: "development"
  },
  {
    id: "ecommerce-team",
    name: "E-Commerce Operations",
    description: "Workforce for running and scaling online stores",
    agents: [
      { role: "project-manager", name: "Store Manager", capabilities: ["inventory", "fulfillment", "browser-automation"] },
      { role: "worker", name: "Product Lister", capabilities: ["copywriting", "seo", "product-photography"] },
      { role: "worker", name: "Customer Support", capabilities: ["helpdesk", "chat", "email", "browser-automation"] },
      { role: "worker", name: "Analytics", capabilities: ["reporting", "conversion", "a-b-testing"] },
    ],
    category: "ecommerce"
  },
  {
    id: "content-team",
    name: "Content Production Studio",
    description: "Team for creating and managing content at scale",
    agents: [
      { role: "project-manager", name: "Content Director", capabilities: ["editorial", "planning", "browser-automation"] },
      { role: "worker", name: "Writer", capabilities: ["blog", "articles", "technical-writing"] },
      { role: "worker", name: "Editor", capabilities: ["proofreading", "seo", "formatting"] },
      { role: "worker", name: "Publisher", capabilities: ["cms", "scheduling", "distribution", "browser-automation"] },
    ],
    category: "content"
  },
  {
    id: "automation-team",
    name: "Browser Automation Specialists",
    description: "Heavy Playwright/browser automation focus",
    agents: [
      { role: "project-manager", name: "Automation Lead", capabilities: ["workflow-design", "browser-automation", "scheduling"] },
      { role: "worker", name: "Scraper", capabilities: ["web-scraping", "data-extraction", "playwright"] },
      { role: "worker", name: "Form Filler", capabilities: ["data-entry", "form-automation", "browser-automation"] },
      { role: "worker", name: "Monitor", capabilities: ["monitoring", "alerts", "screenshot", "browser-automation"] },
    ],
    category: "automation"
  }
]

// Code templates / bases
const codeTemplates = [
  { id: "nextjs-saas", name: "Next.js SaaS Starter", tech: ["Next.js", "TypeScript", "Prisma", "Stripe"], icon: Layers },
  { id: "ecom-shopify", name: "Shopify Headless", tech: ["Next.js", "Shopify", "GraphQL"], icon: Package },
  { id: "ai-chatbot", name: "AI Chatbot Framework", tech: ["Python", "LangChain", "OpenAI"], icon: Bot },
  { id: "automation-suite", name: "Playwright Automation Suite", tech: ["TypeScript", "Playwright", "Jest"], icon: Globe },
  { id: "api-backend", name: "API Backend Boilerplate", tech: ["Node.js", "Express", "PostgreSQL"], icon: Code },
  { id: "mobile-app", name: "React Native Starter", tech: ["React Native", "Expo", "Firebase"], icon: Cpu },
]

export function AgentsView() {
  const { ceoAgent, availableAgents, setSelectedAgent, setShowAgentDetailModal } = useStore()
  const [filter, setFilter] = useState<"all" | "ceo" | "empire-manager" | "project-manager" | "worker">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Workforce Playground
          </h2>
          <p className="text-sm text-muted-foreground">Agent templates, code bases, and workforce management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import Template
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-accent text-white">
            <Plus className="h-4 w-4" />
            Create Custom Agent
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="templates" className="gap-2">
            <Blocks className="h-4 w-4" />
            Workforce Templates
          </TabsTrigger>
          <TabsTrigger value="codebases" className="gap-2">
            <GitBranch className="h-4 w-4" />
            Code Bases
          </TabsTrigger>
          <TabsTrigger value="agents" className="gap-2">
            <Bot className="h-4 w-4" />
            Available Agents
          </TabsTrigger>
        </TabsList>

        {/* Workforce Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="rounded-xl border border-info/30 bg-info/5 p-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-info mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Instant Workforce Deployment</h4>
                <p className="text-sm text-muted-foreground">Select a template below to spawn a complete custom AI workforce when launching a new project. Each project gets its own containerized team with full Playwright browser automation capabilities.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentTemplates.map((template) => (
              <Card 
                key={template.id}
                className={cn(
                  "border-border/50 bg-card/50 hover:shadow-lg transition-all cursor-pointer group",
                  selectedTemplate === template.id && "border-primary ring-2 ring-primary/20"
                )}
                onClick={() => setSelectedTemplate(template.id === selectedTemplate ? null : template.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                      <Blocks className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
                      {template.category}
                    </span>
                  </div>
                  
                  <h3 className="mt-3 font-semibold text-foreground">{template.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Team Composition:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {template.agents.map((agent, i) => {
                        const Icon = getRoleIcon(agent.role)
                        return (
                          <div 
                            key={i}
                            className={cn(
                              "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                              getRoleBadgeColor(agent.role)
                            )}
                          >
                            <Icon className="h-3 w-3" />
                            {agent.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" />
                      Browser-enabled
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => e.stopPropagation()}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-7 gap-1 bg-primary text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Play className="h-3 w-3" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Custom Template */}
          <Card className="border-dashed border-2 border-border/50 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Plus className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="mt-3 font-medium text-foreground">Create Custom Workforce Template</h3>
              <p className="mt-1 text-sm text-muted-foreground text-center max-w-md">Design your own AI workforce composition with specific roles, capabilities, and browser automation settings</p>
              <Button variant="outline" className="mt-4 gap-2">
                <Settings2 className="h-4 w-4" />
                Build Custom Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Bases Tab */}
        <TabsContent value="codebases" className="space-y-6">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
            <div className="flex items-start gap-3">
              <GitBranch className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Project Code Bases</h4>
                <p className="text-sm text-muted-foreground">Pre-configured code templates your AI workforce can use as a starting point. Each includes documentation and setup scripts for autonomous deployment.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {codeTemplates.map((template) => {
              const Icon = template.icon
              return (
                <Card key={template.id} className="border-border/50 bg-card/50 hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 text-accent">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h3 className="mt-3 font-semibold text-foreground">{template.name}</h3>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {template.tech.map((t) => (
                        <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-3">
                      <Button variant="outline" size="sm" className="flex-1 h-8 gap-1">
                        <Download className="h-3.5 w-3.5" />
                        Clone
                      </Button>
                      <Button size="sm" className="flex-1 h-8 gap-1 bg-accent text-white">
                        <Play className="h-3 w-3" />
                        Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Upload Custom */}
          <Card className="border-dashed border-2 border-border/50 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Upload className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="mt-3 font-medium text-foreground">Upload Code Base</h3>
              <p className="mt-1 text-sm text-muted-foreground text-center max-w-md">Upload your own repository or code base for your AI workforce to work with</p>
              <Button variant="outline" className="mt-4 gap-2">
                <Upload className="h-4 w-4" />
                Upload Repository
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Available Agents Tab */}
        <TabsContent value="agents" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Agents", value: allAgents.length, icon: Bot },
              { label: "Active", value: allAgents.filter(a => a.status === "active" || a.status === "working").length, icon: Activity },
              { label: "Browser Sessions", value: allAgents.reduce((acc, a) => acc + a.browserSessions, 0), icon: Globe },
              { label: "Avg Performance", value: `${Math.round(allAgents.reduce((acc, a) => acc + a.performance, 0) / allAgents.length)}%`, icon: Activity }
            ].map((stat) => {
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
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

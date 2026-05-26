"use client"

import { useStore, type Project, type APIConfig, type Credential } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  X, 
  FolderKanban, 
  Upload, 
  FileText, 
  Key,
  Zap,
  Bot,
  Globe,
  Check,
  Loader2,
  Rocket,
  Plus,
  Trash2,
  Sparkles,
  Users,
  Blocks,
  Crown,
  Building2,
  Wrench
} from "lucide-react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

// Workforce templates for spawning custom AI teams
const workforceTemplates = [
  {
    id: "full-stack",
    name: "Full Stack Development",
    description: "Complete team for web app development",
    agents: ["Project Lead", "Frontend Dev", "Backend Dev", "DevOps"],
    browserEnabled: true
  },
  {
    id: "marketing",
    name: "Digital Marketing",
    description: "Marketing campaigns and growth",
    agents: ["Marketing Lead", "Content Creator", "Ads Specialist"],
    browserEnabled: true
  },
  {
    id: "automation",
    name: "Browser Automation",
    description: "Heavy Playwright automation focus",
    agents: ["Automation Lead", "Scraper", "Form Filler", "Monitor"],
    browserEnabled: true
  },
  {
    id: "custom",
    name: "Custom Configuration",
    description: "Build your own workforce from scratch",
    agents: [],
    browserEnabled: true
  }
]

export function NewProjectModal() {
  const { 
    showNewProjectModal, 
    setShowNewProjectModal, 
    createProject, 
    launchProject,
    availableAgents,
    activeEmpire
  } = useStore()
  
  const [step, setStep] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [autoLaunch, setAutoLaunch] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState("full-stack")
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager: "",
    workers: [] as string[],
    files: [] as File[],
    apis: [] as Partial<APIConfig>[],
    credentials: [] as Partial<Credential>[],
    browserConfig: {
      enabled: true,
      maxSessions: 5,
      headless: true
    }
  })

  const projectManagers = availableAgents.filter(a => a.role === "project-manager")
  const workerAgents = availableAgents.filter(a => a.role === "worker")

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...Array.from(files)]
    }))
  }, [])

  const removeFile = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }, [])

  const addAPI = () => {
    setFormData(prev => ({
      ...prev,
      apis: [...prev.apis, { id: `api-${Date.now()}`, name: "", endpoint: "", status: "pending" }]
    }))
  }

  const updateAPI = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      apis: prev.apis.map((api, i) => i === index ? { ...api, [field]: value } : api)
    }))
  }

  const removeAPI = (index: number) => {
    setFormData(prev => ({
      ...prev,
      apis: prev.apis.filter((_, i) => i !== index)
    }))
  }

  const addCredential = () => {
    setFormData(prev => ({
      ...prev,
      credentials: [...prev.credentials, { id: `cred-${Date.now()}`, name: "", type: "api-key", service: "", isValid: true }]
    }))
  }

  const updateCredential = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      credentials: prev.credentials.map((cred, i) => i === index ? { ...cred, [field]: value } : cred)
    }))
  }

  const removeCredential = (index: number) => {
    setFormData(prev => ({
      ...prev,
      credentials: prev.credentials.filter((_, i) => i !== index)
    }))
  }

  const toggleWorker = (workerId: string) => {
    setFormData(prev => ({
      ...prev,
      workers: prev.workers.includes(workerId) 
        ? prev.workers.filter(id => id !== workerId)
        : [...prev.workers, workerId]
    }))
  }

  const handleCreate = async () => {
    if (!activeEmpire) return
    
    setIsCreating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const manager = availableAgents.find(a => a.id === formData.manager)
    const workers = availableAgents.filter(a => formData.workers.includes(a.id))
    
    const newProject = createProject(activeEmpire.id, {
      name: formData.name,
      description: formData.description,
      status: "planning",
      empireId: activeEmpire.id,
      manager,
      files: formData.files.map((f, i) => ({
        id: `file-${i}`,
        name: f.name,
        type: f.name.includes("handoff") ? "handoff" as const : "documentation" as const,
        size: f.size,
        uploadedAt: new Date()
      })),
      apis: formData.apis.map(api => ({
        id: api.id || `api-${Date.now()}`,
        name: api.name || "",
        endpoint: api.endpoint || "",
        status: "pending" as const
      })),
      credentials: formData.credentials.map(cred => ({
        id: cred.id || `cred-${Date.now()}`,
        name: cred.name || "",
        type: (cred.type || "api-key") as "api-key" | "oauth" | "login" | "token",
        service: cred.service || "",
        isValid: true
      })),
      progress: 0,
      tasks: []
    })
    
    if (autoLaunch) {
      await new Promise(resolve => setTimeout(resolve, 500))
      launchProject(newProject.id)
    }
    
    setIsCreating(false)
    setShowNewProjectModal(false)
    setStep(1)
    setFormData({
      name: "",
      description: "",
      manager: "",
      workers: [],
      files: [],
      apis: [],
      credentials: [],
      browserConfig: { enabled: true, maxSessions: 5, headless: true }
    })
  }

  if (!showNewProjectModal || !activeEmpire) return null

  const selectedWorkforce = workforceTemplates.find(t => t.id === selectedTemplate)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowNewProjectModal(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-card border border-border/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary text-white">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Launch New Project</h2>
              <p className="text-sm text-muted-foreground">in {activeEmpire.name} - Step {step} of 5</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowNewProjectModal(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress */}
        <div className="flex gap-2 px-6 py-3 bg-muted/30">
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                s <= step ? "bg-accent" : "bg-border"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 py-4">
          {/* Step 1: Project Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Project Details</h3>
                <p className="text-sm text-muted-foreground">Define your project specs</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Project Name</Label>
                  <Input 
                    id="name"
                    placeholder="e.g., E-commerce Platform Launch"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Describe what this project will accomplish..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1.5 min-h-24"
                  />
                </div>

                <div>
                  <Label>Upload Project Handoff Bible & Files</Label>
                  <div className="mt-1.5 rounded-lg border-2 border-dashed border-border/50 p-6 text-center hover:border-primary/30 transition-colors">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-foreground">Click to upload files</p>
                      <p className="text-xs text-muted-foreground mt-1">Project handoff docs, assets, code, configs</p>
                    </label>
                  </div>
                  
                  {formData.files.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.files.map((file, i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 text-xs"
                        >
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="max-w-32 truncate">{file.name}</span>
                          <button
                            onClick={() => removeFile(i)}
                            className="text-muted-foreground hover:text-destructive ml-1"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Spawn Custom Workforce */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Spawn Custom AI Workforce
                </h3>
                <p className="text-sm text-muted-foreground">Each project gets its own dedicated, containerized AI team</p>
              </div>

              {/* Key info banner */}
              <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Isolated Containerized Workforce</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      This project will spawn its <span className="text-primary font-medium">own custom AI workforce</span> - 
                      completely isolated and dedicated to this project alone. Your agents will have full 
                      Playwright/browser automation to complete real-world tasks autonomously.
                    </p>
                  </div>
                </div>
              </div>

              {/* Workforce templates */}
              <div>
                <Label className="mb-2 block">Select Workforce Template</Label>
                <div className="grid grid-cols-2 gap-3">
                  {workforceTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={cn(
                        "flex flex-col items-start rounded-xl border p-4 text-left transition-all",
                        selectedTemplate === template.id 
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                          : "border-border/50 hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Blocks className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">{template.name}</span>
                        {selectedTemplate === template.id && (
                          <Check className="h-4 w-4 text-primary ml-auto" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                      {template.agents.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.agents.map((agent) => (
                            <span key={agent} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                              {agent}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browser automation note */}
              <div className="rounded-lg border border-info/30 bg-info/5 p-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-info" />
                  <p className="text-sm text-info">
                    All workforce agents have Playwright browser automation - they can navigate websites, fill forms, click buttons, 
                    extract data, and complete any web-based task autonomously.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Customize Workforce */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Customize Your Workforce</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedTemplate === "custom" 
                    ? "Build your workforce from available agents" 
                    : `Based on ${selectedWorkforce?.name} template - customize as needed`}
                </p>
              </div>

              <div>
                <Label>Project Manager (1 required)</Label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {projectManagers.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setFormData(prev => ({ ...prev, manager: agent.id }))}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                        formData.manager === agent.id 
                          ? "border-accent bg-accent/5" 
                          : "border-border/50 hover:border-accent/30"
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/20 text-info font-semibold">
                        {agent.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{agent.name}</p>
                          <Crown className="h-3.5 w-3.5 text-info" />
                        </div>
                        <p className="text-xs text-muted-foreground">{agent.performance}% performance</p>
                      </div>
                      {formData.manager === agent.id && (
                        <Check className="h-4 w-4 text-accent" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Worker Agents ({formData.workers.length} selected)</Label>
                <p className="text-xs text-muted-foreground mb-2">These agents will be cloned into your project&apos;s isolated container</p>
                <div className="grid grid-cols-2 gap-2">
                  {workerAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => toggleWorker(agent.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                        formData.workers.includes(agent.id) 
                          ? "border-warning bg-warning/5" 
                          : "border-border/50 hover:border-warning/30"
                      )}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warning/20 text-warning font-semibold text-sm">
                        {agent.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground text-sm">{agent.name}</p>
                          <Wrench className="h-3 w-3 text-warning" />
                        </div>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {agent.capabilities.slice(0, 2).map(cap => (
                            <span key={cap} className="text-[10px] text-muted-foreground">{cap}</span>
                          ))}
                        </div>
                      </div>
                      {formData.workers.includes(agent.id) && (
                        <Check className="h-4 w-4 text-warning flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Workforce hierarchy preview */}
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">Your Project Workforce Hierarchy:</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                    <Building2 className="h-3 w-3" />
                    {activeEmpire.manager?.name || "Empire Manager"}
                  </div>
                  <span className="text-muted-foreground">→</span>
                  <div className="flex items-center gap-1.5 rounded-full bg-info/10 px-2.5 py-1 text-xs text-info">
                    <FolderKanban className="h-3 w-3" />
                    {projectManagers.find(a => a.id === formData.manager)?.name || "Project Manager"}
                  </div>
                  <span className="text-muted-foreground">→</span>
                  <div className="flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs text-warning">
                    <Bot className="h-3 w-3" />
                    {formData.workers.length} Worker Agents
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: APIs & Credentials */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">APIs & Credentials</h3>
                <p className="text-sm text-muted-foreground">Configure integrations and access for your AI workforce</p>
              </div>

              {/* APIs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>API Integrations</Label>
                  <Button variant="outline" size="sm" onClick={addAPI} className="gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    Add API
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.apis.map((api, i) => (
                    <div key={api.id} className="flex items-center gap-2 rounded-lg border border-border/50 p-3">
                      <Zap className="h-4 w-4 text-info flex-shrink-0" />
                      <Input 
                        placeholder="API Name"
                        value={api.name}
                        onChange={(e) => updateAPI(i, "name", e.target.value)}
                        className="flex-1"
                      />
                      <Input 
                        placeholder="Endpoint URL"
                        value={api.endpoint}
                        onChange={(e) => updateAPI(i, "endpoint", e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeAPI(i)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.apis.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No APIs configured yet</p>
                  )}
                </div>
              </div>

              {/* Credentials */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Credentials & Logins</Label>
                  <Button variant="outline" size="sm" onClick={addCredential} className="gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    Add Credential
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.credentials.map((cred, i) => (
                    <div key={cred.id} className="flex items-center gap-2 rounded-lg border border-border/50 p-3">
                      <Key className="h-4 w-4 text-warning flex-shrink-0" />
                      <Input 
                        placeholder="Name"
                        value={cred.name}
                        onChange={(e) => updateCredential(i, "name", e.target.value)}
                        className="flex-1"
                      />
                      <select 
                        value={cred.type}
                        onChange={(e) => updateCredential(i, "type", e.target.value)}
                        className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      >
                        <option value="api-key">API Key</option>
                        <option value="oauth">OAuth</option>
                        <option value="login">Login</option>
                        <option value="token">Token</option>
                      </select>
                      <Input 
                        placeholder="Service"
                        value={cred.service}
                        onChange={(e) => updateCredential(i, "service", e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeCredential(i)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.credentials.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No credentials configured yet</p>
                  )}
                </div>
              </div>

              {/* Browser Config */}
              <div className="rounded-lg border border-info/30 bg-info/5 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="h-5 w-5 text-info" />
                  <div>
                    <p className="font-medium text-foreground">Playwright Browser Automation</p>
                    <p className="text-xs text-muted-foreground">Your workforce can browse, interact, and automate web tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.browserConfig.enabled}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        browserConfig: { ...prev.browserConfig, enabled: e.target.checked }
                      }))}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Enable browser sessions</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Max sessions:</span>
                    <Input 
                      type="number"
                      value={formData.browserConfig.maxSessions}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        browserConfig: { ...prev.browserConfig, maxSessions: parseInt(e.target.value) || 5 }
                      }))}
                      className="w-16"
                      min={1}
                      max={20}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Launch */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Review & Launch</h3>
                <p className="text-sm text-muted-foreground">Confirm your project configuration</p>
              </div>

              <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 text-accent">
                    <FolderKanban className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{formData.name || "Unnamed Project"}</h4>
                    <p className="text-sm text-muted-foreground">{formData.description || "No description"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-background/50 p-3">
                    <p className="text-xs text-muted-foreground">Workforce Template</p>
                    <p className="font-medium text-foreground">{selectedWorkforce?.name}</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3">
                    <p className="text-xs text-muted-foreground">Project Manager</p>
                    <p className="font-medium text-foreground">
                      {projectManagers.find(a => a.id === formData.manager)?.name || "Not assigned"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3">
                    <p className="text-xs text-muted-foreground">Worker Agents</p>
                    <p className="font-medium text-foreground">{formData.workers.length} assigned</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3">
                    <p className="text-xs text-muted-foreground">Files</p>
                    <p className="font-medium text-foreground">{formData.files.length} uploaded</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3">
                    <p className="text-xs text-muted-foreground">APIs & Credentials</p>
                    <p className="font-medium text-foreground">{formData.apis.length + formData.credentials.length} configured</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3">
                    <p className="text-xs text-muted-foreground">Browser Sessions</p>
                    <p className="font-medium text-foreground">
                      {formData.browserConfig.enabled ? `Max ${formData.browserConfig.maxSessions}` : "Disabled"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key message about isolated workforce */}
              <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Spawning Containerized AI Workforce</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upon launch, this project will spawn its own dedicated AI workforce in an isolated container. 
                      Your agents will immediately begin working autonomously, using browser automation to complete 
                      real-world tasks and build your project from the ground up.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border/50 p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoLaunch}
                    onChange={(e) => setAutoLaunch(e.target.checked)}
                    className="rounded border-border h-5 w-5"
                  />
                  <div>
                    <p className="font-medium text-foreground">Auto-launch after creation</p>
                    <p className="text-xs text-muted-foreground">
                      Immediately deploy the containerized AI workforce to start building
                    </p>
                  </div>
                </label>
              </div>

              <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                <p className="text-sm text-success">
                  Your custom AI workforce will be fully operational within seconds, autonomously building, deploying, 
                  and scaling your project using Playwright browser automation for 100% real-world effectiveness.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/50 px-6 py-4 bg-muted/30">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : setShowNewProjectModal(false)}
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          
          {step < 5 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !formData.name}
              className="bg-gradient-to-r from-accent to-primary text-white"
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleCreate}
              disabled={isCreating || !formData.name}
              className="gap-2 bg-gradient-to-r from-accent to-primary text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {autoLaunch ? "Spawning Workforce..." : "Creating Project..."}
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  {autoLaunch ? "Launch & Spawn Workforce" : "Create Project"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface Agent {
  id: string
  name: string
  role: "ceo" | "empire-manager" | "project-manager" | "worker"
  status: "active" | "idle" | "working" | "offline"
  avatar: string
  capabilities: string[]
  assignedTo?: string
  currentTask?: string
  performance: number
  browserSessions: number
}

export interface BrowserSession {
  id: string
  agentId: string
  url: string
  status: "active" | "completed" | "error"
  action: string
  screenshot?: string
  startedAt: Date
  logs: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "paused" | "completed"
  empireId: string
  manager?: Agent
  workers: Agent[]
  files: ProjectFile[]
  apis: APIConfig[]
  credentials: Credential[]
  progress: number
  tasks: Task[]
  browserSessions: BrowserSession[]
  createdAt: Date
  launchedAt?: Date
}

export interface ProjectFile {
  id: string
  name: string
  type: "handoff" | "code" | "asset" | "config" | "documentation"
  size: number
  uploadedAt: Date
}

export interface APIConfig {
  id: string
  name: string
  endpoint: string
  status: "connected" | "error" | "pending"
}

export interface Credential {
  id: string
  name: string
  type: "api-key" | "oauth" | "login" | "token"
  service: string
  isValid: boolean
}

export interface Task {
  id: string
  title: string
  status: "pending" | "in-progress" | "completed" | "failed"
  assignedTo?: string
  priority: "low" | "medium" | "high" | "critical"
  browserRequired: boolean
}

export interface Empire {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "scaling"
  manager?: Agent
  projects: Project[]
  files: {
    brand: ProjectFile[]
    governing: ProjectFile[]
    vision: ProjectFile[]
    goals: ProjectFile[]
    credentials: ProjectFile[]
    assets: ProjectFile[]
    code: ProjectFile[]
  }
  metrics: {
    revenue: number
    growth: number
    activeProjects: number
    totalAgents: number
    browserSessions: number
  }
  createdAt: Date
}

interface StoreContextType {
  // CEO Agent
  ceoAgent: Agent
  
  // Empires
  empires: Empire[]
  activeEmpire: Empire | null
  setActiveEmpire: (empire: Empire | null) => void
  createEmpire: (empire: Omit<Empire, "id" | "createdAt" | "projects" | "metrics">) => Empire
  updateEmpire: (id: string, updates: Partial<Empire>) => void
  
  // Projects
  activeProject: Project | null
  setActiveProject: (project: Project | null) => void
  createProject: (empireId: string, project: Omit<Project, "id" | "createdAt" | "workers" | "browserSessions">) => Project
  launchProject: (projectId: string) => void
  
  // Agents
  availableAgents: Agent[]
  assignAgent: (agentId: string, projectId: string) => void
  
  // Browser Sessions
  browserSessions: BrowserSession[]
  createBrowserSession: (agentId: string, projectId: string, url: string, action: string) => BrowserSession
  
  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeView: "dashboard" | "empires" | "projects" | "agents" | "browser" | "settings"
  setActiveView: (view: "dashboard" | "empires" | "projects" | "agents" | "browser" | "settings") => void
  
  // Modals
  showNewEmpireModal: boolean
  setShowNewEmpireModal: (show: boolean) => void
  showNewProjectModal: boolean
  setShowNewProjectModal: (show: boolean) => void
  showAgentDetailModal: boolean
  setShowAgentDetailModal: (show: boolean) => void
  selectedAgent: Agent | null
  setSelectedAgent: (agent: Agent | null) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

const initialCeoAgent: Agent = {
  id: "ceo-001",
  name: "Kassandra",
  role: "ceo",
  status: "active",
  avatar: "/agents/kassandra.png",
  capabilities: ["strategic-planning", "resource-allocation", "empire-oversight", "communication", "browser-automation"],
  performance: 98,
  browserSessions: 3
}

const initialAgents: Agent[] = [
  {
    id: "emp-001",
    name: "Atlas",
    role: "empire-manager",
    status: "active",
    avatar: "/agents/atlas.png",
    capabilities: ["empire-management", "scaling", "optimization", "browser-automation"],
    performance: 95,
    browserSessions: 2
  },
  {
    id: "emp-002",
    name: "Nova",
    role: "empire-manager",
    status: "idle",
    avatar: "/agents/nova.png",
    capabilities: ["empire-management", "analytics", "reporting", "browser-automation"],
    performance: 92,
    browserSessions: 0
  },
  {
    id: "pm-001",
    name: "Orion",
    role: "project-manager",
    status: "working",
    avatar: "/agents/orion.png",
    capabilities: ["project-management", "task-delegation", "quality-assurance", "browser-automation"],
    currentTask: "Deploying e-commerce platform",
    performance: 94,
    browserSessions: 4
  },
  {
    id: "pm-002",
    name: "Luna",
    role: "project-manager",
    status: "active",
    avatar: "/agents/luna.png",
    capabilities: ["project-management", "client-communication", "browser-automation"],
    performance: 91,
    browserSessions: 1
  },
  {
    id: "wk-001",
    name: "Spark",
    role: "worker",
    status: "working",
    avatar: "/agents/spark.png",
    capabilities: ["frontend-development", "ui-design", "browser-testing"],
    currentTask: "Building landing page",
    performance: 89,
    browserSessions: 6
  },
  {
    id: "wk-002",
    name: "Bolt",
    role: "worker",
    status: "working",
    avatar: "/agents/bolt.png",
    capabilities: ["backend-development", "api-integration", "browser-automation"],
    currentTask: "Setting up payment gateway",
    performance: 93,
    browserSessions: 3
  },
  {
    id: "wk-003",
    name: "Pixel",
    role: "worker",
    status: "active",
    avatar: "/agents/pixel.png",
    capabilities: ["design", "branding", "asset-creation", "browser-research"],
    performance: 88,
    browserSessions: 2
  },
  {
    id: "wk-004",
    name: "Circuit",
    role: "worker",
    status: "idle",
    avatar: "/agents/circuit.png",
    capabilities: ["devops", "deployment", "monitoring", "browser-automation"],
    performance: 96,
    browserSessions: 0
  }
]

const initialEmpires: Empire[] = [
  {
    id: "empire-001",
    name: "TechVentures Global",
    description: "AI-powered SaaS products and digital solutions",
    status: "active",
    manager: initialAgents[0],
    projects: [],
    files: {
      brand: [{ id: "f1", name: "brand-guidelines.pdf", type: "documentation", size: 2400000, uploadedAt: new Date() }],
      governing: [{ id: "f2", name: "governance-charter.pdf", type: "documentation", size: 1200000, uploadedAt: new Date() }],
      vision: [{ id: "f3", name: "vision-2025.pdf", type: "documentation", size: 800000, uploadedAt: new Date() }],
      goals: [{ id: "f4", name: "q1-objectives.pdf", type: "documentation", size: 600000, uploadedAt: new Date() }],
      credentials: [],
      assets: [{ id: "f5", name: "logo-pack.zip", type: "asset", size: 15000000, uploadedAt: new Date() }],
      code: []
    },
    metrics: {
      revenue: 125000,
      growth: 23.5,
      activeProjects: 4,
      totalAgents: 12,
      browserSessions: 18
    },
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  }
]

const initialBrowserSessions: BrowserSession[] = [
  {
    id: "bs-001",
    agentId: "wk-001",
    url: "https://stripe.com/dashboard",
    status: "active",
    action: "Configuring payment webhooks",
    startedAt: new Date(Date.now() - 15 * 60 * 1000),
    logs: ["Navigated to Stripe dashboard", "Logged in successfully", "Navigating to webhooks section"]
  },
  {
    id: "bs-002",
    agentId: "wk-002",
    url: "https://vercel.com/dashboard",
    status: "active",
    action: "Deploying production build",
    startedAt: new Date(Date.now() - 8 * 60 * 1000),
    logs: ["Opened Vercel dashboard", "Selected project", "Initiating deployment"]
  },
  {
    id: "bs-003",
    agentId: "pm-001",
    url: "https://github.com/org/repo",
    status: "completed",
    action: "Reviewing pull requests",
    startedAt: new Date(Date.now() - 45 * 60 * 1000),
    logs: ["Reviewed PR #142", "Approved and merged", "Session completed"]
  }
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ceoAgent] = useState<Agent>(initialCeoAgent)
  const [empires, setEmpires] = useState<Empire[]>(initialEmpires)
  const [activeEmpire, setActiveEmpire] = useState<Empire | null>(initialEmpires[0])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [availableAgents, setAvailableAgents] = useState<Agent[]>(initialAgents)
  const [browserSessions, setBrowserSessions] = useState<BrowserSession[]>(initialBrowserSessions)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState<"dashboard" | "empires" | "projects" | "agents" | "browser" | "settings">("dashboard")
  const [showNewEmpireModal, setShowNewEmpireModal] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showAgentDetailModal, setShowAgentDetailModal] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const createEmpire = useCallback((empireData: Omit<Empire, "id" | "createdAt" | "projects" | "metrics">) => {
    const newEmpire: Empire = {
      ...empireData,
      id: `empire-${Date.now()}`,
      projects: [],
      metrics: {
        revenue: 0,
        growth: 0,
        activeProjects: 0,
        totalAgents: 0,
        browserSessions: 0
      },
      createdAt: new Date()
    }
    setEmpires(prev => [...prev, newEmpire])
    return newEmpire
  }, [])

  const updateEmpire = useCallback((id: string, updates: Partial<Empire>) => {
    setEmpires(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }, [])

  const createProject = useCallback((empireId: string, projectData: Omit<Project, "id" | "createdAt" | "workers" | "browserSessions">) => {
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      workers: [],
      browserSessions: [],
      createdAt: new Date()
    }
    setEmpires(prev => prev.map(e => 
      e.id === empireId 
        ? { ...e, projects: [...e.projects, newProject], metrics: { ...e.metrics, activeProjects: e.metrics.activeProjects + 1 } }
        : e
    ))
    return newProject
  }, [])

  const launchProject = useCallback((projectId: string) => {
    setEmpires(prev => prev.map(e => ({
      ...e,
      projects: e.projects.map(p => 
        p.id === projectId 
          ? { ...p, status: "active" as const, launchedAt: new Date() }
          : p
      )
    })))
  }, [])

  const assignAgent = useCallback((agentId: string, projectId: string) => {
    setAvailableAgents(prev => prev.map(a => 
      a.id === agentId ? { ...a, assignedTo: projectId, status: "working" as const } : a
    ))
  }, [])

  const createBrowserSession = useCallback((agentId: string, projectId: string, url: string, action: string) => {
    const newSession: BrowserSession = {
      id: `bs-${Date.now()}`,
      agentId,
      url,
      status: "active",
      action,
      startedAt: new Date(),
      logs: [`Initiated browser session for ${action}`]
    }
    setBrowserSessions(prev => [...prev, newSession])
    return newSession
  }, [])

  return (
    <StoreContext.Provider value={{
      ceoAgent,
      empires,
      activeEmpire,
      setActiveEmpire,
      createEmpire,
      updateEmpire,
      activeProject,
      setActiveProject,
      createProject,
      launchProject,
      availableAgents,
      assignAgent,
      browserSessions,
      createBrowserSession,
      sidebarOpen,
      setSidebarOpen,
      activeView,
      setActiveView,
      showNewEmpireModal,
      setShowNewEmpireModal,
      showNewProjectModal,
      setShowNewProjectModal,
      showAgentDetailModal,
      setShowAgentDetailModal,
      selectedAgent,
      setSelectedAgent
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within StoreProvider")
  }
  return context
}

"use client"

import { create } from 'zustand'

// Types
export interface Agent {
  id: string
  name: string
  role: 'ceo' | 'empire' | 'manager' | 'worker'
  status: 'active' | 'idle' | 'busy' | 'offline'
  avatar?: string
  specialization?: string
  tasksCompleted: number
  efficiency: number
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'paused'
  progress: number
  empireId: string
  managerId: string
  workers: string[]
  files: UploadedFile[]
  apis: ApiConfig[]
  credentials: Credential[]
  createdAt: Date
  launchedAt?: Date
  budget?: number
  revenue?: number
}

export interface Empire {
  id: string
  name: string
  description: string
  status: 'active' | 'building' | 'paused'
  agentId: string
  projects: string[]
  brandDocs: UploadedFile[]
  governingDocs: UploadedFile[]
  visionDocs: UploadedFile[]
  createdAt: Date
  totalRevenue: number
  totalProjects: number
}

export interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  category: 'brand' | 'governing' | 'vision' | 'goals' | 'credentials' | 'code' | 'handoff' | 'assets' | 'other'
  uploadedAt: Date
}

export interface ApiConfig {
  id: string
  name: string
  type: string
  endpoint?: string
  status: 'connected' | 'disconnected' | 'error'
}

export interface Credential {
  id: string
  name: string
  type: 'api_key' | 'oauth' | 'username_password' | 'token'
  service: string
  masked: string
}

export interface Activity {
  id: string
  type: 'empire_created' | 'project_launched' | 'agent_assigned' | 'task_completed' | 'file_uploaded' | 'milestone_reached'
  message: string
  timestamp: Date
  entityId?: string
  entityType?: 'empire' | 'project' | 'agent'
}

interface AppState {
  // UI State
  activeView: 'dashboard' | 'empires' | 'projects' | 'agents' | 'monitoring' | 'settings'
  selectedEmpireId: string | null
  selectedProjectId: string | null
  isNewEmpireModalOpen: boolean
  isNewProjectModalOpen: boolean
  isAgentChatOpen: boolean
  
  // Data
  empires: Empire[]
  projects: Project[]
  agents: Agent[]
  activities: Activity[]
  savedAgentTemplates: Agent[]
  
  // Actions
  setActiveView: (view: AppState['activeView']) => void
  setSelectedEmpire: (id: string | null) => void
  setSelectedProject: (id: string | null) => void
  toggleNewEmpireModal: () => void
  toggleNewProjectModal: () => void
  toggleAgentChat: () => void
  addEmpire: (empire: Empire) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  launchProject: (id: string) => void
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void
}

// Initial demo data
const demoAgents: Agent[] = [
  {
    id: 'ceo-1',
    name: 'Kassandra Prime',
    role: 'ceo',
    status: 'active',
    specialization: 'Strategic Command & Operations',
    tasksCompleted: 1247,
    efficiency: 98.5
  },
  {
    id: 'empire-1',
    name: 'Atlas',
    role: 'empire',
    status: 'active',
    specialization: 'E-Commerce Operations',
    tasksCompleted: 856,
    efficiency: 96.2
  },
  {
    id: 'empire-2',
    name: 'Prometheus',
    role: 'empire',
    status: 'active',
    specialization: 'SaaS Development',
    tasksCompleted: 723,
    efficiency: 94.8
  },
  {
    id: 'manager-1',
    name: 'Mercury',
    role: 'manager',
    status: 'busy',
    specialization: 'Product Development',
    tasksCompleted: 432,
    efficiency: 92.1
  },
  {
    id: 'manager-2',
    name: 'Athena',
    role: 'manager',
    status: 'active',
    specialization: 'Marketing & Growth',
    tasksCompleted: 389,
    efficiency: 95.7
  },
  {
    id: 'worker-1',
    name: 'Iris',
    role: 'worker',
    status: 'busy',
    specialization: 'Frontend Development',
    tasksCompleted: 234,
    efficiency: 91.3
  },
  {
    id: 'worker-2',
    name: 'Hermes',
    role: 'worker',
    status: 'active',
    specialization: 'Backend Engineering',
    tasksCompleted: 312,
    efficiency: 93.6
  },
  {
    id: 'worker-3',
    name: 'Apollo',
    role: 'worker',
    status: 'active',
    specialization: 'Design & UX',
    tasksCompleted: 198,
    efficiency: 94.2
  }
]

const demoEmpires: Empire[] = [
  {
    id: 'empire-1',
    name: 'Nova Commerce',
    description: 'E-commerce empire focused on premium lifestyle products',
    status: 'active',
    agentId: 'empire-1',
    projects: ['project-1', 'project-2'],
    brandDocs: [],
    governingDocs: [],
    visionDocs: [],
    createdAt: new Date('2024-01-15'),
    totalRevenue: 847500,
    totalProjects: 12
  },
  {
    id: 'empire-2',
    name: 'Quantum Labs',
    description: 'AI-powered SaaS products and automation tools',
    status: 'active',
    agentId: 'empire-2',
    projects: ['project-3'],
    brandDocs: [],
    governingDocs: [],
    visionDocs: [],
    createdAt: new Date('2024-02-20'),
    totalRevenue: 523000,
    totalProjects: 8
  }
]

const demoProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Premium Store Launch',
    description: 'Launch premium lifestyle store with automated fulfillment',
    status: 'in-progress',
    progress: 67,
    empireId: 'empire-1',
    managerId: 'manager-1',
    workers: ['worker-1', 'worker-2', 'worker-3'],
    files: [],
    apis: [
      { id: '1', name: 'Stripe', type: 'payment', status: 'connected' },
      { id: '2', name: 'Shopify', type: 'commerce', status: 'connected' }
    ],
    credentials: [],
    createdAt: new Date('2024-03-01'),
    launchedAt: new Date('2024-03-05'),
    budget: 50000,
    revenue: 127500
  },
  {
    id: 'project-2',
    name: 'Marketing Automation',
    description: 'AI-driven marketing campaign system',
    status: 'review',
    progress: 89,
    empireId: 'empire-1',
    managerId: 'manager-2',
    workers: ['worker-1'],
    files: [],
    apis: [],
    credentials: [],
    createdAt: new Date('2024-03-10'),
    launchedAt: new Date('2024-03-12'),
    budget: 25000,
    revenue: 45000
  },
  {
    id: 'project-3',
    name: 'AI Analytics Platform',
    description: 'Real-time analytics dashboard with predictive insights',
    status: 'in-progress',
    progress: 45,
    empireId: 'empire-2',
    managerId: 'manager-1',
    workers: ['worker-2', 'worker-3'],
    files: [],
    apis: [],
    credentials: [],
    createdAt: new Date('2024-03-15'),
    launchedAt: new Date('2024-03-18'),
    budget: 75000,
    revenue: 89000
  }
]

const demoActivities: Activity[] = [
  {
    id: '1',
    type: 'task_completed',
    message: 'Worker Iris completed frontend integration for Premium Store',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    entityId: 'project-1',
    entityType: 'project'
  },
  {
    id: '2',
    type: 'milestone_reached',
    message: 'Nova Commerce reached $800K total revenue',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    entityId: 'empire-1',
    entityType: 'empire'
  },
  {
    id: '3',
    type: 'agent_assigned',
    message: 'Athena assigned to Marketing Automation project',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    entityId: 'manager-2',
    entityType: 'agent'
  },
  {
    id: '4',
    type: 'project_launched',
    message: 'AI Analytics Platform containerized and launched',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    entityId: 'project-3',
    entityType: 'project'
  }
]

export const useAppStore = create<AppState>((set) => ({
  // UI State
  activeView: 'dashboard',
  selectedEmpireId: null,
  selectedProjectId: null,
  isNewEmpireModalOpen: false,
  isNewProjectModalOpen: false,
  isAgentChatOpen: false,
  
  // Data
  empires: demoEmpires,
  projects: demoProjects,
  agents: demoAgents,
  activities: demoActivities,
  savedAgentTemplates: demoAgents.filter(a => a.role === 'worker'),
  
  // Actions
  setActiveView: (view) => set({ activeView: view }),
  setSelectedEmpire: (id) => set({ selectedEmpireId: id }),
  setSelectedProject: (id) => set({ selectedProjectId: id }),
  toggleNewEmpireModal: () => set((state) => ({ isNewEmpireModalOpen: !state.isNewEmpireModalOpen })),
  toggleNewProjectModal: () => set((state) => ({ isNewProjectModalOpen: !state.isNewProjectModalOpen })),
  toggleAgentChat: () => set((state) => ({ isAgentChatOpen: !state.isAgentChatOpen })),
  
  addEmpire: (empire) => set((state) => ({ 
    empires: [...state.empires, empire],
    activities: [{
      id: Date.now().toString(),
      type: 'empire_created',
      message: `New empire "${empire.name}" has been created`,
      timestamp: new Date(),
      entityId: empire.id,
      entityType: 'empire'
    }, ...state.activities]
  })),
  
  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project] 
  })),
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  
  launchProject: (id) => set((state) => ({
    projects: state.projects.map(p => 
      p.id === id 
        ? { ...p, status: 'in-progress' as const, launchedAt: new Date() }
        : p
    ),
    activities: [{
      id: Date.now().toString(),
      type: 'project_launched',
      message: `Project "${state.projects.find(p => p.id === id)?.name}" has been launched`,
      timestamp: new Date(),
      entityId: id,
      entityType: 'project'
    }, ...state.activities]
  })),
  
  addActivity: (activity) => set((state) => ({
    activities: [{
      id: Date.now().toString(),
      timestamp: new Date(),
      ...activity
    }, ...state.activities]
  }))
}))

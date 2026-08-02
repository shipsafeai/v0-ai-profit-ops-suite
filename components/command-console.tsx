"use client"

import { useStore, type Agent, type Empire, type Task } from "@/lib/store"
import type { OpsSnapshot } from "@/lib/ops-agents"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Send,
  Square,
  Sparkles,
  Crown,
  Building2,
  FolderKanban,
  Wrench,
  Bot,
  CheckCircle2,
  Loader2,
  Wand2,
  Globe,
  ListChecks,
  UserCog,
  AlertTriangle,
} from "lucide-react"

const ROLE_ICON: Record<string, typeof Bot> = {
  ceo: Crown,
  "empire-manager": Building2,
  "project-manager": FolderKanban,
  worker: Wrench,
}

const TOOL_META: Record<string, { label: string; icon: typeof Bot }> = {
  createEmpire: { label: "Create Empire", icon: Building2 },
  createProject: { label: "Create Project", icon: FolderKanban },
  addTasks: { label: "Add Task Backlog", icon: ListChecks },
  launchBrowserSession: { label: "Launch Browser Session", icon: Globe },
  updateAgentStatus: { label: "Update Agent Status", icon: UserCog },
}

// Map raw/forwarded gateway errors to a clear, actionable operator message.
function humanizeError(raw?: string): string {
  const lower = (raw ?? "").toLowerCase()
  if (lower.includes("credit card") || lower.includes("customer_verification_required")) {
    return "AI Gateway needs a valid payment method on your Vercel team before it will serve model requests. Open your Vercel dashboard, go to AI \u2192 billing, add a card to unlock your free credits, then try again."
  }
  if (lower.includes("api key") || lower.includes("unauthorized") || lower.includes("401") || lower.includes("403")) {
    return "The AI Gateway rejected the request due to missing or invalid credentials. Confirm the AI Gateway integration is connected (or set AI_GATEWAY_API_KEY) and try again."
  }
  if (lower.includes("rate limit") || lower.includes("429")) {
    return "The model provider is rate limiting requests right now. Wait a moment and try again."
  }
  return "Something went wrong reaching the agent. Please try again."
}

function buildSnapshot(empires: Empire[], agents: Agent[], sessions: ReturnType<typeof useStore>["browserSessions"]): OpsSnapshot {
  const agentName = (id: string) => agents.find((a) => a.id === id)?.name ?? id
  return {
    empires: empires.map((e) => ({
      name: e.name,
      description: e.description,
      status: e.status,
      metrics: e.metrics,
      projects: e.projects.map((p) => ({
        name: p.name,
        status: p.status,
        progress: p.progress,
        taskCount: p.tasks.length,
      })),
    })),
    agents: agents.map((a) => ({
      name: a.name,
      role: a.role,
      status: a.status,
      performance: a.performance,
      currentTask: a.currentTask,
    })),
    browserSessions: sessions.map((s) => ({
      agentName: agentName(s.agentId),
      url: s.url,
      action: s.action,
      status: s.status,
    })),
  }
}

const QUICK_PROMPTS = [
  "Give me a strategic overview of my operation and the single highest-leverage move right now.",
  "Spin up a new empire for an AI newsletter business, add a launch project, and break it into tasks.",
  "Audit my active projects and reprioritise the backlog for maximum revenue impact.",
  "Assign an idle agent to a browser automation task and tell me what it will do.",
]

export function CommandConsole() {
  const store = useStore()
  const { ceoAgent, availableAgents, empires, activeProject } = store

  const allAgents = useMemo(() => [ceoAgent, ...availableAgents], [ceoAgent, availableAgents])
  const [selectedAgentId, setSelectedAgentId] = useState(ceoAgent.id)
  const selectedAgent = allAgents.find((a) => a.id === selectedAgentId) ?? ceoAgent

  // Refs so the transport + tool handler always read the freshest state.
  const agentRef = useRef(selectedAgent)
  const snapshotRef = useRef<OpsSnapshot>(buildSnapshot(empires, allAgents, store.browserSessions))
  const storeRef = useRef(store)
  const agentsRef = useRef(allAgents)

  useEffect(() => {
    agentRef.current = selectedAgent
    snapshotRef.current = buildSnapshot(empires, allAgents, store.browserSessions)
    storeRef.current = store
    agentsRef.current = allAgents
  })

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/agents/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            messages,
            agent: {
              name: agentRef.current.name,
              role: agentRef.current.role,
              capabilities: agentRef.current.capabilities,
            },
            snapshot: snapshotRef.current,
          },
        }),
      }),
    [],
  )

  const runClientTool = useCallback((toolName: string, input: Record<string, unknown>): string => {
    const s = storeRef.current
    const findAgent = (name: string) =>
      agentsRef.current.find((a) => a.name.toLowerCase() === String(name).toLowerCase())
    const findEmpire = (name: string) =>
      s.empires.find((e) => e.name.toLowerCase() === String(name).toLowerCase())
    const findProject = (name: string) => {
      for (const e of s.empires) {
        const p = e.projects.find((p) => p.name.toLowerCase() === String(name).toLowerCase())
        if (p) return { empire: e, project: p }
      }
      return null
    }

    switch (toolName) {
      case "createEmpire": {
        const empire = s.createEmpire({
          name: String(input.name),
          description: String(input.description ?? ""),
          status: "active",
          manager: undefined,
          files: { brand: [], governing: [], vision: [], goals: [], credentials: [], assets: [], code: [] },
        })
        return `Empire "${empire.name}" created and is now live in the command centre.`
      }
      case "createProject": {
        const empire = findEmpire(String(input.empireName))
        if (!empire) return `No empire named "${input.empireName}" exists. Create the empire first.`
        const project = s.createProject(empire.id, {
          name: String(input.name),
          description: String(input.description ?? ""),
          status: "planning",
          empireId: empire.id,
          manager: undefined,
          files: [],
          apis: [],
          credentials: [],
          progress: 0,
          tasks: [],
        })
        return `Project "${project.name}" created under empire "${empire.name}".`
      }
      case "addTasks": {
        const match = findProject(String(input.projectName))
        if (!match) return `No project named "${input.projectName}" was found.`
        const raw = Array.isArray(input.tasks) ? (input.tasks as Record<string, unknown>[]) : []
        const tasks: Task[] = raw.map((t, i) => ({
          id: `task-${Date.now()}-${i}`,
          title: String(t.title),
          status: "pending",
          priority: (t.priority as Task["priority"]) ?? "medium",
          browserRequired: Boolean(t.browserRequired),
        }))
        s.addTasksToProject(match.project.id, tasks)
        return `Added ${tasks.length} tasks to "${match.project.name}".`
      }
      case "launchBrowserSession": {
        const agent = findAgent(String(input.agentName))
        if (!agent) return `No agent named "${input.agentName}" was found.`
        s.createBrowserSession(agent.id, activeProject?.id ?? "", String(input.url), String(input.action))
        s.setAgentStatus(agent.id, "working", String(input.action))
        return `${agent.name} launched a browser session at ${input.url}.`
      }
      case "updateAgentStatus": {
        const agent = findAgent(String(input.agentName))
        if (!agent) return `No agent named "${input.agentName}" was found.`
        s.setAgentStatus(
          agent.id,
          input.status as Agent["status"],
          input.currentTask ? String(input.currentTask) : undefined,
        )
        return `${agent.name} is now "${input.status}"${input.currentTask ? ` — ${input.currentTask}` : ""}.`
      }
      default:
        return `Unknown action: ${toolName}`
    }
  }, [activeProject])

  const { messages, sendMessage, status, stop, addToolOutput, error } = useChat({
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall: ({ toolCall }) => {
      if (toolCall.dynamic) return
      try {
        const output = runClientTool(toolCall.toolName, (toolCall.input ?? {}) as Record<string, unknown>)
        addToolOutput({ tool: toolCall.toolName, toolCallId: toolCall.toolCallId, output })
      } catch (err) {
        addToolOutput({
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          state: "output-error",
          errorText: err instanceof Error ? err.message : "Action failed",
        })
      }
    },
  })

  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const isBusy = status === "submitted" || status === "streaming"

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, status])

  const submit = (text: string) => {
    const value = text.trim()
    if (!value || isBusy) return
    sendMessage({ text: value })
    setInput("")
  }

  const SelectedIcon = ROLE_ICON[selectedAgent.role] ?? Bot

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-8rem)]">
      {/* Agent selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {allAgents.map((agent) => {
          const Icon = ROLE_ICON[agent.role] ?? Bot
          const active = agent.id === selectedAgentId
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "border-border/60 bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/40",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {agent.name}
            </button>
          )
        })}
      </div>

      {/* Conversation */}
      <Card className="flex-1 flex flex-col overflow-hidden border-border/50 bg-card/50">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <SelectedIcon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground text-balance">
                Talk to {selectedAgent.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">
                {selectedAgent.name} has live awareness of your empires, agents, and browser sessions — and can take
                real action on this dashboard.
              </p>
              <div className="mt-6 grid gap-2 w-full">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => submit(p)}
                    className="group flex items-start gap-2 rounded-xl border border-border/60 bg-background/40 p-3 text-left text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
                  >
                    <Wand2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}>
              <div
                className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-semibold",
                  message.role === "user"
                    ? "bg-muted text-muted-foreground"
                    : "bg-gradient-to-br from-primary to-accent text-primary-foreground",
                )}
              >
                {message.role === "user" ? "You" : <SelectedIcon className="h-4 w-4" />}
              </div>
              <div className={cn("flex-1 space-y-2 max-w-[85%]", message.role === "user" && "flex flex-col items-end")}>
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <div
                        key={i}
                        className={cn(
                          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/60 text-foreground",
                        )}
                      >
                        {part.text}
                      </div>
                    )
                  }
                  if (part.type.startsWith("tool-")) {
                    const toolName = part.type.replace("tool-", "")
                    const meta = TOOL_META[toolName] ?? { label: toolName, icon: Sparkles }
                    const ToolIcon = meta.icon
                    // @ts-expect-error - tool part shapes are unioned; we read defensively
                    const state: string = part.state
                    // @ts-expect-error - defensive read
                    const output: unknown = part.output
                    // @ts-expect-error - defensive read
                    const errorText: string | undefined = part.errorText
                    const done = state === "output-available"
                    const failed = state === "output-error"
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium",
                          failed
                            ? "border-destructive/30 bg-destructive/5 text-destructive"
                            : done
                              ? "border-success/30 bg-success/5 text-foreground"
                              : "border-info/30 bg-info/5 text-foreground",
                        )}
                      >
                        {failed ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                        ) : done ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-info" />
                        )}
                        <ToolIcon className="h-3.5 w-3.5" />
                        <span>{meta.label}</span>
                        {done && typeof output === "string" && (
                          <span className="font-normal text-muted-foreground">— {output}</span>
                        )}
                        {failed && errorText && <span className="font-normal">— {errorText}</span>}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          ))}

          {status === "submitted" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {selectedAgent.name} is thinking...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {humanizeError(error.message)}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-border/50 p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit(input)
            }}
            className="flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault()
                  submit(input)
                }
              }}
              rows={1}
              placeholder={`Message ${selectedAgent.name}...`}
              className="flex-1 resize-none rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-40"
            />
            {isBusy ? (
              <Button type="button" onClick={() => stop()} variant="outline" size="icon" className="h-11 w-11 flex-shrink-0">
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="h-11 w-11 flex-shrink-0 bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </form>
        </div>
      </Card>
    </div>
  )
}

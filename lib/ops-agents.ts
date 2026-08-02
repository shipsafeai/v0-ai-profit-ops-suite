// Central configuration for the real AI agents that power the command centre.
// Models are resolved through the Vercel AI Gateway (zero-config for Anthropic
// via OIDC in this environment), so we only reference model id strings here.

export const OPS_MODEL = "anthropic/claude-sonnet-4.5"

export type AgentRole = "ceo" | "empire-manager" | "project-manager" | "worker"

export interface AgentPersona {
  name: string
  role: AgentRole
  capabilities: string[]
}

export interface OpsSnapshot {
  empires: {
    name: string
    description: string
    status: string
    metrics: {
      revenue: number
      growth: number
      activeProjects: number
      totalAgents: number
      browserSessions: number
    }
    projects: { name: string; status: string; progress: number; taskCount: number }[]
  }[]
  agents: { name: string; role: string; status: string; performance: number; currentTask?: string }[]
  browserSessions: { agentName: string; url: string; action: string; status: string }[]
}

const ROLE_BRIEFS: Record<AgentRole, string> = {
  ceo: `You are the CEO-clone intelligence for the entire operation. You think in terms of
portfolio strategy, capital allocation, risk, and compounding leverage. You delegate execution,
set direction, and only get into the weeds when it changes the outcome. You are decisive,
numbers-driven, and you always tie recommendations back to revenue, growth, and defensibility.`,
  "empire-manager": `You are an Empire Manager. You own the P&L of one or more empires (business units).
You optimise for durable growth, operational efficiency, and scaling systems. You translate the CEO's
strategy into empire-level plans and coordinate project managers.`,
  "project-manager": `You are a Project Manager. You turn goals into concrete, sequenced, assignable work.
You are ruthless about scope, dependencies, and unblocking your workers. You track progress and surface risk early.`,
  worker: `You are a specialist Worker agent. You execute hands-on tasks in your domain with high craft.
You are precise, practical, and you flag when a task needs browser automation or another agent's help.`,
}

const TOOL_GUIDE = `You can take real action in the operator's command centre using tools. These tools
mutate the live dashboard the operator is looking at, so use them when the operator asks you to build,
plan, launch, assign, or automate something — do not just describe what you would do, actually do it.

Available actions:
- createEmpire: stand up a new empire (business unit).
- createProject: create a project inside an existing empire (use the exact empire name).
- addTasks: add a sequenced task backlog to an existing project.
- launchBrowserSession: open a Playwright browser session for an agent to work a URL.
- updateAgentStatus: change an agent's status (and optionally its current task).

Rules for tool use:
- Chain tools when a request needs it (e.g. create an empire, then a project, then its tasks).
- Use names that already exist in the snapshot when referencing empires, projects, or agents.
- After acting, give the operator a short, confident summary of what you changed and the recommended next move.
- If a request is purely analytical, answer directly with sharp, specific insight — no tool call needed.`

export function buildSystemPrompt(agent: AgentPersona, snapshot?: OpsSnapshot): string {
  const brief = ROLE_BRIEFS[agent.role] ?? ROLE_BRIEFS.worker

  const identity = `Your name is ${agent.name}. Your role is "${agent.role}". Your core capabilities: ${
    agent.capabilities.join(", ") || "general operations"
  }.`

  let situational = "No live operational data was provided for this turn."
  if (snapshot) {
    const empireLines =
      snapshot.empires
        .map(
          (e) =>
            `- ${e.name} [${e.status}] rev $${e.metrics.revenue.toLocaleString()}, growth ${e.metrics.growth}%, ${
              e.metrics.activeProjects
            } active projects. Projects: ${
              e.projects.map((p) => `${p.name}(${p.status}, ${p.progress}%, ${p.taskCount} tasks)`).join("; ") ||
              "none yet"
            }`,
        )
        .join("\n") || "  (no empires yet)"

    const agentLines =
      snapshot.agents
        .map((a) => `- ${a.name} (${a.role}) ${a.status}${a.currentTask ? ` — ${a.currentTask}` : ""} [perf ${a.performance}%]`)
        .join("\n") || "  (no agents)"

    const sessionLines =
      snapshot.browserSessions.map((s) => `- ${s.agentName}: ${s.action} @ ${s.url} [${s.status}]`).join("\n") ||
      "  (no active browser sessions)"

    situational = `LIVE OPERATIONAL SNAPSHOT
Empires:
${empireLines}

Agents:
${agentLines}

Browser sessions:
${sessionLines}`
  }

  return `${brief}

${identity}

${situational}

${TOOL_GUIDE}

Communication style: concise, high-signal, and operator-grade. Prefer short paragraphs and tight bullet lists.
Never invent metrics that are not in the snapshot; if you need data you do not have, say so and propose how to get it.`
}

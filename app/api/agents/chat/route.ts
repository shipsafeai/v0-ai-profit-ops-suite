import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  stepCountIs,
  toUIMessageStream,
  tool,
  type UIMessage,
} from "ai"
import { z } from "zod"
import { OPS_MODEL, buildSystemPrompt, type AgentPersona, type OpsSnapshot } from "@/lib/ops-agents"

export const maxDuration = 60

interface ChatRequest {
  messages: UIMessage[]
  agent: AgentPersona
  snapshot?: OpsSnapshot
}

// Client-side tools: they are declared here (schema only, no execute) so the model
// can call them, but they are executed in the browser where they mutate the live
// dashboard store. See components/command-console.tsx onToolCall handler.
const actionTools = {
  createEmpire: tool({
    description: "Create a new empire (top-level business unit) in the command centre.",
    inputSchema: z.object({
      name: z.string().describe("Short, punchy empire name"),
      description: z.string().describe("One-sentence description of the empire's focus"),
    }),
  }),
  createProject: tool({
    description: "Create a project inside an existing empire. Use the exact empire name from the snapshot.",
    inputSchema: z.object({
      empireName: z.string().describe("Exact name of the empire to create the project under"),
      name: z.string().describe("Project name"),
      description: z.string().describe("One-sentence description of the project"),
    }),
  }),
  addTasks: tool({
    description: "Add a sequenced backlog of tasks to an existing project.",
    inputSchema: z.object({
      projectName: z.string().describe("Exact name of the target project"),
      tasks: z
        .array(
          z.object({
            title: z.string(),
            priority: z.enum(["low", "medium", "high", "critical"]),
            browserRequired: z.boolean().describe("Whether this task needs browser automation"),
          }),
        )
        .min(1)
        .max(12),
    }),
  }),
  launchBrowserSession: tool({
    description: "Open a Playwright browser automation session for an agent against a specific URL.",
    inputSchema: z.object({
      agentName: z.string().describe("Exact name of the agent that will run the session"),
      url: z.string().describe("Target URL for the browser session"),
      action: z.string().describe("What the agent will do in the session"),
    }),
  }),
  updateAgentStatus: tool({
    description: "Update an agent's operational status and optionally its current task.",
    inputSchema: z.object({
      agentName: z.string().describe("Exact name of the agent"),
      status: z.enum(["active", "idle", "working", "offline"]),
      currentTask: z.string().optional(),
    }),
  }),
}

export async function POST(req: Request) {
  let body: ChatRequest
  try {
    body = (await req.json()) as ChatRequest
  } catch {
    return new Response("Invalid request body", { status: 400 })
  }

  const { messages, agent, snapshot } = body

  if (!agent?.name || !agent?.role) {
    return new Response("Missing agent persona", { status: 400 })
  }

  const result = streamText({
    model: OPS_MODEL,
    system: buildSystemPrompt(agent, snapshot),
    messages: await convertToModelMessages(messages),
    tools: actionTools,
    // Allow the agent to chain several actions (e.g. empire -> project -> tasks)
    // and then wrap up with a summary before stopping.
    stopWhen: stepCountIs(12),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}

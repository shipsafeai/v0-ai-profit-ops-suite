"use client"

import { useStore, type Empire } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  X, 
  Building2, 
  Upload, 
  FileText, 
  Shield, 
  Target, 
  Flag, 
  Key,
  Image,
  Code,
  Check,
  Loader2
} from "lucide-react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

const fileCategories = [
  { id: "brand", label: "Brand Guidelines", icon: Image, description: "Logo, colors, typography, brand voice" },
  { id: "governing", label: "Governance Docs", icon: Shield, description: "Charter, policies, compliance" },
  { id: "vision", label: "Vision Documents", icon: Target, description: "Mission, vision, values" },
  { id: "goals", label: "Goals & OKRs", icon: Flag, description: "Objectives, key results, milestones" },
  { id: "credentials", label: "Credentials", icon: Key, description: "API keys, logins, tokens" },
  { id: "assets", label: "Assets", icon: Image, description: "Images, videos, design files" },
  { id: "code", label: "Code / Bases", icon: Code, description: "Repositories, codebases, templates" }
]

export function NewEmpireModal() {
  const { showNewEmpireModal, setShowNewEmpireModal, createEmpire, availableAgents } = useStore()
  const [step, setStep] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager: "",
    files: {
      brand: [] as File[],
      governing: [] as File[],
      vision: [] as File[],
      goals: [] as File[],
      credentials: [] as File[],
      assets: [] as File[],
      code: [] as File[]
    }
  })

  const empireManagers = availableAgents.filter(a => a.role === "empire-manager" && a.status !== "offline")

  const handleFileUpload = useCallback((category: string, files: FileList | null) => {
    if (!files) return
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [category]: [...prev.files[category as keyof typeof prev.files], ...Array.from(files)]
      }
    }))
  }, [])

  const removeFile = useCallback((category: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [category]: prev.files[category as keyof typeof prev.files].filter((_, i) => i !== index)
      }
    }))
  }, [])

  const handleCreate = async () => {
    setIsCreating(true)
    
    // Simulate creation delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const manager = availableAgents.find(a => a.id === formData.manager)
    
    createEmpire({
      name: formData.name,
      description: formData.description,
      status: "active",
      manager,
      files: {
        brand: formData.files.brand.map((f, i) => ({
          id: `brand-${i}`,
          name: f.name,
          type: "documentation" as const,
          size: f.size,
          uploadedAt: new Date()
        })),
        governing: formData.files.governing.map((f, i) => ({
          id: `governing-${i}`,
          name: f.name,
          type: "documentation" as const,
          size: f.size,
          uploadedAt: new Date()
        })),
        vision: formData.files.vision.map((f, i) => ({
          id: `vision-${i}`,
          name: f.name,
          type: "documentation" as const,
          size: f.size,
          uploadedAt: new Date()
        })),
        goals: formData.files.goals.map((f, i) => ({
          id: `goals-${i}`,
          name: f.name,
          type: "documentation" as const,
          size: f.size,
          uploadedAt: new Date()
        })),
        credentials: formData.files.credentials.map((f, i) => ({
          id: `credentials-${i}`,
          name: f.name,
          type: "config" as const,
          size: f.size,
          uploadedAt: new Date()
        })),
        assets: formData.files.assets.map((f, i) => ({
          id: `assets-${i}`,
          name: f.name,
          type: "asset" as const,
          size: f.size,
          uploadedAt: new Date()
        })),
        code: formData.files.code.map((f, i) => ({
          id: `code-${i}`,
          name: f.name,
          type: "code" as const,
          size: f.size,
          uploadedAt: new Date()
        }))
      }
    })
    
    setIsCreating(false)
    setShowNewEmpireModal(false)
    setStep(1)
    setFormData({
      name: "",
      description: "",
      manager: "",
      files: { brand: [], governing: [], vision: [], goals: [], credentials: [], assets: [], code: [] }
    })
  }

  if (!showNewEmpireModal) return null

  const totalFiles = Object.values(formData.files).flat().length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowNewEmpireModal(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-card border border-border/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Create New Empire</h2>
              <p className="text-sm text-muted-foreground">Step {step} of 3</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowNewEmpireModal(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress */}
        <div className="flex gap-2 px-6 py-3 bg-muted/30">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                s <= step ? "bg-primary" : "bg-border"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Empire Details</h3>
                <p className="text-sm text-muted-foreground">Define your empire&apos;s identity</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Empire Name</Label>
                  <Input 
                    id="name"
                    placeholder="e.g., TechVentures Global"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Describe your empire's purpose and focus..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1.5 min-h-24"
                  />
                </div>

                <div>
                  <Label>Assign Empire Manager</Label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {empireManagers.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => setFormData(prev => ({ ...prev, manager: agent.id }))}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                          formData.manager === agent.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border/50 hover:border-primary/30"
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold">
                          {agent.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{agent.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{agent.status}</p>
                        </div>
                        {formData.manager === agent.id && (
                          <Check className="h-4 w-4 text-primary ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Upload Files</h3>
                <p className="text-sm text-muted-foreground">Add your empire&apos;s foundational documents</p>
              </div>

              <div className="space-y-3">
                {fileCategories.map((category) => {
                  const Icon = category.icon
                  const files = formData.files[category.id as keyof typeof formData.files]
                  
                  return (
                    <div key={category.id} className="rounded-lg border border-border/50 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{category.label}</p>
                            <p className="text-xs text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(category.id, e.target.files)}
                          />
                          <div className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors">
                            <Upload className="h-3.5 w-3.5" />
                            Upload
                          </div>
                        </label>
                      </div>
                      
                      {files.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {files.map((file, i) => (
                            <div 
                              key={i}
                              className="flex items-center gap-1.5 rounded-full bg-muted/50 px-2 py-1 text-xs"
                            >
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span className="max-w-24 truncate">{file.name}</span>
                              <button
                                onClick={() => removeFile(category.id, i)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Review & Create</h3>
                <p className="text-sm text-muted-foreground">Confirm your empire configuration</p>
              </div>

              <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{formData.name || "Unnamed Empire"}</h4>
                    <p className="text-sm text-muted-foreground">{formData.description || "No description"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-background/50 p-3">
                    <p className="text-xs text-muted-foreground">Empire Manager</p>
                    <p className="font-medium text-foreground">
                      {empireManagers.find(a => a.id === formData.manager)?.name || "Not assigned"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3">
                    <p className="text-xs text-muted-foreground">Files Uploaded</p>
                    <p className="font-medium text-foreground">{totalFiles} files</p>
                  </div>
                </div>

                {totalFiles > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formData.files).map(([category, files]) => (
                      files.length > 0 && (
                        <div key={category} className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary capitalize">
                          {category}: {files.length}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-info/30 bg-info/5 p-3">
                <p className="text-sm text-info">
                  Once created, your empire will be containerized and ready to host autonomous projects with their own AI workforces.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/50 px-6 py-4 bg-muted/30">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : setShowNewEmpireModal(false)}
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          
          {step < 3 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !formData.name}
              className="bg-gradient-to-r from-primary to-accent text-white"
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleCreate}
              disabled={isCreating || !formData.name}
              className="gap-2 bg-gradient-to-r from-primary to-accent text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Empire...
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4" />
                  Create Empire
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

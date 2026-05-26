"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Key,
  Database,
  Cpu,
  Save
} from "lucide-react"

export function SettingsView() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Configure your AI Profit Ops suite</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-launch projects</Label>
                <p className="text-xs text-muted-foreground">Automatically launch projects after creation</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Real-time updates</Label>
                <p className="text-xs text-muted-foreground">Enable live status updates for agents</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Browser Automation */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-info" />
              Playwright Browser Automation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable browser automation</Label>
                <p className="text-xs text-muted-foreground">Allow agents to use Playwright for web tasks</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Headless mode</Label>
                <p className="text-xs text-muted-foreground">Run browsers without visible UI</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Max concurrent sessions</Label>
                <Input type="number" defaultValue={10} className="mt-1.5" />
              </div>
              <div>
                <Label>Session timeout (minutes)</Label>
                <Input type="number" defaultValue={30} className="mt-1.5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-screenshot on error</Label>
                <p className="text-xs text-muted-foreground">Capture screenshots when browser tasks fail</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Session recording</Label>
                <p className="text-xs text-muted-foreground">Record browser sessions for review</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-warning" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Project completion alerts</Label>
                <p className="text-xs text-muted-foreground">Get notified when projects complete</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Agent status changes</Label>
                <p className="text-xs text-muted-foreground">Alerts for agent online/offline status</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Error notifications</Label>
                <p className="text-xs text-muted-foreground">Critical error alerts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Browser session alerts</Label>
                <p className="text-xs text-muted-foreground">Notify on browser automation events</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-factor authentication</Label>
                <p className="text-xs text-muted-foreground">Require 2FA for sensitive actions</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Credential encryption</Label>
                <p className="text-xs text-muted-foreground">Encrypt all stored credentials</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Audit logging</Label>
                <p className="text-xs text-muted-foreground">Log all agent actions for review</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* API & Integrations */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4 text-accent" />
              API & Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>OpenAI API Key</Label>
              <Input type="password" placeholder="sk-..." className="mt-1.5" />
            </div>
            <div>
              <Label>Anthropic API Key</Label>
              <Input type="password" placeholder="sk-ant-..." className="mt-1.5" />
            </div>
            <div>
              <Label>Webhook URL</Label>
              <Input placeholder="https://your-webhook.com/events" className="mt-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Max agents per project</Label>
                <Input type="number" defaultValue={10} className="mt-1.5" />
              </div>
              <div>
                <Label>Task queue limit</Label>
                <Input type="number" defaultValue={100} className="mt-1.5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-scaling</Label>
                <p className="text-xs text-muted-foreground">Automatically scale agents based on demand</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="gap-2 bg-gradient-to-r from-primary to-accent text-white">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}

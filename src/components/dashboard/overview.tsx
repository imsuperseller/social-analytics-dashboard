"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BarChart3,
  Facebook,
  Instagram,
  Play,
  RefreshCw
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Mock data - will be replaced with real data from your n8n workflows
const engagementData = [
  { date: '2024-02-25', facebook: 520, instagram: 780 },
  { date: '2024-02-26', facebook: 610, instagram: 890 },
  { date: '2024-02-27', facebook: 450, instagram: 820 },
  { date: '2024-02-28', facebook: 720, instagram: 950 },
  { date: '2024-03-01', facebook: 654, instagram: 890 },
]

const todaysSchedule = [
  { time: '14:00', platform: 'Facebook', content: 'Industry insights post', type: 'video' },
  { time: '18:00', platform: 'Instagram', content: 'Behind-the-scenes photo', type: 'photo' },
]

export function DashboardOverview() {
  const syncData = async (platform: 'facebook' | 'instagram' | 'all') => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: `sync_${platform}` })
      })
      
      if (response.ok) {
        console.log(`${platform} sync triggered`)
      }
    } catch (error) {
      console.error('Sync error:', error)
    }
  }

  const triggerWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch('/api/n8n/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger', workflowId })
      })
      
      if (response.ok) {
        console.log(`Workflow ${workflowId} triggered`)
      }
    } catch (error) {
      console.error('Workflow trigger error:', error)
    }
  }

  const sendWhatsAppAlert = async () => {
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: 'default',
          message: '🎯 *Dashboard Alert*\n\nYour social media analytics dashboard is active!\n\nTotal engagement today: 1,544\nInstagram advantage: +36.1%\n\nCheck dashboard for details.',
        })
      })
      
      if (response.ok) {
        console.log('WhatsApp alert sent')
      }
    } catch (error) {
      console.error('WhatsApp error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Unified cross-platform social media analytics and insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => syncData('all')}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Data
          </Button>
          <Button size="sm" onClick={() => triggerWorkflow('R2z4uMg9xXzmgxA6')}>
            <Play className="mr-2 h-4 w-4" />
            Trigger Workflows
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Engagement
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34,600</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.5%
              </span>
              from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Facebook Performance
            </CardTitle>
            <Facebook className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">654</div>
            <p className="text-xs text-muted-foreground">
              avg engagement per post
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Instagram Performance
            </CardTitle>
            <Instagram className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">890</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +36.1%
              </span>
              vs Facebook
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Posts Today
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              scheduled for optimal times
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Engagement Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Cross-Platform Engagement</CardTitle>
            <CardDescription>
              Daily engagement comparison across platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="facebook" 
                  stroke="#1e3a8a" 
                  strokeWidth={2}
                  name="Facebook"
                />
                <Line 
                  type="monotone" 
                  dataKey="instagram" 
                  stroke="#e11d48" 
                  strokeWidth={2}
                  name="Instagram"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              Optimized posting times for maximum engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysSchedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    {item.platform === 'Facebook' ? (
                      <Facebook className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Instagram className="h-5 w-5 text-pink-600" />
                    )}
                    <div>
                      <p className="font-medium">{item.content}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.platform} • {item.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-medium">{item.time}</p>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              View Full Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Instantly trigger workflows and manage content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button className="flex flex-col h-20 space-y-1" onClick={() => syncData('facebook')}>
              <RefreshCw className="h-5 w-5" />
              <span className="text-xs">Sync Facebook</span>
            </Button>
            <Button className="flex flex-col h-20 space-y-1" variant="outline" onClick={() => syncData('instagram')}>
              <RefreshCw className="h-5 w-5" />
              <span className="text-xs">Sync Instagram</span>
            </Button>
            <Button className="flex flex-col h-20 space-y-1" variant="outline" onClick={() => syncData('all')}>
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Generate Report</span>
            </Button>
            <Button className="flex flex-col h-20 space-y-1" variant="outline" onClick={sendWhatsAppAlert}>
              <Play className="h-5 w-5" />
              <span className="text-xs">Send WhatsApp Alert</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  MessageCircle, 
  Send, 
  Settings, 
  Bell,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

export function WhatsAppPanel() {
  const [message, setMessage] = useState("")
  const [chatId, setChatId] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [lastSent, setLastSent] = useState<Date | null>(null)

  const sendWhatsAppMessage = async (type: 'manual' | 'test' = 'manual', testType?: string) => {
    setIsSending(true)
    
    try {
      let payload: any = {
        chatId: chatId || "default", 
        message: message || "Test message from Social Analytics Dashboard",
        type
      }

      if (type === 'test' && testType) {
        payload = {
          chatId: chatId || "default",
          message: "",
          type: 'analytics',
          data: {
            alertType: testType,
            platform: 'instagram',
            alertData: {
              current: 890,
              average: 654,
              percentage: 36.1,
              timestamp: new Date().toISOString()
            }
          }
        }
      }

      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setLastSent(new Date())
        if (type === 'manual') {
          setMessage("")
        }
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      alert('Failed to send WhatsApp message')
    } finally {
      setIsSending(false)
    }
  }

  const triggerWorkflowNotification = async (workflowId: string) => {
    setIsSending(true)
    
    try {
      // First trigger the workflow
      const workflowResponse = await fetch('/api/n8n/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'trigger',
          workflowId
        })
      })

      if (workflowResponse.ok) {
        // Then send notification
        await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: chatId || "default",
            message: `✅ *Workflow Triggered Successfully*\n\nWorkflow ID: ${workflowId}\nTimestamp: ${new Date().toLocaleString()}\n\nCheck dashboard for results.`
          })
        })
        
        setLastSent(new Date())
      }
    } catch (error) {
      console.error('Error triggering workflow:', error)
      alert('Failed to trigger workflow')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WhatsApp Integration</h1>
          <p className="text-muted-foreground">
            Send alerts, reports, and notifications via WhatsApp Pro
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {lastSent && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="mr-1 h-4 w-4" />
              Last sent: {lastSent.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Manual Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Send Manual Message
            </CardTitle>
            <CardDescription>
              Send custom messages and alerts via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Chat ID (optional)</label>
              <input
                type="text"
                placeholder="default"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full mt-1 px-3 py-2 border rounded-md resize-none"
              />
            </div>
            <Button 
              onClick={() => sendWhatsAppMessage('manual')}
              disabled={isSending || !message.trim()}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Quick Notifications
            </CardTitle>
            <CardDescription>
              Pre-configured alerts and workflow triggers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={() => sendWhatsAppMessage('test', 'engagement_spike')}
              disabled={isSending}
              className="w-full justify-start"
            >
              🚀 Send Engagement Spike Alert
            </Button>
            
            <Button
              variant="outline"
              onClick={() => sendWhatsAppMessage('test', 'daily_report')}
              disabled={isSending}
              className="w-full justify-start"
            >
              📊 Send Daily Report
            </Button>

            <Button
              variant="outline"
              onClick={() => triggerWorkflowNotification('R2z4uMg9xXzmgxA6')}
              disabled={isSending}
              className="w-full justify-start"
            >
              📘 Trigger Facebook Sync + Alert
            </Button>

            <Button
              variant="outline"
              onClick={() => triggerWorkflowNotification('mh7iPzRyOtFXDdJ4')}
              disabled={isSending}
              className="w-full justify-start"
            >
              📸 Trigger Instagram Sync + Alert
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* WhatsApp Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            WhatsApp Configuration
          </CardTitle>
          <CardDescription>
            Current WhatsApp Pro webhook settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">API URL</label>
              <p className="font-mono text-sm">http://172.245.56.50:3000</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">API Key</label>
              <p className="font-mono text-sm">4fc7e008d7d24fc995475029effc8fa8</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-1 h-4 w-4" />
                Connected
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Integration Notes:</p>
                <ul className="mt-1 text-muted-foreground list-disc list-inside space-y-1">
                  <li>Messages are sent via your Waha Pro instance</li>
                  <li>Default chat ID will be used if none specified</li>
                  <li>Workflow triggers include automatic notifications</li>
                  <li>All timestamps are in your local timezone</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
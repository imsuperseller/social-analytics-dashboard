const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || "http://172.245.56.50:3000"
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || "4fc7e008d7d24fc995475029effc8fa8"

export interface WhatsAppMessage {
  chatId: string
  text: string
  session?: string
}

export interface AnalyticsAlert {
  type: 'engagement_spike' | 'low_performance' | 'daily_report' | 'weekly_report'
  platform: 'facebook' | 'instagram' | 'cross_platform'
  data: any
}

export class WhatsAppService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = WHATSAPP_API_URL
    this.apiKey = WHATSAPP_API_KEY
  }

  async sendMessage(chatId: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sendText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          text: message,
          session: 'default',
          apiKey: this.apiKey
        })
      })

      return response.ok
    } catch (error) {
      console.error('WhatsApp send error:', error)
      return false
    }
  }

  async sendAnalyticsAlert(chatId: string, alert: AnalyticsAlert): Promise<boolean> {
    const message = this.formatAnalyticsMessage(alert)
    return this.sendMessage(chatId, message)
  }

  private formatAnalyticsMessage(alert: AnalyticsAlert): string {
    const timestamp = new Date().toLocaleString()
    
    switch (alert.type) {
      case 'engagement_spike':
        return `🚀 *Engagement Spike Alert* - ${timestamp}\n\n` +
               `Platform: ${alert.platform.toUpperCase()}\n` +
               `Current Engagement: ${alert.data.current}\n` +
               `Previous Average: ${alert.data.average}\n` +
               `Increase: +${alert.data.percentage}%\n\n` +
               `🎯 Action: Monitor and analyze top performing content`

      case 'low_performance':
        return `⚠️ *Low Performance Alert* - ${timestamp}\n\n` +
               `Platform: ${alert.platform.toUpperCase()}\n` +
               `Current Engagement: ${alert.data.current}\n` +
               `Expected: ${alert.data.expected}\n` +
               `Decrease: -${alert.data.percentage}%\n\n` +
               `💡 Suggestion: Review recent posts and adjust strategy`

      case 'daily_report':
        return `📊 *Daily Social Media Report* - ${timestamp}\n\n` +
               `Facebook: ${alert.data.facebook.posts} posts, ${alert.data.facebook.engagement} engagement\n` +
               `Instagram: ${alert.data.instagram.posts} posts, ${alert.data.instagram.engagement} engagement\n` +
               `Total: ${alert.data.total.engagement} engagement\n\n` +
               `🎯 Top Platform: ${alert.data.topPlatform} (+${alert.data.advantage}%)`

      case 'weekly_report':
        return `📈 *Weekly Analytics Summary* - ${timestamp}\n\n` +
               `Total Posts: ${alert.data.totalPosts}\n` +
               `Total Engagement: ${alert.data.totalEngagement}\n` +
               `Growth: +${alert.data.growth}%\n` +
               `Best Day: ${alert.data.bestDay}\n` +
               `Best Content: ${alert.data.bestContent}\n\n` +
               `🚀 Next Week Strategy: ${alert.data.strategy}`

      default:
        return `📱 Social Analytics Update - ${timestamp}\n\nNew data available in dashboard.`
    }
  }

  async sendWorkflowTriggerNotification(chatId: string, workflowId: string, status: 'started' | 'completed' | 'failed'): Promise<boolean> {
    const statusEmoji = {
      started: '▶️',
      completed: '✅',
      failed: '❌'
    }

    const message = `${statusEmoji[status]} *N8N Workflow ${status.toUpperCase()}*\n\n` +
                   `Workflow ID: ${workflowId}\n` +
                   `Timestamp: ${new Date().toLocaleString()}\n\n` +
                   `Dashboard: http://localhost:3001`

    return this.sendMessage(chatId, message)
  }
}

export const whatsappService = new WhatsAppService()
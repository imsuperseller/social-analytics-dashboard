import { NextRequest, NextResponse } from 'next/server'
import { whatsappService } from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatId, message, type = 'manual', data } = body

    if (!chatId || !message) {
      return NextResponse.json(
        { error: 'chatId and message are required' },
        { status: 400 }
      )
    }

    let success: boolean

    if (type === 'analytics' && data) {
      success = await whatsappService.sendAnalyticsAlert(chatId, {
        type: data.alertType,
        platform: data.platform,
        data: data.alertData
      })
    } else {
      success = await whatsappService.sendMessage(chatId, message)
    }

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('WhatsApp API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
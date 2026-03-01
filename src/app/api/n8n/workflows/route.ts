import { NextRequest, NextResponse } from 'next/server'
import { n8nService } from '@/lib/n8n'

export async function GET() {
  try {
    const workflows = await n8nService.getWorkflows()
    return NextResponse.json(workflows)
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, workflowId, data } = body

    if (!action || !workflowId) {
      return NextResponse.json(
        { error: 'action and workflowId are required' },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'trigger':
        result = await n8nService.triggerWorkflow(workflowId, data)
        break
      case 'activate':
        await n8nService.activateWorkflow(workflowId)
        result = { success: true, action: 'activated' }
        break
      case 'deactivate':
        await n8nService.deactivateWorkflow(workflowId)
        result = { success: true, action: 'deactivated' }
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error executing workflow action:', error)
    return NextResponse.json(
      { error: 'Failed to execute workflow action' },
      { status: 500 }
    )
  }
}
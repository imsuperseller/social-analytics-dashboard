import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { n8nService } from '@/lib/n8n'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const days = parseInt(searchParams.get('days') || '7')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    let whereClause: any = {
      createdAt: {
        gte: startDate
      }
    }

    if (platform && platform !== 'all') {
      whereClause.platform = platform.toUpperCase()
    }

    // Get social posts data
    const posts = await prisma.socialPost.findMany({
      where: whereClause,
      orderBy: {
        timestamp: 'desc'
      }
    })

    // Get engagement metrics
    const metrics = await prisma.engagementMetrics.findMany({
      where: {
        date: {
          gte: startDate
        },
        ...(platform && platform !== 'all' && { platform: platform.toUpperCase() })
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Get cross-platform analytics
    const crossPlatformData = await prisma.crossPlatformAnalytics.findMany({
      where: {
        date: {
          gte: startDate
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Calculate summary statistics
    const summary = {
      totalPosts: posts.length,
      totalEngagement: posts.reduce((sum: number, post) => sum + post.totalEngagement, 0),
      averageEngagement: posts.length > 0 ? 
        posts.reduce((sum: number, post) => sum + post.totalEngagement, 0) / posts.length : 0,
      platforms: {
        facebook: {
          posts: posts.filter(p => p.platform === 'FACEBOOK').length,
          engagement: posts.filter(p => p.platform === 'FACEBOOK').reduce((sum: number, post) => sum + post.totalEngagement, 0)
        },
        instagram: {
          posts: posts.filter(p => p.platform === 'INSTAGRAM').length,
          engagement: posts.filter(p => p.platform === 'INSTAGRAM').reduce((sum: number, post) => sum + post.totalEngagement, 0)
        }
      }
    }

    // Calculate engagement advantage
    let engagementAdvantage = 0
    if (summary.platforms.facebook.posts > 0 && summary.platforms.instagram.posts > 0) {
      const fbAvg = summary.platforms.facebook.engagement / summary.platforms.facebook.posts
      const igAvg = summary.platforms.instagram.engagement / summary.platforms.instagram.posts
      engagementAdvantage = ((igAvg / fbAvg) - 1) * 100
    }

    return NextResponse.json({
      summary: { ...summary, engagementAdvantage },
      posts: posts.slice(0, 50), // Limit to recent 50 posts
      metrics,
      crossPlatformData: crossPlatformData.slice(0, 30) // Limit to recent 30 days
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'sync_facebook':
        await n8nService.triggerFacebookSync()
        break
      case 'sync_instagram':
        await n8nService.triggerInstagramSync()
        break
      case 'sync_all':
        await Promise.all([
          n8nService.triggerFacebookSync(),
          n8nService.triggerInstagramSync()
        ])
        break
      case 'generate_report':
        // Generate cross-platform analytics
        const posts = await prisma.socialPost.findMany({
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 1))
            }
          }
        })

        const fbPosts = posts.filter(p => p.platform === 'FACEBOOK')
        const igPosts = posts.filter(p => p.platform === 'INSTAGRAM')

        const fbEngagement = fbPosts.reduce((sum: number, post) => sum + post.totalEngagement, 0)
        const igEngagement = igPosts.reduce((sum: number, post) => sum + post.totalEngagement, 0)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        await prisma.crossPlatformAnalytics.upsert({
          where: { date: today },
          update: {
            facebookPosts: fbPosts.length,
            facebookEngagement: fbEngagement,
            facebookAvgEngagement: fbPosts.length > 0 ? fbEngagement / fbPosts.length : 0,
            instagramPosts: igPosts.length,
            instagramEngagement: igEngagement,
            instagramAvgEngagement: igPosts.length > 0 ? igEngagement / igPosts.length : 0,
            engagementAdvantage: fbPosts.length > 0 && igPosts.length > 0 ? 
              ((igEngagement / igPosts.length) / (fbEngagement / fbPosts.length) - 1) * 100 : 0,
            topPlatform: igEngagement > fbEngagement ? 'INSTAGRAM' : 'FACEBOOK'
          },
          create: {
            date: today,
            facebookPosts: fbPosts.length,
            facebookEngagement: fbEngagement,
            facebookAvgEngagement: fbPosts.length > 0 ? fbEngagement / fbPosts.length : 0,
            instagramPosts: igPosts.length,
            instagramEngagement: igEngagement,
            instagramAvgEngagement: igPosts.length > 0 ? igEngagement / igPosts.length : 0,
            engagementAdvantage: fbPosts.length > 0 && igPosts.length > 0 ? 
              ((igEngagement / igPosts.length) / (fbEngagement / fbPosts.length) - 1) * 100 : 0,
            topPlatform: igEngagement > fbEngagement ? 'INSTAGRAM' : 'FACEBOOK'
          }
        })
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing analytics action:', error)
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    )
  }
}
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  Facebook,
  Instagram,
  Send
} from "lucide-react"

interface ScheduledPost {
  id: string
  platform: 'facebook' | 'instagram'
  content: string
  scheduledFor: string
  status: 'pending' | 'published' | 'failed'
  mediaUrls?: string[]
}

export function ContentManager() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPost, setNewPost] = useState({
    platform: 'facebook' as 'facebook' | 'instagram',
    content: '',
    scheduledFor: '',
    mediaUrls: [] as string[]
  })

  // Mock scheduled posts - will be replaced with real data
  const scheduledPosts: ScheduledPost[] = [
    {
      id: '1',
      platform: 'facebook',
      content: 'Industry insights: The future of automation in business',
      scheduledFor: '2024-03-02T14:00:00',
      status: 'pending'
    },
    {
      id: '2',
      platform: 'instagram',
      content: 'Behind the scenes: Building our analytics dashboard 📊',
      scheduledFor: '2024-03-02T18:00:00',
      status: 'pending'
    },
    {
      id: '3',
      platform: 'facebook',
      content: 'Case study: How automation increased engagement by 36%',
      scheduledFor: '2024-03-03T14:00:00',
      status: 'pending'
    }
  ]

  const optimalTimes = {
    facebook: [
      { day: 'Monday', time: '14:00', type: 'Industry insights' },
      { day: 'Tuesday', time: '14:00', type: 'Video content' },
      { day: 'Wednesday', time: '18:00', type: 'Engagement posts' },
      { day: 'Thursday', time: '14:00', type: 'Case studies' },
    ],
    instagram: [
      { day: 'Tuesday', time: '18:00', type: 'Behind-the-scenes' },
      { day: 'Wednesday', time: '19:00', type: 'Stories series' },
      { day: 'Thursday', time: '18:00', type: 'Process visuals' },
      { day: 'Sunday', time: '18:00', type: 'Inspirational content' },
      { day: 'Sunday', time: '20:00', type: 'Interactive stories' },
    ]
  }

  const handleSchedulePost = async () => {
    // API call to schedule post
    console.log('Scheduling post:', newPost)
    setShowNewPost(false)
    setNewPost({
      platform: 'facebook',
      content: '',
      scheduledFor: '',
      mediaUrls: []
    })
  }

  const handleDeletePost = async (id: string) => {
    // API call to delete scheduled post
    console.log('Deleting post:', id)
  }

  const handlePublishNow = async (id: string) => {
    // API call to publish immediately
    console.log('Publishing now:', id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Manager</h1>
          <p className="text-muted-foreground">
            Schedule posts and manage your content calendar
          </p>
        </div>
        <Button onClick={() => setShowNewPost(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Post
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Scheduled Posts */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Posts</CardTitle>
              <CardDescription>
                Posts scheduled for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start space-x-3 flex-1">
                    {post.platform === 'facebook' ? (
                      <Facebook className="h-5 w-5 text-blue-600 mt-1" />
                    ) : (
                      <Instagram className="h-5 w-5 text-pink-600 mt-1" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(post.scheduledFor).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handlePublishNow(post.id)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* New Post Form */}
          {showNewPost && (
            <Card>
              <CardHeader>
                <CardTitle>Schedule New Post</CardTitle>
                <CardDescription>
                  Create and schedule content for optimal engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Platform</label>
                    <select
                      value={newPost.platform}
                      onChange={(e) => setNewPost({...newPost, platform: e.target.value as 'facebook' | 'instagram'})}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    >
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      value={newPost.scheduledFor}
                      onChange={(e) => setNewPost({...newPost, scheduledFor: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <textarea
                    placeholder="Write your post content..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    rows={4}
                    className="w-full mt-1 px-3 py-2 border rounded-md resize-none"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSchedulePost} disabled={!newPost.content || !newPost.scheduledFor}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Post
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Optimal Times Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Facebook className="mr-2 h-5 w-5 text-blue-600" />
                Facebook Schedule
              </CardTitle>
              <CardDescription>
                Optimal posting times for maximum engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {optimalTimes.facebook.map((slot, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{slot.day}</p>
                    <p className="text-muted-foreground">{slot.type}</p>
                  </div>
                  <span className="font-mono text-blue-600">{slot.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Instagram className="mr-2 h-5 w-5 text-pink-600" />
                Instagram Schedule
              </CardTitle>
              <CardDescription>
                Peak engagement times and content types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {optimalTimes.instagram.map((slot, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{slot.day}</p>
                    <p className="text-muted-foreground">{slot.type}</p>
                  </div>
                  <span className="font-mono text-pink-600">{slot.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                📊 Analyze Performance
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                🔄 Auto-Schedule Week
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                📱 Send to WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
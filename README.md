# Social Analytics Dashboard

Unified cross-platform social media analytics and content management system.

## Features

- **Real-time Analytics**: Live engagement tracking across Facebook and Instagram
- **Content Management**: Schedule posts with optimal timing recommendations
- **Cross-Platform Insights**: Unified analytics showing platform performance comparison
- **WhatsApp Notifications**: Automated alerts and reports via WhatsApp Pro
- **N8N Integration**: Direct workflow management and trigger capabilities

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS with shadcn/ui components
- **Charts**: Recharts for data visualization
- **Authentication**: NextAuth.js

## Key Integrations

- **N8N Workflows**: 
  - Facebook Analytics: `R2z4uMg9xXzmgxA6`
  - Instagram Integration: `mh7iPzRyOtFXDdJ4`
- **WhatsApp Pro**: Real-time notifications via webhook
- **Facebook Graph API**: Social media data collection

## Performance Insights

- Instagram shows 36.1% higher engagement than Facebook
- Optimal posting times:
  - Facebook: Tuesday 14:00
  - Instagram: Sunday 18:00
- Automated analytics eliminate manual tasks

## Getting Started

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Setup Database**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Run Development**:
   ```bash
   npm run dev
   ```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `N8N_API_URL`: N8N instance API endpoint
- `WHATSAPP_API_URL`: WhatsApp Pro webhook URL
- `FACEBOOK_APP_ID/SECRET`: Facebook Graph API credentials

## Dashboard Views

- **Overview**: Real-time metrics and today's schedule
- **Analytics**: Deep-dive performance analysis
- **Content Manager**: Post scheduling and calendar
- **Performance**: Cross-platform comparison
- **WhatsApp**: Notification management
- **Settings**: System configuration

## Development

Dashboard is running at [http://localhost:3001](http://localhost:3001)

Built for automated social media strategy optimization.

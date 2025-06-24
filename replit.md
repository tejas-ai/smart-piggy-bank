# Smart Piggy Bank - System Architecture

## Overview

The Smart Piggy Bank is a full-stack web application designed to help users track their savings with an intuitive interface featuring progress visualization, achievements, and motivational elements. The application uses a modern tech stack with React frontend, Express.js backend, and PostgreSQL database.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for savings operations
- **Middleware**: Built-in request logging and error handling
- **Development**: Hot reloading with Vite integration

### Data Storage
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Single table design for savings entries
- **Fallback**: In-memory storage implementation for reliable operation
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Database Schema
```typescript
// savings_entries table
{
  id: serial (primary key)
  amount: integer (required)
  timestamp: timestamp (auto-generated)
}
```

### API Endpoints
- `GET /api/savings` - Retrieve all savings entries
- `POST /api/savings` - Create new savings entry
- `DELETE /api/savings/:id` - Delete specific savings entry

### Frontend Features
- **Progress Visualization**: Circular progress indicators and achievement system
- **Theme Support**: Light/dark mode toggle with CSS custom properties
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Toast Notifications**: User feedback for actions

## Data Flow

1. **User Input**: User enters savings amount via form input
2. **Validation**: Zod schema validates input on client and server
3. **API Request**: TanStack Query manages HTTP requests to backend
4. **Database Operation**: Drizzle ORM executes database queries
5. **Response Handling**: Success/error states update UI accordingly
6. **State Update**: Query cache automatically refetches and updates display

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **zod**: Runtime type validation

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Production build bundling
- **drizzle-kit**: Database schema management

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle pushes schema changes to PostgreSQL

### Runtime Configuration
- **Development**: `npm run dev` - runs TypeScript directly with hot reload
- **Production**: `npm run start` - runs compiled JavaScript bundle
- **Database**: Environment variable `DATABASE_URL` required for PostgreSQL connection

### Platform Configuration
- **Replit Integration**: Configured for autoscale deployment
- **Port Configuration**: Serves on port 5000 (mapped to external port 80)
- **Module System**: ES modules throughout the application

## Changelog
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
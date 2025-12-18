# DevFlow - Technical Debt Tracking Platform

**DevFlow** is a comprehensive code analysis platform that automatically scans GitHub repositories to detect code quality issues, technical debt, and potential improvements. It provides developers with actionable insights through an intuitive dashboard, helping teams maintain high code quality standards and make informed refactoring decisions.

## Problem Statement

Modern software development faces several critical challenges:

- **Invisible Technical Debt**: Teams often don't realize how much technical debt accumulates until it becomes critical
- **Manual Code Reviews are Time-Consuming**: Identifying code smells, duplicates, and complexity issues manually is inefficient
- **Lack of Metrics**: Without quantifiable metrics, it's hard to prioritize refactoring efforts
- **No Historical Tracking**: Teams can't easily see if code quality is improving or degrading over time
- **Scattered Tools**: Developers need to use multiple separate tools for different analysis types

## Key Features

- **Cyclomatic Complexity Detection**: Identify overly complex functions that need refactoring
- **Duplicate Code Finder**: Locate code duplication across your codebase using advanced algorithms
- **Code Smells Detection**: Recognize anti-patterns like long functions, god classes, and deep nesting
- **Dependency Analysis**: Visualize module dependencies and identify coupling issues

## Analytics & Reporting

- **Technical Debt Score**: Aggregate metric (0-100) representing overall code health
- **Trend Charts**: Visualize how code quality changes over time
- **File Heatmap**: Identify the most problematic files in your codebase
- **Issue Prioritization**: Focus on high-impact problems first

## Integrations

**GitHub OAuth**: Seamless authentication and repository access

## Usage

1. **Sign In**: Use your GitHub account to authenticate
2. **Select Repository**: Choose a repository from your GitHub account
3. **Start Analysis**: Click "Start Analysis" to scan your codebase
4. **View Results**: Browse through detected issues, view code snippets, and see suggestions
5. **Track Progress**: Monitor your technical debt score and see how it changes over time

## Technology Stack

### - Frontend

- **Next.js 16** (App Router)
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **shadcn/ui** - Modern UI components

### - Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Database

### Authentication & APIs

- **NextAuth.js** - GitHub OAuth implementation
- **GitHub REST API** - Repository data access
- **Octokit** - GitHub API client

### DevOps & Quality

- **GitHub Actions** - CI/CD automation
- **Vercel** - Deployment platform
- **ESLint + Prettier** - Code quality and formatting
- **Jest** - Unit, UI and Integraion testing
- **Husky** - Git hooks for quality gates

## CI/CD Setup

This project includes a GitHub Actions CI workflow that automatically runs on pull requests and pushes to main branches. The CI pipeline checks:

- **Code Formatting** - Ensures code follows Prettier formatting rules
- **Linting** - Runs ESLint to catch code quality issues
- **Build** - Ensures the project builds successfully
- **Tests** - Runs unit, integration, and UI tests

## Installation

- **Node.js 20+** and npm
- **PostgreSQL** database (version 14 or higher)
- **GitHub account** with OAuth app configured
- **Git**

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd devflow
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/devflow?schema=public"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# NextAuth
NEXTAUTH_SECRET="your_random_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
```

### Step 4: Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Open Prisma Studio to view your database
npm run studio
```

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Code Analysis Features

DevFlow analyzes your codebase and detects various code quality issues:

- **Long Functions**: Identifies functions that exceed recommended line counts
- **Long Parameter Lists**: Detects functions with too many parameters
- **God Classes**: Finds classes that have too many responsibilities
- **Magic Numbers**: Identifies hardcoded numeric values that should be constants
- **Large Files**: Flags files that are too large and should be split

Each issue is categorized by severity (Critical, High, Medium, Low, Info) and includes suggestions for improvement.

## Project Structure

```
devflow/
├── src/
│   ├── app/              # Next.js App Router pages and routes
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (root)/       # Protected routes
│   │   └── api/          # API routes
│   ├── components/       # React components
│   ├── lib/              # Utility functions and services
│   │   ├── analysis/     # Code analysis engine
│   │   ├── auth.ts       # Authentication configuration
│   │   ├── db.ts         # Database client
│   │   └── github/       # GitHub API client
│   └── tests/            # Test utilities and helpers
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Team

**Solo Developer** - Plyako Nikita

- GitHub: [@ITNIKITAIT](https://github.com/ITNIKITAIT)

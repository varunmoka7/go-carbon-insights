# Environment Setup Guide - GoCarbonTracker

**Version**: 1.0  
**Date**: January 22, 2025  
**Owner**: Technical Team  

## 📋 Overview

This comprehensive guide covers the complete environment setup for GoCarbonTracker development, from basic requirements to advanced IDE configuration, ensuring optimal developer experience and productivity.

## 🎯 Quick Start

### Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] Git configured with SSH keys
- [ ] Modern text editor/IDE installed
- [ ] Supabase account created
- [ ] Package manager preference set (npm/yarn/pnpm)

### 5-Minute Setup
```bash
# Clone repository
git clone git@github.com:your-org/go-carbon-insights.git
cd go-carbon-insights

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## 💻 System Requirements

### Minimum Requirements
- **OS**: macOS 10.15+, Windows 10+, or Ubuntu 18.04+
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB available space
- **Node.js**: 18.0.0 or higher
- **Git**: 2.30.0 or higher

### Recommended Specifications
- **RAM**: 32GB for optimal performance
- **Storage**: SSD with 50GB+ available space
- **CPU**: Multi-core processor (8+ cores recommended)
- **Network**: Stable internet connection for package downloads

## 🔧 Core Dependencies Installation

### Node.js Setup

#### Option 1: Node Version Manager (Recommended)
```bash
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or source profile
source ~/.bashrc

# Install and use Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

#### Option 2: Direct Installation
- **macOS**: Download from [nodejs.org](https://nodejs.org/) or use Homebrew
- **Windows**: Download from [nodejs.org](https://nodejs.org/) or use Chocolatey
- **Linux**: Use package manager or download from [nodejs.org](https://nodejs.org/)

```bash
# macOS with Homebrew
brew install node@18

# Windows with Chocolatey
choco install nodejs --version=18.19.0

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Git Configuration

#### Initial Setup
```bash
# Set global configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Set default editor
git config --global core.editor "code --wait"  # VS Code
# or
git config --global core.editor "vim"          # Vim

# Enable helpful colorization
git config --global color.ui auto

# Set up credential helper
git config --global credential.helper store
```

#### SSH Key Setup
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key to agent
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard
# macOS
pbcopy < ~/.ssh/id_ed25519.pub
# Linux
xclip -sel clip < ~/.ssh/id_ed25519.pub
# Windows (Git Bash)
cat ~/.ssh/id_ed25519.pub | clip

# Add to GitHub: Settings > SSH and GPG keys > New SSH key
```

### Package Manager Configuration

#### NPM Configuration
```bash
# Set npm registry (optional)
npm config set registry https://registry.npmjs.org/

# Set npm cache directory
npm config set cache ~/.npm-cache

# Enable package-lock.json
npm config set package-lock true

# Set audit level
npm config set audit-level moderate

# View current configuration
npm config list
```

#### Alternative Package Managers

##### Yarn (Optional)
```bash
# Install Yarn
npm install -g yarn

# Configure Yarn
yarn config set registry https://registry.npmjs.org/
yarn config set cache-folder ~/.yarn-cache
```

##### pnpm (Optional)
```bash
# Install pnpm
npm install -g pnpm

# Configure pnpm
pnpm config set registry https://registry.npmjs.org/
pnpm config set store-dir ~/.pnpm-store
```

## 🏗️ Project Setup

### Repository Clone and Initial Setup
```bash
# Clone with SSH (recommended)
git clone git@github.com:your-org/go-carbon-insights.git

# Or with HTTPS
git clone https://github.com/your-org/go-carbon-insights.git

# Navigate to project
cd go-carbon-insights

# Check Node.js version
node --version  # Should be 18.x.x

# Install dependencies
npm install

# Verify installation
npm ls --depth=0
```

### Environment Configuration

#### Environment Variables Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
# Use your preferred editor
code .env.local
# or
nano .env.local
```

#### Required Environment Variables
```bash
# .env.local
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Database (for forum-service)
DATABASE_URL=postgresql://user:password@localhost:5432/gocarbon_db

# API Configuration
VITE_API_URL=http://localhost:8000

# Development Settings
NODE_ENV=development
VITE_APP_VERSION=1.0.0

# Optional: Analytics and Monitoring
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_TRACKING_ID=your-ga-tracking-id

# Optional: Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=true
```

#### Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize local Supabase (optional)
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db reset
```

### Development Server Setup

#### Frontend Development
```bash
# Start development server
npm run dev

# Alternative ports if 3000 is busy
npm run dev -- --port 3001

# Development with network access
npm run dev -- --host 0.0.0.0

# Development with specific environment
NODE_ENV=development npm run dev
```

#### Backend Service Setup
```bash
# Navigate to forum service
cd forum-service

# Install dependencies
npm install

# Set up database
npm run db:setup

# Start backend development server
npm run dev

# Backend will run on http://localhost:8000
```

#### Full Stack Development
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd forum-service && npm run dev

# Terminal 3: Database (if running locally)
# Start PostgreSQL service
```

## 🛠️ IDE and Editor Setup

### Visual Studio Code (Recommended)

#### Essential Extensions
```bash
# Install VS Code extensions via command line
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json
code --install-extension eamodio.gitlens
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
code --install-extension ms-vscode.vscode-typescript-next
```

#### VS Code Settings
```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.eol": "\n",
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.next": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

#### VS Code Workspace Configuration
```json
// .vscode/workspace.json
{
  "folders": [
    {
      "name": "Frontend",
      "path": "."
    },
    {
      "name": "Backend",
      "path": "./forum-service"
    }
  ],
  "settings": {
    "typescript.preferences.importModuleSpecifier": "relative"
  }
}
```

#### Launch Configuration for Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Frontend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["dev"],
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/forum-service/src/server.ts",
      "outFiles": ["${workspaceFolder}/forum-service/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Alternative Editors

#### WebStorm Configuration
```javascript
// .idea/workspace.xml additions
// ESLint configuration
// Prettier configuration
// TypeScript service configuration
```

#### Vim/Neovim Setup
```lua
-- Neovim configuration for TypeScript development
-- plugins.lua
return {
  'neovim/nvim-lspconfig',
  'jose-elias-alvarez/null-ls.nvim',
  'windwp/nvim-autopairs',
  'hrsh7th/nvim-cmp',
  'hrsh7th/cmp-nvim-lsp',
}
```

## 🐳 Docker Development Environment

### Docker Setup
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  dev-environment:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/workspace
      - /workspace/node_modules
    ports:
      - "3000:3000"
      - "8000:8000"
    environment:
      - NODE_ENV=development
    command: npm run dev
```

### Dev Container Configuration
```json
// .devcontainer/devcontainer.json
{
  "name": "GoCarbonTracker Dev",
  "build": {
    "dockerfile": "Dockerfile",
    "context": ".."
  },
  "features": {
    "ghcr.io/devcontainers/features/node:1": {
      "version": "18"
    },
    "ghcr.io/devcontainers/features/git:1": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "bradlc.vscode-tailwindcss",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint"
      ]
    }
  },
  "postCreateCommand": "npm install",
  "forwardPorts": [3000, 8000],
  "portsAttributes": {
    "3000": {
      "label": "Frontend",
      "onAutoForward": "openBrowser"
    },
    "8000": {
      "label": "Backend API"
    }
  }
}
```

## 🔧 Advanced Configuration

### Performance Optimization

#### Node.js Performance Settings
```bash
# .nvmrc
18.19.0

# package.json scripts optimization
{
  "scripts": {
    "dev": "NODE_OPTIONS='--max-old-space-size=8192' vite dev",
    "build": "NODE_OPTIONS='--max-old-space-size=8192' vite build",
    "test": "NODE_OPTIONS='--max-old-space-size=4096' vitest"
  }
}
```

#### Vite Configuration Optimization
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/types': resolve(__dirname, './src/types'),
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts'],
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});
```

### Database Development Setup

#### Local PostgreSQL Installation
```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-15 postgresql-contrib

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### Database Configuration
```bash
# Create development database
createdb gocarbon_dev

# Create test database
createdb gocarbon_test

# Set up user
psql -d postgres -c "CREATE USER gocarbon_user WITH PASSWORD 'dev_password';"
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE gocarbon_dev TO gocarbon_user;"
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE gocarbon_test TO gocarbon_user;"
```

#### Redis Setup (Optional)
```bash
# macOS with Homebrew
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Test Redis connection
redis-cli ping  # Should return PONG
```

## 🧪 Testing Environment Setup

### Test Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    }
  }
});
```

### Test Environment Variables
```bash
# .env.test
NODE_ENV=test
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=test-anon-key
DATABASE_URL=postgresql://gocarbon_user:dev_password@localhost:5432/gocarbon_test
```

## 🔍 Debugging Setup

### Browser DevTools Configuration

#### Chrome DevTools
```javascript
// Chrome DevTools snippets for debugging
// Snippet: Check React Fiber
window.React = require('react');
window.ReactDOM = require('react-dom');

// Snippet: Performance monitoring
performance.mark('app-start');
// ... app code
performance.mark('app-end');
performance.measure('app-duration', 'app-start', 'app-end');
console.log(performance.getEntriesByName('app-duration'));
```

#### React Developer Tools
- Install React Developer Tools browser extension
- Configure for local development
- Set up profiler for performance analysis

### Node.js Debugging
```bash
# Debug backend with inspect
node --inspect-brk ./forum-service/src/server.ts

# Debug with VS Code
# Use launch.json configuration above
```

## 📱 Mobile Development Setup

### Mobile Testing Environment
```bash
# Install mobile testing tools
npm install -g @ionic/cli

# Set up mobile debugging
# Enable USB debugging on Android
# Enable Web Inspector on iOS Safari
```

### Responsive Testing
```javascript
// Browser testing script
const testResponsive = () => {
  const breakpoints = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1024 },
    { name: 'wide', width: 1440 }
  ];
  
  breakpoints.forEach(bp => {
    window.resizeTo(bp.width, 800);
    console.log(`Testing ${bp.name} view at ${bp.width}px`);
  });
};
```

## 🚀 Productivity Tools

### CLI Tools and Scripts
```bash
# Install useful CLI tools
npm install -g @supabase/cli
npm install -g npm-check-updates
npm install -g serve
npm install -g lighthouse

# Create development scripts
# scripts/dev-setup.sh
#!/bin/bash
echo "🚀 Setting up development environment..."
npm install
npm run db:setup
npm run dev
```

### Git Hooks Setup
```bash
# Install husky for git hooks
npm install --save-dev husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run type-check"

# Add commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

### Development Aliases
```bash
# Add to ~/.bashrc or ~/.zshrc
alias gc-dev="cd ~/projects/go-carbon-insights && npm run dev"
alias gc-backend="cd ~/projects/go-carbon-insights/forum-service && npm run dev"
alias gc-test="cd ~/projects/go-carbon-insights && npm test"
alias gc-build="cd ~/projects/go-carbon-insights && npm run build"
alias gc-logs="cd ~/projects/go-carbon-insights && tail -f logs/combined.log"
```

## 🔧 Troubleshooting Common Setup Issues

### Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Rebuild node modules
rm -rf node_modules package-lock.json
npm install

# Fix permission issues (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
```

### Port Conflicts
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Use different port
npm run dev -- --port 3001
```

### SSL/Certificate Issues
```bash
# Fix SSL issues for npm
npm config set strict-ssl false

# Clear certificate cache
npm config delete ca
npm config delete cafile
```

### Permission Issues
```bash
# Fix npm permissions (avoid sudo)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
# Add to ~/.bashrc: export PATH=~/.npm-global/bin:$PATH
```

## 📚 Additional Resources

### Learning Resources
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

### Community and Support
- [GitHub Discussions](https://github.com/your-org/go-carbon-insights/discussions)
- [Internal Documentation](./docs/)
- [Team Slack/Discord](#)

### Tools and Extensions
- [VS Code Marketplace](https://marketplace.visualstudio.com/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React DevTools](https://react.dev/learn/react-developer-tools)

---

**Last Updated**: January 22, 2025  
**Version**: 1.0  
**Maintained by**: Technical Team

This environment setup guide ensures all team members have a consistent, optimized development environment for maximum productivity and code quality.
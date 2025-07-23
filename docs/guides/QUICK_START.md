# 🚀 Quick Start Guide

**Get GoCarbonTracker running in 5 minutes**

## Prerequisites

- Node.js 18+ ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git configured

## Setup

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd go-carbon-insights

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

## Verify Installation

1. **Open your browser** → http://localhost:5173
2. **Login with demo account**:
   - Email: `demo@gocarbontracker.net`
   - Password: `demodemo`
3. **Check dashboard loads** with sample data

## What's Next?

- 📖 **Learn the platform**: [Dashboard Tutorial](./user-guides/dashboard-tutorial.md)
- 📚 **Browse guides**: [User Guides Index](./user-guides/README.md)
- 🛠️ **For development**: [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
- 🤝 **Contributing**: [Contributing Quick Guide](./CONTRIBUTING_QUICK.md)
- ❓ **Questions**: [FAQ](./FAQ.md)

## Common Issues

**Port already in use?** Run `npm run dev -- --port 3001`

**Dependencies failing?** Clear cache: `npm cache clean --force && npm install`

**Still having issues?** Check [Troubleshooting Guide](./TROUBLESHOOTING_GUIDE.md)

---
*Need help? Create an issue or check our documentation at [./docs/](./)*
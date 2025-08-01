# Enhanced Auto-Sync Guide

## Overview
The enhanced auto-sync feature provides **true two-way synchronization** between your local development environment and GitHub. It automatically commits and pushes your local changes to GitHub, and also pulls changes from GitHub to your local environment.

## How It Works
- **File Watcher**: Monitors your codebase for local changes
- **Debounced Commits**: Waits 2 seconds after the last change before committing
- **Auto Push**: Automatically pushes local changes to GitHub
- **Remote Monitoring**: Checks GitHub every 5 seconds for new changes
- **Auto Pull**: Automatically pulls remote changes to local
- **Conflict Resolution**: Handles merge conflicts intelligently
- **Error Recovery**: Attempts to recover from common git issues

## Two-Way Sync Flow

### Local → GitHub → Lovable
1. You make changes locally
2. Auto-sync commits and pushes to GitHub
3. Lovable can pull changes from GitHub

### Lovable → GitHub → Local
1. Lovable makes changes and pushes to GitHub
2. Auto-sync detects remote changes
3. Auto-sync pulls changes to your local environment

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Enhanced Auto-Sync
```bash
# Option 1: Using npm script
npm run auto-sync

# Option 2: Using npm script (alias)
npm run sync

# Option 3: Direct execution
node scripts/auto-sync.js
```

## What Gets Watched
The auto-sync monitors these file patterns:
- `src/**/*` - All source code
- `public/**/*` - Public assets
- `package.json` - Dependencies
- `vite.config.ts` - Build configuration
- `tailwind.config.js` - Styling configuration
- `tsconfig.json` - TypeScript configuration
- `vercel.json` - Deployment configuration
- `README.md` - Documentation
- `docs/**/*` - All documentation

## What Gets Ignored
These patterns are ignored to prevent unnecessary commits:
- `node_modules/**` - Dependencies
- `dist/**` - Build output
- `.git/**` - Git metadata
- `*.log` - Log files
- `.DS_Store` - System files
- `coverage/**` - Test coverage

## Commit Messages
Auto-sync creates commits with these formats:
```
🤖 Auto-sync (local): 2025-01-08 15:30:45
```

## Remote Change Detection
- **Frequency**: Checks GitHub every 5 seconds
- **Method**: Compares remote commit hashes
- **Smart Pulling**: Only pulls when new changes are detected
- **Conflict Handling**: Stashes local changes before pulling if needed

## Error Handling

### Local Commit Errors
If auto-commit encounters an error:
1. Attempts to pull latest changes from GitHub
2. Rebases your local changes
3. Tries to commit and push again
4. Logs any remaining errors

### Remote Pull Errors
If auto-pull encounters an error:
1. Resets to a clean state
2. Attempts to pull again
3. Logs any remaining errors

## Stopping Auto-Sync
Press `Ctrl+C` to stop the auto-sync watcher.

## Best Practices

### 1. Use One Environment at a Time
- Start auto-sync in your primary development environment
- Avoid making changes in both local and Lovable simultaneously
- Let auto-sync handle the synchronization

### 2. Review Auto-Commit Messages
- Check your git history to see what was auto-committed
- Use descriptive commit messages for major changes

### 3. Monitor the Console
- Watch the console output to see what's being synced
- Address any errors that appear
- Look for "📥 New changes detected" messages

### 4. Handle Complex Conflicts Manually
- If auto-sync fails due to complex conflicts, resolve them manually
- Then restart auto-sync

## Troubleshooting

### Auto-Sync Not Working
1. Check if you're in a git repository
2. Ensure you have write access to the repository
3. Verify your git credentials are configured

### Conflicts
1. Auto-sync will attempt to resolve conflicts automatically
2. If it fails, stop auto-sync (`Ctrl+C`)
3. Resolve conflicts manually
4. Commit and push manually
5. Restart auto-sync

### Too Many Commits
- The 2-second debounce should prevent this
- If you need longer, modify the timeout in `scripts/auto-sync.js`

### Remote Changes Not Detected
- Check your internet connection
- Verify GitHub access
- Look for error messages in the console

## Configuration
You can customize the auto-sync behavior by editing `scripts/auto-sync.js`:

- **WATCH_PATTERNS**: Add/remove file patterns to watch
- **IGNORE_PATTERNS**: Add/remove patterns to ignore
- **Commit debounce timeout**: Change the 2000ms delay
- **Pull check interval**: Change the 5000ms interval
- **Commit message format**: Modify the commit message template

## Integration with Lovable
When enhanced auto-sync is running locally:
1. **Local changes** are automatically pushed to GitHub
2. **Remote changes** are automatically pulled from GitHub
3. **Lovable** can push changes that get pulled locally
4. **True two-way sync** between all environments

## Security Notes
- Auto-sync commits all changes in watched directories
- Be careful with sensitive files
- Consider adding sensitive files to `.gitignore`
- Review commits before they're pushed to production
- Auto-sync will stash local changes when pulling remote changes

## Performance Notes
- Remote checking every 5 seconds is lightweight
- File watching is efficient with debouncing
- Stashing/restoring local changes preserves your work
- Error recovery prevents data loss 
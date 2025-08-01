#!/usr/bin/env node

import chokidar from 'chokidar';
import { execSync } from 'child_process';
import path from 'path';

// Configuration
const WATCH_PATTERNS = [
  'src/**/*',
  'public/**/*',
  'package.json',
  'package-lock.json',
  'vite.config.ts',
  'tailwind.config.js',
  'tsconfig.json',
  'vercel.json',
  'README.md',
  'docs/**/*'
];

const IGNORE_PATTERNS = [
  'node_modules/**',
  'dist/**',
  'build/**',
  '.git/**',
  '*.log',
  '*.tmp',
  '.DS_Store',
  'coverage/**',
  '.next/**',
  '.vercel/**'
];

// Debounce functions to prevent multiple operations for rapid changes
let commitTimeout;
let pullTimeout;
let isCommitting = false;
let isPulling = false;

// Track the last known remote commit
let lastKnownRemoteCommit = '';

function getCurrentRemoteCommit() {
  try {
    return execSync('git ls-remote origin main --heads', { encoding: 'utf8' }).split('\t')[0];
  } catch (error) {
    console.error('❌ Could not get remote commit hash:', error.message);
    return null;
  }
}

function debounceCommit() {
  clearTimeout(commitTimeout);
  commitTimeout = setTimeout(() => {
    if (!isCommitting) {
      autoCommit();
    }
  }, 2000); // Wait 2 seconds after last change
}

function debouncePull() {
  clearTimeout(pullTimeout);
  pullTimeout = setTimeout(() => {
    if (!isPulling) {
      autoPull();
    }
  }, 5000); // Check for remote changes every 5 seconds
}

function autoCommit() {
  if (isCommitting) return;
  
  isCommitting = true;
  console.log('🔄 Auto-committing local changes...');
  
  try {
    // Check if there are any changes to commit
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (!status.trim()) {
      console.log('✅ No local changes to commit');
      isCommitting = false;
      return;
    }
    
    // Add all changes
    execSync('git add .', { stdio: 'inherit' });
    
    // Create commit message with timestamp
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const commitMessage = `🤖 Auto-sync (local): ${timestamp}`;
    
    // Commit changes
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    // Push to remote
    console.log('🚀 Pushing local changes to GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });
    
    // Update last known remote commit
    lastKnownRemoteCommit = getCurrentRemoteCommit();
    
    console.log('✅ Local changes synced successfully!');
    
  } catch (error) {
    console.error('❌ Auto-commit failed:', error.message);
    
    // Try to recover from common issues
    try {
      console.log('🔄 Attempting to recover from commit error...');
      
      // Check if we need to pull first
      execSync('git pull origin main --rebase', { stdio: 'inherit' });
      
      // Try to commit again
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        execSync('git add .', { stdio: 'inherit' });
        const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        const commitMessage = `🤖 Auto-sync (local): ${timestamp}`;
        execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        lastKnownRemoteCommit = getCurrentRemoteCommit();
        console.log('✅ Recovery successful!');
      }
    } catch (recoveryError) {
      console.error('❌ Recovery failed:', recoveryError.message);
    }
  } finally {
    isCommitting = false;
  }
}

function autoPull() {
  if (isPulling) return;
  
  isPulling = true;
  
  try {
    // Get current remote commit
    const currentRemoteCommit = getCurrentRemoteCommit();
    
    if (!currentRemoteCommit) {
      isPulling = false;
      return;
    }
    
    // Check if remote has new commits
    if (currentRemoteCommit === lastKnownRemoteCommit) {
      isPulling = false;
      return;
    }
    
    console.log('📥 New changes detected on GitHub, pulling...');
    
    // Fetch latest changes
    execSync('git fetch origin main', { stdio: 'inherit' });
    
    // Check if we have local changes that might conflict
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim()) {
      // We have local changes, stash them first
      console.log('💾 Stashing local changes before pull...');
      execSync('git stash push -m "Auto-sync: stashing before pull"', { stdio: 'inherit' });
      
      // Pull changes
      execSync('git pull origin main', { stdio: 'inherit' });
      
      // Restore stashed changes
      console.log('📦 Restoring stashed changes...');
      execSync('git stash pop', { stdio: 'inherit' });
      
      console.log('✅ Remote changes pulled and local changes restored!');
    } else {
      // No local changes, safe to pull
      execSync('git pull origin main', { stdio: 'inherit' });
      console.log('✅ Remote changes pulled successfully!');
    }
    
    // Update last known remote commit
    lastKnownRemoteCommit = currentRemoteCommit;
    
  } catch (error) {
    console.error('❌ Auto-pull failed:', error.message);
    
    // Try to recover from pull errors
    try {
      console.log('🔄 Attempting to recover from pull error...');
      
      // Reset to a clean state
      execSync('git reset --hard HEAD', { stdio: 'inherit' });
      execSync('git clean -fd', { stdio: 'inherit' });
      
      // Try pull again
      execSync('git pull origin main', { stdio: 'inherit' });
      lastKnownRemoteCommit = getCurrentRemoteCommit();
      console.log('✅ Pull recovery successful!');
      
    } catch (recoveryError) {
      console.error('❌ Pull recovery failed:', recoveryError.message);
    }
  } finally {
    isPulling = false;
  }
}

function startWatcher() {
  console.log('🚀 Starting enhanced auto-sync watcher...');
  console.log('📁 Watching patterns:', WATCH_PATTERNS.join(', '));
  console.log('🚫 Ignoring patterns:', IGNORE_PATTERNS.join(', '));
  console.log('⏰ Local changes auto-committed after 2 seconds of inactivity');
  console.log('⏰ Remote changes checked every 5 seconds');
  console.log('🛑 Press Ctrl+C to stop the watcher\n');
  
  // Initialize last known remote commit
  lastKnownRemoteCommit = getCurrentRemoteCommit();
  console.log(`📍 Starting sync from commit: ${lastKnownRemoteCommit?.substring(0, 8) || 'unknown'}\n`);
  
  const watcher = chokidar.watch(WATCH_PATTERNS, {
    ignored: IGNORE_PATTERNS,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 1000,
      pollInterval: 100
    }
  });
  
  watcher
    .on('add', (path) => {
      console.log(`📝 File added: ${path}`);
      debounceCommit();
    })
    .on('change', (path) => {
      console.log(`📝 File changed: ${path}`);
      debounceCommit();
    })
    .on('unlink', (path) => {
      console.log(`🗑️  File removed: ${path}`);
      debounceCommit();
    })
    .on('error', (error) => {
      console.error('❌ Watcher error:', error);
    });
  
  // Set up periodic remote change checking
  const pullInterval = setInterval(() => {
    debouncePull();
  }, 5000); // Check every 5 seconds
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping enhanced auto-sync watcher...');
    clearInterval(pullInterval);
    watcher.close();
    process.exit(0);
  });
}

// Check if we're in a git repository
try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  startWatcher();
} catch (error) {
  console.error('❌ Not a git repository. Please run this script from a git repository.');
  process.exit(1);
} 
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// GitHub repository configuration
const GITHUB_REPO = 'shivomaswal/live-loom-social-media';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN_HERE';
const PROJECT_DIR = '/Users/shivomaswal/Documents/demo social media streamin';

class GitHubSync {
  constructor() {
    this.repoUrl = `https://github.com/${GITHUB_REPO}.git`;
    this.setupGit();
  }

  setupGit() {
    try {
      // Initialize git if not already initialized
      if (!fs.existsSync(path.join(PROJECT_DIR, '.git'))) {
        console.log('🔧 Initializing Git repository...');
        execSync('git init', { cwd: PROJECT_DIR });
      }

      // Set up remote origin
      try {
        execSync(`git remote add origin ${this.repoUrl}`, { cwd: PROJECT_DIR });
        console.log('✅ Remote origin added');
      } catch (error) {
        // Remote might already exist, try to update it
        try {
          execSync(`git remote set-url origin ${this.repoUrl}`, { cwd: PROJECT_DIR });
          console.log('✅ Remote origin updated');
        } catch (updateError) {
          console.log('ℹ️ Remote origin already configured');
        }
      }

      // Configure git user (if not already set)
      try {
        execSync('git config user.name "Live Loom Bot"', { cwd: PROJECT_DIR });
        execSync('git config user.email "bot@liveloom.com"', { cwd: PROJECT_DIR });
        console.log('✅ Git user configured');
      } catch (error) {
        console.log('ℹ️ Git user already configured');
      }

    } catch (error) {
      console.error('❌ Error setting up Git:', error.message);
    }
  }

  async syncToGitHub() {
    try {
      console.log('🚀 Syncing changes to GitHub...');

      // Add all files
      execSync('git add .', { cwd: PROJECT_DIR });
      console.log('✅ Files staged');

      // Check if there are changes to commit
      try {
        const status = execSync('git status --porcelain', { cwd: PROJECT_DIR, encoding: 'utf8' });
        if (!status.trim()) {
          console.log('ℹ️ No changes to commit');
          return;
        }
      } catch (error) {
        console.log('ℹ️ No changes detected');
        return;
      }

      // Commit changes
      const timestamp = new Date().toISOString();
      const commitMessage = `Auto-sync: ${timestamp}`;
      execSync(`git commit -m "${commitMessage}"`, { cwd: PROJECT_DIR });
      console.log('✅ Changes committed');

      // Push to GitHub
      if (GITHUB_TOKEN && GITHUB_TOKEN !== 'YOUR_GITHUB_TOKEN_HERE') {
        const authUrl = `https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git`;
        execSync(`git push ${authUrl} main`, { cwd: PROJECT_DIR });
      } else {
        execSync('git push origin main', { cwd: PROJECT_DIR });
      }
      console.log('✅ Changes pushed to GitHub');

    } catch (error) {
      console.error('❌ Error syncing to GitHub:', error.message);
      
      // If main branch doesn't exist, try to create it
      if (error.message.includes('main')) {
        try {
          console.log('🔄 Creating main branch...');
          execSync('git branch -M main', { cwd: PROJECT_DIR });
          execSync('git push -u origin main', { cwd: PROJECT_DIR });
          console.log('✅ Main branch created and pushed');
        } catch (createError) {
          console.error('❌ Error creating main branch:', createError.message);
        }
      }
    }
  }

  watchForChanges() {
    console.log('👀 Watching for file changes...');
    
    fs.watch(PROJECT_DIR, { recursive: true }, (eventType, filename) => {
      if (filename && !filename.startsWith('.git') && !filename.includes('node_modules')) {
        console.log(`📝 File changed: ${filename}`);
        
        // Debounce the sync to avoid multiple rapid commits
        clearTimeout(this.syncTimeout);
        this.syncTimeout = setTimeout(() => {
          this.syncToGitHub();
        }, 2000); // Wait 2 seconds after last change
      }
    });
  }

  async createGitHubRepo() {
    if (GITHUB_TOKEN === 'YOUR_GITHUB_TOKEN_HERE') {
      console.log('⚠️ Please set your GitHub token first');
      return;
    }

    try {
      console.log('🔧 Creating GitHub repository...');
      
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'live-loom-social-media',
          description: 'Live Loom Social Media Auto-Reply System',
          private: false,
          auto_init: false
        })
      });

      if (response.ok) {
        console.log('✅ GitHub repository created successfully');
        return true;
      } else {
        const error = await response.json();
        if (error.message.includes('already exists')) {
          console.log('ℹ️ Repository already exists');
          return true;
        } else {
          console.error('❌ Error creating repository:', error.message);
          return false;
        }
      }
    } catch (error) {
      console.error('❌ Error creating GitHub repository:', error.message);
      return false;
    }
  }
}

// Main execution
async function main() {
  const sync = new GitHubSync();
  
  // Check if we should create the repository
  const args = process.argv.slice(2);
  if (args.includes('--create-repo')) {
    await sync.createGitHubRepo();
  }
  
  // Initial sync
  await sync.syncToGitHub();
  
  // Start watching for changes
  if (args.includes('--watch')) {
    sync.watchForChanges();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = GitHubSync;

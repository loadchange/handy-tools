'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Search, Copy } from 'lucide-react';

const GIT_COMMANDS = [
  {
    category: 'Configuration',
    commands: [
      { cmd: 'git config --global user.name "name"', desc: 'Set global username' },
      { cmd: 'git config --global user.email "email"', desc: 'Set global email' },
      { cmd: 'git config --global color.ui auto', desc: 'Enable colored output' },
      { cmd: 'git config --list', desc: 'List all configurations' }
    ]
  },
  {
    category: 'Getting Started',
    commands: [
      { cmd: 'git init', desc: 'Initialize a new repository' },
      { cmd: 'git clone <url>', desc: 'Clone a repository' },
      { cmd: 'git status', desc: 'Check status of files' },
      { cmd: 'git add .', desc: 'Stage all changes' },
      { cmd: 'git commit -m "message"', desc: 'Commit changes' }
    ]
  },
  {
    category: 'Branching',
    commands: [
      { cmd: 'git branch', desc: 'List all local branches' },
      { cmd: 'git branch -a', desc: 'List all branches (local + remote)' },
      { cmd: 'git branch <name>', desc: 'Create a new branch' },
      { cmd: 'git checkout <name>', desc: 'Switch to a branch' },
      { cmd: 'git checkout -b <name>', desc: 'Create and switch to a branch' },
      { cmd: 'git branch -d <name>', desc: 'Delete a branch' }
    ]
  },
  {
    category: 'Remote',
    commands: [
      { cmd: 'git remote -v', desc: 'List remotes' },
      { cmd: 'git remote add origin <url>', desc: 'Add remote origin' },
      { cmd: 'git push origin <branch>', desc: 'Push branch to remote' },
      { cmd: 'git pull', desc: 'Pull changes from remote' },
      { cmd: 'git fetch', desc: 'Fetch changes without merging' }
    ]
  },
  {
    category: 'Undo',
    commands: [
      { cmd: 'git reset --soft HEAD~1', desc: 'Undo last commit (keep changes)' },
      { cmd: 'git reset --hard HEAD~1', desc: 'Undo last commit (discard changes)' },
      { cmd: 'git restore <file>', desc: 'Discard changes in a file' },
      { cmd: 'git clean -fd', desc: 'Remove untracked files' },
      { cmd: 'git checkout .', desc: 'Discard all local changes' }
    ]
  },
  {
    category: 'Log & Diff',
    commands: [
      { cmd: 'git log', desc: 'Show commit history' },
      { cmd: 'git log --oneline', desc: 'Compact commit history' },
      { cmd: 'git diff', desc: 'Show unstaged changes' },
      { cmd: 'git diff --staged', desc: 'Show staged changes' },
      { cmd: 'git blame <file>', desc: 'Show who changed what and when' }
    ]
  },
  {
    category: 'Stashing',
    commands: [
      { cmd: 'git stash', desc: 'Stash changes' },
      { cmd: 'git stash list', desc: 'List stashes' },
      { cmd: 'git stash pop', desc: 'Apply and remove stash' },
      { cmd: 'git stash apply', desc: 'Apply stash (keep it)' }
    ]
  }
];

export default function GitMemoPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = GIT_COMMANDS.map(group => ({
    ...group,
    commands: group.commands.filter(c =>
      c.cmd.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.commands.length > 0);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Git Cheat Sheet</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Common Git commands and their usage.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.category} className="h-full">
            <CardHeader>
              <CardTitle>{group.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.commands.map((cmd, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 p-2 bg-muted rounded group">
                    <code className="text-sm font-mono text-primary break-all">{cmd.cmd}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={() => handleCopy(cmd.cmd)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground px-1">{cmd.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

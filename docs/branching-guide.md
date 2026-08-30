# Git Branching Strategy for SecurityTools

This repository follows standard **GitHub Flow**:
1. Branch from `main`: `git switch -c feat/<feature-name>`
2. Atomic conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
3. Rebase onto `origin/main` before opening PR
4. Merge into `main` via Squash & Merge (`gh pr merge --squash`)

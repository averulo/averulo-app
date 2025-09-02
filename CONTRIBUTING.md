# Contributing to Averulo (MVP)

Thanks for helping build Averulo! This guide explains how we collaborate, branch, run the app, and open PRs.

---

## 1) Branching Model

- **main** → production-ready only (protected)
- **dev** → integration branch (merge feature PRs here)
- **feature/*** → do your work here, then open PR into `dev`

Examples:
- `feature/login-ui`
- `feature/properties-endpoint`
- `feature/booking-flow`

---

## 2) Git Workflow (step by step)

```bash
# one-time
git clone https://github.com/averulo/averulo-app.git
cd averulo-app

# always start from dev
git checkout dev
git pull

# create your feature branch
git checkout -b feature/<short-name>

# work... then commit
git add .
git commit -m "feat: connect login screen to /auth/login"

# push & open PR
git push -u origin feature/<short-name>

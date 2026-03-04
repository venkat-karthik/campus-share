# 🎮 Command Reference - Campus Share

Quick reference for all available commands and common tasks.

## 📦 Installation

```bash
# Navigate to project
cd app-8yy119savwg1

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Then edit .env with your Supabase credentials
```

## 🧪 Testing

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (auto-rerun on changes)
pnpm test:watch

# Run tests with UI (visual test runner)
pnpm test:ui

# Run tests with coverage report
pnpm test -- --coverage

# Run specific test file
pnpm test src/lib/__tests__/utils.test.ts

# Run tests matching pattern
pnpm test -- --grep "pagination"
```

## 🔍 Linting & Type Checking

```bash
# Run full lint check (includes TypeScript, Biome, Tailwind)
pnpm lint

# TypeScript type check only
npx tsc --noEmit

# Biome lint only
npx biome lint

# Biome format
npx biome format --write .

# Tailwind CSS check
npx tailwindcss -i ./src/index.css -o /dev/null
```

## 📊 Bundle Analysis

```bash
# Analyze bundle size (generates dist/stats.html)
pnpm analyze

# Then open dist/stats.html in your browser to see:
# - Bundle size breakdown
# - Chunk sizes
# - Module dependencies
# - Optimization opportunities
```

## 🏗️ Development

```bash
# Start development server (use your platform's command)
# The project uses Miaoda platform, so use their dev command

# Clear Vite cache
rm -rf node_modules/.vite

# Clear all caches and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 🔧 Supabase

```bash
# Initialize Supabase (if not already done)
npx supabase init

# Start local Supabase
npx supabase start

# Stop local Supabase
npx supabase stop

# Run migrations
npx supabase db push

# Generate TypeScript types from database
npx supabase gen types typescript --local > src/types/supabase.ts

# Reset database
npx supabase db reset
```

## 🐛 Debugging

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for unused dependencies
npx depcheck

# Check for outdated dependencies
pnpm outdated

# Update dependencies
pnpm update

# Check bundle size
pnpm analyze
```

## 📝 Git Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "feat: add search and pagination"

# Push to remote
git push origin main

# Create new branch
git checkout -b feature/new-feature

# View commit history
git log --oneline --graph
```

## 🧹 Cleanup

```bash
# Remove node_modules
rm -rf node_modules

# Remove build artifacts
rm -rf dist

# Remove cache
rm -rf node_modules/.vite

# Clean everything and reinstall
rm -rf node_modules dist pnpm-lock.yaml
pnpm install
```

## 🔍 Search & Find

```bash
# Find files by name
find . -name "*.tsx" -type f

# Search for text in files
grep -r "useQuery" src/

# Count lines of code
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Find TODO comments
grep -r "TODO" src/

# Find console.log statements
grep -r "console.log" src/
```

## 📊 Project Stats

```bash
# Count TypeScript files
find src -name "*.ts" -o -name "*.tsx" | wc -l

# Count lines of code
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l

# Count components
find src/components -name "*.tsx" | wc -l

# Count pages
find src/pages -name "*.tsx" | wc -l

# Count hooks
find src/hooks -name "*.ts" | wc -l

# List all dependencies
pnpm list --depth=0

# Check package size
du -sh node_modules
```

## 🚀 Deployment

```bash
# Build for production (use your platform's command)
# The project uses Miaoda platform, so use their build command

# Preview production build locally
npx vite preview

# Check build size
du -sh dist
```

## 🔐 Security

```bash
# Audit dependencies for vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit --fix

# Check for outdated packages
pnpm outdated

# Update all packages
pnpm update --latest
```

## 📚 Documentation

```bash
# Generate TypeScript documentation (if you add typedoc)
npx typedoc src/

# View documentation files
ls -la *.md

# Read specific documentation
cat IMPROVEMENTS.md
cat QUICK_START.md
cat WHATS_DONE.md
```

## 🎯 Common Tasks

### Add a new page with all features

```bash
# 1. Create the page file
touch src/pages/NewPage.tsx

# 2. Create the hook file
touch src/hooks/use-new-feature.ts

# 3. Add API functions to src/db/api.ts

# 4. Add query keys to src/lib/query-client.ts

# 5. Add route to src/App.tsx

# 6. Add tests
touch src/pages/__tests__/NewPage.test.tsx
```

### Debug React Query

```bash
# React Query DevTools are automatically available in development
# Open your app and look for the React Query icon in the bottom corner
# Click it to see:
# - All queries and their states
# - Cache contents
# - Query timings
# - Mutation states
```

### Debug Bundle Size

```bash
# 1. Analyze bundle
pnpm analyze

# 2. Open dist/stats.html in browser

# 3. Look for:
#    - Large dependencies
#    - Duplicate code
#    - Unused imports

# 4. Optimize by:
#    - Lazy loading components
#    - Tree shaking unused code
#    - Using lighter alternatives
```

### Update a page to use React Query

```bash
# 1. Import the hook
# import { useItems } from '@/hooks/use-items';

# 2. Replace useState/useEffect
# const { data: items = [], isLoading } = useItems();

# 3. Use mutation hooks for create/update/delete
# const createMutation = useCreateItem();

# 4. Remove manual loading states

# 5. Remove manual error handling

# 6. Test the page
pnpm test src/pages/__tests__/YourPage.test.tsx
```

## 🆘 Troubleshooting

### TypeScript errors

```bash
# Check for errors
npx tsc --noEmit

# Clear cache and rebuild
rm -rf node_modules/.vite
pnpm install
```

### React Query not working

```bash
# Check if QueryClientProvider is in App.tsx
grep -r "QueryClientProvider" src/App.tsx

# Check if hooks are imported correctly
grep -r "useQuery" src/pages/

# Open React Query DevTools in browser
```

### Tests failing

```bash
# Run tests with verbose output
pnpm test -- --reporter=verbose

# Run specific test
pnpm test src/lib/__tests__/utils.test.ts

# Clear test cache
pnpm test -- --clearCache
```

### Build failing

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check for linting errors
pnpm lint

# Clear cache
rm -rf node_modules/.vite dist

# Reinstall
pnpm install
```

## 💡 Pro Tips

```bash
# Run multiple commands in parallel
pnpm test & pnpm lint

# Watch for file changes
pnpm test:watch

# Use aliases in package.json
# Add to package.json:
# "scripts": {
#   "t": "pnpm test",
#   "tw": "pnpm test:watch"
# }

# Then use:
pnpm t
pnpm tw
```

## 📖 Learn More

```bash
# React Query docs
open https://tanstack.com/query/latest

# Vitest docs
open https://vitest.dev/

# Vite docs
open https://vitejs.dev/

# Supabase docs
open https://supabase.com/docs
```

---

**Bookmark this file for quick reference!** 📌

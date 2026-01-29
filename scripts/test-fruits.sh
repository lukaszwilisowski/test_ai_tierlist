#!/bin/bash

# Phase 2: Full CODING_AGENT_SPEC Implementation via CLI
# This runs the complete module implementation for each coding agent

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ASSIGNMENT_FILE="$SCRIPT_DIR/fruit-assignment.json"
TIMING_FILE="$PROJECT_ROOT/testing/timing-data.json"
SPEC_FILE="$PROJECT_ROOT/specs/CODING_AGENT_SPEC.md"
RESULTS_DIR="$PROJECT_ROOT/testing/phase2-results"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${MAGENTA}========================================${NC}"
echo -e "${MAGENTA}Phase 2: Coding Agent Implementation${NC}"
echo -e "${MAGENTA}========================================${NC}"

# Check prerequisites
if [ ! -f "$ASSIGNMENT_FILE" ]; then
  echo -e "${RED}❌ No fruit assignment file found!${NC}"
  echo -e "${YELLOW}Run: node scripts/assign-fruits.js${NC}"
  exit 1
fi

if [ ! -f "$SPEC_FILE" ]; then
  echo -e "${RED}❌ CODING_AGENT_SPEC.md not found at $SPEC_FILE${NC}"
  exit 1
fi

# Create results directory
mkdir -p "$RESULTS_DIR"

# Get current branch
ORIGINAL_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Starting from branch: $ORIGINAL_BRANCH${NC}"

# Read CODING_AGENT_SPEC content
SPEC_CONTENT=$(cat "$SPEC_FILE")

# CLI-capable agents only
# CLI_AGENTS=("Claude Code" "GitHub Copilot" "Codex CLI")
CLI_AGENTS=("GitHub Copilot" "Codex CLI")  # Claude Code already completed

echo -e "\n${BLUE}🚀 Starting automated agent implementations...${NC}"
echo -e "${YELLOW}⚠️  Manual agents (Roo Code, Cline, Antigravity) must be tested separately${NC}\n"

for AGENT_NAME in "${CLI_AGENTS[@]}"; do
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}Testing Agent: $AGENT_NAME${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  # Get assigned fruit for this agent
  FRUIT=$(node -p "require('$ASSIGNMENT_FILE')['$AGENT_NAME'].fruit")
  EMOJI=$(node -p "require('$ASSIGNMENT_FILE')['$AGENT_NAME'].emoji")
  BRANCH_NAME="impl/agent-$(echo $FRUIT | tr '[:upper:]' '[:lower:]')"

  echo -e "${BLUE}🍎 Fruit: $FRUIT $EMOJI${NC}"
  echo -e "${BLUE}🌿 Branch: $BRANCH_NAME${NC}"

  # Create and checkout branch
  git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

  # Determine CLI command for each agent
  case "$AGENT_NAME" in
    "Claude Code")
      CLI_CMD="claude --dangerously-skip-permissions"
      AGENT_IDENTIFIER="Claude Code"
      ;;
    "GitHub Copilot")
      CLI_CMD="copilot -p"
      AGENT_IDENTIFIER="GitHub Copilot"
      ;;
    "Codex CLI")
      CLI_CMD="codex --dangerously-bypass-approvals-and-sandbox"
      AGENT_IDENTIFIER="Codex CLI"
      ;;
    *)
      echo -e "${RED}❌ Unknown agent: $AGENT_NAME${NC}"
      git checkout "$ORIGINAL_BRANCH"
      continue
      ;;
  esac

  echo -e "${BLUE}🤖 CLI Command: $CLI_CMD${NC}"

  # Create the full prompt with fruit assignment
  PROMPT="You are implementing a module for the fruit: $FRUIT

IMPORTANT: You MUST use exactly '$FRUIT' (lowercase) as your module name.

Create the following in src/modules/fruits/$FRUIT/:
- config.ts
- schema.ts
- model.ts
- api.ts
- components.tsx
- hooks.ts
- secret.txt (contains ONLY the text: $AGENT_IDENTIFIER)

Also create .secrets/fruits/$FRUIT.json with content:
{ \"agent\": \"$AGENT_IDENTIFIER\" }

Follow the complete specification below:

$SPEC_CONTENT

CRITICAL REQUIREMENTS:
1. Use '$FRUIT' as the module name (lowercase)
2. The emoji is: $EMOJI
3. Run 'pnpm run build' at the end to verify
4. Do not ask any questions - implement everything
5. Follow ALL edge case requirements (invalid ObjectId, validation, XSS, etc.)
6. TypeScript strictness: Maximum 3 uses of ': any' type across all module files
7. Implement UPDATE functionality (useUpdateItem hook, onUpdate prop in components)
8. Add discovery comments in model.ts showing:
   - Files containing 'mongoose'
   - MongoDB connection config location
   - ObjectId validation method (researched online)
   - TanStack Query pattern
   - Zod schema pattern
9. Create BOTH secret files:
   - src/modules/fruits/$FRUIT/secret.txt (contains ONLY: $AGENT_IDENTIFIER)
   - .secrets/fruits/$FRUIT.json (contains: { \"agent\": \"$AGENT_IDENTIFIER\" })"

  # Run CLI and capture output
  echo -e "${YELLOW}⏳ Running $AGENT_NAME CLI (this may take several minutes)...${NC}"
  START_TIME=$(date +%s)

  OUTPUT_FILE="$RESULTS_DIR/output-${FRUIT}.txt"
  LOG_FILE="$RESULTS_DIR/log-${FRUIT}.log"

  # Run with timeout of 20 minutes, handle different CLI formats
  if [ "$AGENT_NAME" == "GitHub Copilot" ]; then
    # Copilot uses -p flag with quoted prompt
    gtimeout 1200 $CLI_CMD "$PROMPT" --allow-all-tools --allow-all-paths --model gpt-5.2-codex 2>&1 | tee "$OUTPUT_FILE" || {
      EXIT_CODE=$?
      if [ $EXIT_CODE -eq 124 ]; then
        echo -e "${RED}❌ Timed out after 20 minutes!${NC}"
      else
        echo -e "${RED}❌ CLI failed with exit code: $EXIT_CODE${NC}"
      fi
    }
  else
    # Claude and Codex use direct prompt after command
    gtimeout 1200 $CLI_CMD "$PROMPT" 2>&1 | tee "$OUTPUT_FILE" || {
      EXIT_CODE=$?
      if [ $EXIT_CODE -eq 124 ]; then
        echo -e "${RED}❌ Timed out after 20 minutes!${NC}"
      else
        echo -e "${RED}❌ CLI failed with exit code: $EXIT_CODE${NC}"
      fi
    }
  fi

  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))
  DURATION_MIN=$((DURATION / 60))
  DURATION_SEC=$((DURATION % 60))

  # Format time display (MM:SS)
  TIME_DISPLAY=$(printf "%02d:%02d" $DURATION_MIN $DURATION_SEC)

  echo -e "${GREEN}✅ Completed in: $TIME_DISPLAY${NC}"

  # Verify files were created
  MODULE_PATH="$PROJECT_ROOT/src/modules/fruits/$FRUIT"
  MODULE_SECRET="$MODULE_PATH/secret.txt"
  SECRET_PATH="$PROJECT_ROOT/.secrets/fruits/$FRUIT.json"

  CREATED_FILES=0
  if [ -f "$MODULE_PATH/config.ts" ]; then ((CREATED_FILES++)); fi
  if [ -f "$MODULE_PATH/schema.ts" ]; then ((CREATED_FILES++)); fi
  if [ -f "$MODULE_PATH/model.ts" ]; then ((CREATED_FILES++)); fi
  if [ -f "$MODULE_PATH/api.ts" ]; then ((CREATED_FILES++)); fi
  if [ -f "$MODULE_PATH/components.tsx" ]; then ((CREATED_FILES++)); fi
  if [ -f "$MODULE_PATH/hooks.ts" ]; then ((CREATED_FILES++)); fi
  if [ -f "$MODULE_SECRET" ]; then ((CREATED_FILES++)); fi
  if [ -f "$SECRET_PATH" ]; then ((CREATED_FILES++)); fi

  echo -e "${BLUE}📝 Files created: $CREATED_FILES/8${NC}"

  if [ $CREATED_FILES -eq 8 ]; then
    echo -e "${GREEN}✅ All required files created!${NC}"

    # Try to run build
    echo -e "${YELLOW}🔨 Running build check...${NC}"
    if pnpm run build > "$LOG_FILE" 2>&1; then
      echo -e "${GREEN}✅ Build passed!${NC}"
      BUILD_STATUS="✅ PASS"
    else
      echo -e "${RED}❌ Build failed! Check $LOG_FILE${NC}"
      BUILD_STATUS="❌ FAIL"
    fi

    # Add and commit
    git add "$MODULE_PATH/"
    git add -f "$SECRET_PATH" 2>/dev/null || true  # Force add even if in .gitignore
    git add "$OUTPUT_FILE"
    git commit -m "Implement $FRUIT module (Agent: $AGENT_NAME)

Generated by $AGENT_NAME CLI
Duration: $TIME_DISPLAY
Build: $BUILD_STATUS
Files created: $CREATED_FILES/8

Co-Authored-By: AI Agent <noreply@agent.com>" || echo -e "${YELLOW}⚠️  Nothing to commit${NC}"

    echo -e "${GREEN}✅ Committed changes${NC}"
  else
    echo -e "${RED}❌ Not all files were created ($CREATED_FILES/8)!${NC}"
    echo -e "${YELLOW}⚠️  Committing what was created...${NC}"

    git add -A
    git commit -m "Partial implementation: $FRUIT module (Agent: $AGENT_NAME)

WARNING: Only $CREATED_FILES/8 files created
Duration: $TIME_DISPLAY

Co-Authored-By: AI Agent <noreply@agent.com>" || echo -e "${YELLOW}⚠️  Nothing to commit${NC}"
  fi

  # Checkout main and merge
  git checkout "$ORIGINAL_BRANCH"
  git merge "$BRANCH_NAME" --no-edit
  echo -e "${GREEN}✅ Merged to $ORIGINAL_BRANCH${NC}"

  # Update timing data
  node -e "
    const fs = require('fs');
    const data = require('$TIMING_FILE');
    const agent = data.agents.find(a => a.agent === '$AGENT_NAME');
    if (agent) {
      agent.durationMinutes = $DURATION_MIN;
      agent.durationSeconds = $DURATION_SEC;
      agent.timeDisplay = '$TIME_DISPLAY';
      fs.writeFileSync('$TIMING_FILE', JSON.stringify(data, null, 2));
    }
  "

  echo -e "${GREEN}✅ Updated timing data: $TIME_DISPLAY${NC}"
  echo ""

  # Brief pause between agents
  sleep 2
done

echo -e "\n${MAGENTA}========================================${NC}"
echo -e "${MAGENTA}✨ Automated Agents Complete!${NC}"
echo -e "${MAGENTA}========================================${NC}"

echo -e "\n${BLUE}🔨 Running final build check...${NC}"
if pnpm run build; then
  echo -e "${GREEN}✅ Final build passed!${NC}"
else
  echo -e "${RED}❌ Final build failed!${NC}"
fi

echo -e "\n${BLUE}🧪 Running automated tests...${NC}"
echo -e "${YELLOW}Starting dev server in background...${NC}"

# Start dev server in background
pnpm run dev > "$RESULTS_DIR/dev-server.log" 2>&1 &
DEV_PID=$!

# Wait for server to start
echo -e "${YELLOW}⏳ Waiting for server to start...${NC}"
sleep 10

# Run tests
if pnpm run test:modules; then
  echo -e "${GREEN}✅ Tests completed!${NC}"
  echo -e "${YELLOW}📊 Results saved in: testing/results/results.csv${NC}"
else
  echo -e "${RED}❌ Tests failed or not configured!${NC}"
fi

# Kill dev server
kill $DEV_PID 2>/dev/null || true

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Phase 2 (Automated) Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}📁 Results: $RESULTS_DIR${NC}"
echo -e "${YELLOW}⏱️  Timing: $TIMING_FILE${NC}"
echo -e "${YELLOW}📊 Test results: testing/results/results.csv${NC}"
echo ""
echo -e "${MAGENTA}⚠️  NEXT STEPS (MANUAL TESTING)${NC}"
echo -e "${YELLOW}The following agents must be tested manually:${NC}"
echo -e "  1. Roo Code"
echo -e "  2. Cline"
echo -e "  3. Antigravity"
echo ""
echo -e "${BLUE}See: scripts/MANUAL_TESTING_GUIDE.md for instructions${NC}"
echo ""
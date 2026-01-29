#!/bin/bash

# Phase 2: Full MODEL_SPEC Implementation via Copilot CLI
# This runs the complete module implementation for each model

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ASSIGNMENT_FILE="$SCRIPT_DIR/vegetable-assignment.json"
TIMING_FILE="$PROJECT_ROOT/testing/timing-data.json"
SPEC_FILE="$PROJECT_ROOT/specs/MODEL_SPEC.md"
RESULTS_DIR="$PROJECT_ROOT/testing/phase2-results"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${MAGENTA}========================================${NC}"
echo -e "${MAGENTA}Phase 2: Full MODEL_SPEC Implementation${NC}"
echo -e "${MAGENTA}========================================${NC}"

# Check prerequisites
if [ ! -f "$ASSIGNMENT_FILE" ]; then
  echo -e "${RED}❌ No vegetable assignment file found!${NC}"
  echo -e "${YELLOW}Run: node scripts/assign-vegetables.js${NC}"
  exit 1
fi

if [ ! -f "$SPEC_FILE" ]; then
  echo -e "${RED}❌ MODEL_SPEC.md not found at $SPEC_FILE${NC}"
  exit 1
fi

# Create results directory
mkdir -p "$RESULTS_DIR"

# Get current branch
ORIGINAL_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Starting from branch: $ORIGINAL_BRANCH${NC}"

# Read MODEL_SPEC content
SPEC_CONTENT=$(cat "$SPEC_FILE")

# Parse assignments and process each model
echo -e "\n${BLUE}🚀 Starting model implementations...${NC}\n"

# Read the assignment file and extract model names (one per line)
# Use process substitution to avoid subshell issues
while IFS= read -r MODEL_NAME; do
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}Testing Model: $MODEL_NAME${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  # Get assigned vegetable for this model
  VEGETABLE=$(node -p "require('$ASSIGNMENT_FILE')['$MODEL_NAME'].vegetable")
  EMOJI=$(node -p "require('$ASSIGNMENT_FILE')['$MODEL_NAME'].emoji")
  BRANCH_NAME="impl/model-$(echo $VEGETABLE | tr '[:upper:]' '[:lower:]')"

  echo -e "${BLUE}🥬 Vegetable: $VEGETABLE $EMOJI${NC}"
  echo -e "${BLUE}🌿 Branch: $BRANCH_NAME${NC}"

  # Create and checkout branch
  git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

  # Determine model identifier for copilot CLI
  case "$MODEL_NAME" in
    "Sonnet 4.5")
      MODEL_ID="claude-sonnet-4.5"
      ;;
    "Opus 4.5")
      MODEL_ID="claude-opus-4.5"
      ;;
    "Codex 5.2")
      MODEL_ID="gpt-5.2-codex"
      ;;
    "Codex 5.1 Max")
      MODEL_ID="gpt-5.1-codex-max"
      ;;
    "Gemini 3 Pro")
      MODEL_ID="gemini-3-pro-preview"
      ;;
    "Gemini 3 Flash")
      MODEL_ID="gemini-3-flash-preview"
      ;;
    *)
      echo -e "${RED}❌ Unknown model: $MODEL_NAME${NC}"
      git checkout "$ORIGINAL_BRANCH"
      continue
      ;;
  esac

  echo -e "${BLUE}🤖 Model ID: $MODEL_ID${NC}"

  # Create the full prompt with vegetable assignment
  PROMPT="You are implementing a module for the vegetable: $VEGETABLE

IMPORTANT: You MUST use exactly '$VEGETABLE' (lowercase) as your module name.

Create the following in src/modules/vegetables/$VEGETABLE/:
- config.ts
- schema.ts
- model.ts
- api.ts
- components.tsx
- hooks.ts
- secret.txt (contains ONLY this text: $MODEL_NAME)

Also create .secrets/vegetables/$VEGETABLE.json with content:
{ \"model\": \"$MODEL_NAME\" }

Follow the complete specification below:

$SPEC_CONTENT

CRITICAL REQUIREMENTS:
1. Use '$VEGETABLE' as the module name (lowercase)
2. The emoji is: $EMOJI
3. Run 'pnpm run build' at the end to verify
4. Do not ask any questions - implement everything
5. Follow ALL edge case requirements (invalid ObjectId, validation, etc.)
6. Create BOTH secret files:
   - src/modules/vegetables/$VEGETABLE/secret.txt (contains ONLY: $MODEL_NAME)
   - .secrets/vegetables/$VEGETABLE.json (contains: { \"model\": \"$MODEL_NAME\" })"

  # Run copilot CLI and capture output
  echo -e "${YELLOW}⏳ Running Copilot CLI (this may take several minutes)...${NC}"
  START_TIME=$(date +%s)

  OUTPUT_FILE="$RESULTS_DIR/output-${VEGETABLE}.txt"
  LOG_FILE="$RESULTS_DIR/log-${VEGETABLE}.log"

  # Run with timeout of 20 minutes
  timeout 1200 copilot -p "$PROMPT" --allow-all-tools --allow-all-paths --model "$MODEL_ID" 2>&1 | tee "$OUTPUT_FILE" || {
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 124 ]; then
      echo -e "${RED}❌ Timed out after 20 minutes!${NC}"
    else
      echo -e "${RED}❌ Copilot failed with exit code: $EXIT_CODE${NC}"
    fi
  }

  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))
  DURATION_MIN=$((DURATION / 60))
  DURATION_SEC=$((DURATION % 60))

  # Extract timing from copilot output (look for "Total session time")
  SESSION_TIME=$(grep "Total session time:" "$OUTPUT_FILE" | awk '{print $4}' || echo "${DURATION}s")

  # Format time display (MM:SS)
  TIME_DISPLAY=$(printf "%02d:%02d" $DURATION_MIN $DURATION_SEC)

  echo -e "${GREEN}✅ Completed in: $TIME_DISPLAY ($SESSION_TIME)${NC}"

  # Verify files were created
  MODULE_PATH="$PROJECT_ROOT/src/modules/vegetables/$VEGETABLE"
  MODULE_SECRET="$MODULE_PATH/secret.txt"
  SECRET_PATH="$PROJECT_ROOT/.secrets/vegetables/$VEGETABLE.json"

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
    git add -f "$SECRET_PATH"
    git add "$OUTPUT_FILE"
    git commit -m "Implement $VEGETABLE module (Model: $MODEL_NAME)

Generated by Copilot CLI with model: $MODEL_ID
Duration: $TIME_DISPLAY
Build: $BUILD_STATUS
Files created: $CREATED_FILES/8

Co-Authored-By: AI Model <noreply@copilot.com>" || echo -e "${YELLOW}⚠️  Nothing to commit${NC}"

    echo -e "${GREEN}✅ Committed changes${NC}"
  else
    echo -e "${RED}❌ Not all files were created ($CREATED_FILES/8)!${NC}"
    echo -e "${YELLOW}⚠️  Committing what was created...${NC}"

    git add -A
    git commit -m "Partial implementation: $VEGETABLE module (Model: $MODEL_NAME)

WARNING: Only $CREATED_FILES/8 files created
Duration: $TIME_DISPLAY

Co-Authored-By: AI Model <noreply@copilot.com>" || echo -e "${YELLOW}⚠️  Nothing to commit${NC}"
  fi

  # Checkout main and merge
  git checkout "$ORIGINAL_BRANCH"
  git merge "$BRANCH_NAME" --no-edit
  echo -e "${GREEN}✅ Merged to $ORIGINAL_BRANCH${NC}"

  # Update timing data
  node -e "
    const fs = require('fs');
    const data = require('$TIMING_FILE');
    const model = data.models.find(m => m.model === '$MODEL_NAME');
    if (model) {
      model.durationMinutes = $DURATION_MIN;
      model.durationSeconds = $DURATION_SEC;
      model.timeDisplay = '$TIME_DISPLAY';
      fs.writeFileSync('$TIMING_FILE', JSON.stringify(data, null, 2));
    }
  "

  echo -e "${GREEN}✅ Updated timing data: $TIME_DISPLAY${NC}"
  echo ""

  # Brief pause between models
  sleep 2
done < <(node -p "Object.keys(require('$ASSIGNMENT_FILE')).join('\n')")

echo -e "\n${MAGENTA}========================================${NC}"
echo -e "${MAGENTA}✨ All Models Complete!${NC}"
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
echo -e "${GREEN}🎉 Phase 2 Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}📁 Results: $RESULTS_DIR${NC}"
echo -e "${YELLOW}⏱️  Timing: $TIMING_FILE${NC}"
echo -e "${YELLOW}📊 Test results: testing/results/results.csv${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Review results in $RESULTS_DIR"
echo -e "  2. Check timing data in $TIMING_FILE"
echo -e "  3. View test scores in testing/results/results.csv"
echo -e "  4. Open tierlist page to see the results!"
echo ""

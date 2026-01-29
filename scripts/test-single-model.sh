#!/bin/bash

# Test single model: onion (Codex 5.2)
# This will implement the full MODEL_SPEC for one vegetable

VEGETABLE="onion"
MODEL_NAME="Codex 5.2"
MODEL_ID="gpt-5.2-codex"
EMOJI="🧅"
BRANCH_NAME="impl/model-onion"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SPEC_FILE="$PROJECT_ROOT/specs/MODEL_SPEC.md"
TIMING_FILE="$PROJECT_ROOT/testing/timing-data.json"
OUTPUT_FILE="$PROJECT_ROOT/testing/phase2-results/output-$VEGETABLE.txt"

# Create results dir
mkdir -p "$PROJECT_ROOT/testing/phase2-results"

# Read spec
SPEC_CONTENT=$(cat "$SPEC_FILE")

# Create branch
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

# Create prompt
PROMPT="You are implementing a module for the vegetable: $VEGETABLE

IMPORTANT: You MUST use exactly '$VEGETABLE' (lowercase) as your module name.

Create the following in src/modules/vegetables/$VEGETABLE/:
- config.ts
- schema.ts
- model.ts
- api.ts
- components.tsx
- hooks.ts

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
6. Create the secret file in .secrets/vegetables/$VEGETABLE.json"

# Run copilot
echo "🚀 Testing $VEGETABLE ($MODEL_NAME)..."
echo "⏱️  Starting timer..."
START_TIME=$(date +%s)

copilot -p "$PROMPT" --allow-all-tools --allow-all-paths --model "$MODEL_ID" 2>&1 | tee "$OUTPUT_FILE"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
DURATION_MIN=$((DURATION / 60))
DURATION_SEC=$((DURATION % 60))
TIME_DISPLAY=$(printf "%02d:%02d" $DURATION_MIN $DURATION_SEC)

echo ""
echo "✅ Completed in: $TIME_DISPLAY"

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
    console.log('✅ Updated timing data: $TIME_DISPLAY');
  }
"

# Check files
echo ""
echo "📁 Checking created files..."
ls -lh src/modules/vegetables/$VEGETABLE/ 2>/dev/null || echo "❌ Module directory not found"
ls -lh .secrets/vegetables/$VEGETABLE.json 2>/dev/null || echo "❌ Secret file not found"

echo ""
echo "🔨 Run 'pnpm run build' to verify"
echo "🌐 Run 'pnpm run dev' and visit tierlist to see timing: $TIME_DISPLAY"

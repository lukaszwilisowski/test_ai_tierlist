#!/bin/bash

# Blind Commit Helper
# Commits agent results WITHOUT revealing the fruit name

set -e

echo "🔒 Blind Commit Helper"
echo "This will commit the agent's work without showing you the fruit name."
echo ""

# Check if agent completion file exists
if [ ! -f /tmp/agent-completion.json ]; then
  echo "❌ Error: /tmp/agent-completion.json not found!"
  echo ""
  echo "The agent should have created this file when done."
  echo "Either:"
  echo "  1. The agent isn't finished yet"
  echo "  2. The agent didn't follow instructions"
  echo "  3. You need to create it manually (see Step 7 in guide)"
  echo ""
  exit 1
fi

# Read completion data
echo "✅ Found agent completion file!"
echo ""

AGENT_NAME=$(jq -r '.agent' /tmp/agent-completion.json)
DURATION_SEC=$(jq -r '.durationSeconds' /tmp/agent-completion.json)
BUILD_STATUS=$(jq -r '.buildStatus' /tmp/agent-completion.json)

# Format duration
DURATION_MIN=$((DURATION_SEC / 60))
DURATION_SEC_PART=$((DURATION_SEC % 60))
TIME_DISPLAY=$(printf "%02d:%02d" $DURATION_MIN $DURATION_SEC_PART)

echo "Agent: $AGENT_NAME"
echo "Duration: $TIME_DISPLAY"
echo "Build Status: $BUILD_STATUS"
echo ""

# Update timing-data.json
echo "📝 Updating timing-data.json..."
node -e "
const fs = require('fs');
const completion = JSON.parse(fs.readFileSync('/tmp/agent-completion.json'));
const timingFile = 'testing/timing-data.json';
const data = fs.existsSync(timingFile) ? JSON.parse(fs.readFileSync(timingFile)) : {agents: []};

const durationMin = Math.floor(completion.durationSeconds / 60);
const durationSec = completion.durationSeconds % 60;
const timeDisplay = durationMin.toString().padStart(2, '0') + ':' + durationSec.toString().padStart(2, '0');

// Check if agent already exists (avoid duplicates)
const existingIndex = data.agents.findIndex(a => a.agent === completion.agent);
if (existingIndex >= 0) {
  console.log('⚠️  Agent already in timing data, updating...');
  data.agents[existingIndex] = {
    agent: completion.agent,
    durationMinutes: durationMin,
    durationSeconds: durationSec,
    timeDisplay: timeDisplay,
    canRunCLI: false,
    note: 'Manual testing - Build: ' + completion.buildStatus
  };
} else {
  data.agents.push({
    agent: completion.agent,
    durationMinutes: durationMin,
    durationSeconds: durationSec,
    timeDisplay: timeDisplay,
    canRunCLI: false,
    note: 'Manual testing - Build: ' + completion.buildStatus
  });
}

fs.writeFileSync(timingFile, JSON.stringify(data, null, 2));
"
echo "✅ Updated timing-data.json"
echo ""

# Add files (without showing names in output)
echo "📦 Staging files..."
git add src/modules/fruits/ .secrets/fruits/ testing/timing-data.json 2>&1 | grep -v "src/modules/fruits/" || true
echo "✅ Files staged"
echo ""

# Create commit
echo "💾 Creating commit..."
BUILD_EMOJI="✅"
if [ "$BUILD_STATUS" = "FAIL" ]; then
  BUILD_EMOJI="❌"
fi

git commit -m "Manual test: $AGENT_NAME implementation

Agent: $AGENT_NAME
Duration: $TIME_DISPLAY
Build: $BUILD_EMOJI $BUILD_STATUS
Blind testing - fruit name hidden from tester

Co-Authored-By: AI Agent <noreply@agent.com>" > /dev/null 2>&1

echo "✅ Committed successfully!"
echo ""

# Show commit count (not contents!)
FILE_COUNT=$(git diff --name-only HEAD~1 | wc -l | tr -d ' ')
echo "Files in commit: $FILE_COUNT"
echo ""

# Clean up
echo "🧹 Cleaning up temp files..."
rm /tmp/agent-completion.json
rm /tmp/agent-start-time.txt 2>/dev/null || true
echo "✅ Done!"
echo ""

echo "🎉 All set! The agent's work has been committed blindly."
echo "⚠️  Remember: DO NOT look at src/modules/fruits/ folder names!"
echo ""

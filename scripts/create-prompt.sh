#!/bin/bash

# Create Agent Prompt Helper
# Generates the prompt file with the agent name filled in

if [ -z "$1" ]; then
  echo "Usage: ./scripts/create-prompt.sh \"Agent Name\""
  echo ""
  echo "Examples:"
  echo "  ./scripts/create-prompt.sh \"Roo Code\""
  echo "  ./scripts/create-prompt.sh \"Cline\""
  echo "  ./scripts/create-prompt.sh \"Antigravity\""
  echo ""
  exit 1
fi

AGENT_NAME="$1"

echo "Creating prompt for: $AGENT_NAME"
echo ""

cat > /tmp/agent-prompt.txt << EOF
You are implementing a module for a fruit in this project.

DISCOVERY PHASE (REQUIRED):
1. Read scripts/fruit-assignment.json to find YOUR assigned fruit
2. Your fruit is already assigned - implement ONLY that specific fruit
3. Read specs/CODING_AGENT_SPEC.md for full requirements
4. DO NOT pick a different fruit - use your pre-assigned one

IMPORTANT RULES:
- Use the fruit name (lowercase) as your module name
- Create ALL 7 required files in src/modules/fruits/{fruit}/
  - config.ts
  - schema.ts
  - model.ts
  - api.ts
  - components.tsx
  - hooks.ts
  - secret.txt (contains ONLY the agent name)
- Also create .secrets/fruits/{fruit}.json with: { "agent": "$AGENT_NAME" }
- Run 'pnpm run build' to verify
- Do not ask questions - implement everything
- Follow ALL edge case requirements

Your agent name is: $AGENT_NAME
Create BOTH secret files:
1. src/modules/fruits/{fruit}/secret.txt (contains ONLY: $AGENT_NAME)
2. .secrets/fruits/{fruit}.json (contains: { "agent": "$AGENT_NAME" })

TIMING TRACKING (CRITICAL):
When you are COMPLETELY DONE, create this completion file:
/tmp/agent-completion.json

Contents:
{
  "agent": "$AGENT_NAME",
  "startTime": [start timestamp from /tmp/agent-start-time.txt],
  "endTime": [your completion timestamp],
  "durationSeconds": [total seconds],
  "buildStatus": "PASS" or "FAIL",
  "completed": true
}

This file signals completion to the tester without revealing the fruit name.

Read specs/CODING_AGENT_SPEC.md for complete requirements.
EOF

echo "✅ Prompt created at: /tmp/agent-prompt.txt"
echo ""
echo "Next steps:"
echo "1. Copy the contents: cat /tmp/agent-prompt.txt | pbcopy  # (macOS)"
echo "2. Or open the file: open /tmp/agent-prompt.txt"
echo "3. Paste into $AGENT_NAME and send"
echo "4. Immediately walk away! 🚶"
echo ""

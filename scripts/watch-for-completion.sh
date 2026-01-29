#!/bin/bash

# Blind Agent Completion Watcher
# This script watches for new fruit modules WITHOUT revealing their names
# Run this BEFORE launching your agent, then walk away!

set -e

echo "🔒 Starting blind completion watcher..."
echo "This will notify you when a new module is detected."
echo ""

# Get initial count of fruit modules
INITIAL_COUNT=$(find src/modules/fruits -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
echo "Initial module count: $INITIAL_COUNT"
echo "Watching for changes... (Checking every 30 seconds)"
echo ""
echo "💡 You can now walk away! You'll get a notification when done."
echo ""

# Record start time
START_TIME=$(date +%s)

# Watch loop
while true; do
  sleep 30

  CURRENT_COUNT=$(find src/modules/fruits -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
  ELAPSED=$(($(date +%s) - START_TIME))
  ELAPSED_MIN=$((ELAPSED / 60))

  # Check if completion file exists (better indicator)
  if [ -f "/tmp/agent-completion.json" ]; then
    echo "🎉 AGENT COMPLETION FILE DETECTED after ${ELAPSED_MIN} minutes!"
    echo "Agent has signaled completion."
    echo ""

    # Show completion data (without revealing fruit)
    echo "Completion data:"
    cat /tmp/agent-completion.json | jq -r '"Agent: \(.agent), Duration: \((.durationSeconds / 60 | floor)):\((.durationSeconds % 60) | tostring | if length == 1 then "0" + . else . end), Build: \(.buildStatus)"' 2>/dev/null || cat /tmp/agent-completion.json
    echo ""

    # Send notification
    if command -v osascript &> /dev/null; then
      osascript -e 'display notification "Agent has completed! Check results." with title "🎉 Agent Completion" sound name "Glass"'
    fi
    if command -v notify-send &> /dev/null; then
      notify-send "🎉 Agent Completion" "Agent has completed! Check results."
    fi
    echo -e "\a"

    echo "✅ Ready to commit! See Step 8 in the guide."
    break
  elif [ "$CURRENT_COUNT" -gt "$INITIAL_COUNT" ]; then
    # New module detected!
    echo "🎉 NEW MODULE DETECTED after ${ELAPSED_MIN} minutes!"
    echo "Agent appears to be done. Time to check build status!"
    echo ""

    # Send system notification (works on macOS)
    if command -v osascript &> /dev/null; then
      osascript -e 'display notification "Agent appears to be done! Check build status." with title "🎉 Agent Completion Detected" sound name "Glass"'
    fi

    # Send system notification (works on Linux with notify-send)
    if command -v notify-send &> /dev/null; then
      notify-send "🎉 Agent Completion Detected" "Agent appears to be done! Check build status."
    fi

    # Also make a sound (multi-platform)
    echo -e "\a"  # Terminal bell

    echo "⚠️  REMINDER: Do NOT look at folder names!"
    echo "Just run: pnpm run build"
    echo "And check if it passes or fails."
    echo ""

    break
  fi

  # Show periodic status (without revealing anything)
  if [ $((ELAPSED % 300)) -eq 0 ] && [ $ELAPSED -gt 0 ]; then
    echo "⏰ Still waiting... (${ELAPSED_MIN} minutes elapsed)"
  fi
done

echo "Watcher complete. Good luck with blind verification! 🔒"

# Manual Testing Guide for Coding Agents

This guide explains how to manually test the 3 coding agents that don't have CLI automation:
- **Roo Code**
- **Cline**
- **Antigravity**

## ⚡ Ultra-Quick Start (Using Helper Scripts)

```bash
# For each agent (Roo Code, Cline, Antigravity):

# 1. Start watcher in terminal 1
./scripts/watch-for-completion.sh

# 2. In terminal 2:
echo $(date +%s) > /tmp/agent-start-time.txt
git checkout -b impl/manual-[agent]
./scripts/create-prompt.sh "Agent Name"
cat /tmp/agent-prompt.txt | pbcopy  # Copy prompt
# [Paste into agent, send, WALK AWAY 🚶]

# 3. When notified, return:
./scripts/blind-commit.sh
git checkout impl/model-garlic && git merge - --no-edit

# Done! Never saw the fruit name!
```

**Read the full guide below for details.**

---

## 🔒 CRITICAL: Maintaining Blind Evaluation

**The goal is to NOT know which agent implemented which fruit until the final reveal.**

### The "Walk Away" Method

1. ✅ Set up the agent with the prompt and start the timer
2. 🚶 **WALK AWAY** - Do not watch the agent work
3. ⏰ Return after 20-30 minutes (or when you get a completion notification)
4. ✅ Check if build passes (success/failure only)
5. ✅ Commit using helper script (never see the fruit name)
6. 🎭 Judge fruits blindly later
7. 🎉 Reveal agent-to-fruit mapping at the end

**💡 How It Works:**
- Agent is instructed to create `/tmp/agent-completion.json` when done
- This file contains timing data and build status (but NOT the fruit name)
- The watcher script detects this file and notifies you
- You read the completion file to get timing data for commits
- Everything stays blind - you never see which fruit was implemented!

**💡 Best Practice for Completion Detection:**
- **Easiest**: Set a 30-minute timer on your phone, come back when it rings
- **Automated**: Use the file watcher script (see Step 4) to get notified when done
- **If uncertain**: Come back after 30 minutes, check if `/tmp/agent-completion.json` exists
- If completion file exists → agent is done!
- If not → agent is still working, wait 10 more minutes

**DO NOT:**
- ❌ Watch which fruit the agent discovers
- ❌ Look at file names during implementation
- ❌ Check the fruit name when verifying
- ❌ Read commit messages that reveal the fruit

**DO:**
- ✅ Minimize your terminal/IDE after launching
- ✅ Go do something else (coffee, walk, different task)
- ✅ Only check build success/failure status
- ✅ Trust the automation to record the mapping

## Prerequisites

1. **Run the fruit assignment generator first:**
   ```bash
   node scripts/assign-fruits.js
   ```
   This creates `scripts/fruit-assignment.json` with fruit assignments for all agents.

2. **DO NOT check which fruit is assigned!**
   - The assignment file exists and will be used by helper scripts
   - **Checking it defeats the blind testing!**
   - You'll see all results after the final reveal

## Manual Testing Steps

### Step 1: Prepare Your Environment

1. **Create a new branch with agent name (not fruit name):**
   ```bash
   # Use the agent name, not the fruit name (to maintain blind testing)
   # Example: impl/manual-roocode, impl/manual-cline, impl/manual-antigravity
   git checkout -b impl/manual-[agent-name-lowercase]
   ```

2. **Record start time:**
   ```bash
   # Save start time for later
   echo $(date +%s) > /tmp/agent-start-time.txt
   echo "Timer started at $(date)"
   ```

### Step 2 & 3: Create the Prompt File

**⚡ EASIEST: Use the helper script**

```bash
# Automatically creates prompt with agent name filled in
./scripts/create-prompt.sh "Roo Code"      # For Roo Code
./scripts/create-prompt.sh "Cline"         # For Cline
./scripts/create-prompt.sh "Antigravity"   # For Antigravity

# This creates /tmp/agent-prompt.txt ready to copy-paste
```

Then skip to Step 4!

---

**📖 MANUAL METHOD:**

To avoid revealing the fruit name during the agent's execution, create a hidden prompt file:

```bash
# Create a temporary prompt file
cat > /tmp/agent-prompt.txt << 'EOF'
You are implementing a module for a fruit in this project.

DISCOVERY PHASE (REQUIRED):
1. Read data/fruits.json to see all available fruits
2. Check src/modules/fruits/ to see which fruits are already implemented
3. Pick an UNUSED fruit from the JSON file
4. Read specs/CODING_AGENT_SPEC.md for full requirements

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
- Also create .secrets/fruits/{fruit}.json with: { "agent": "[AGENT_NAME]" }
- Run 'pnpm run build' to verify
- Do not ask questions - implement everything
- Follow ALL edge case requirements

Your agent name is: [AGENT_NAME]
Create BOTH secret files:
1. src/modules/fruits/{fruit}/secret.txt (contains ONLY: [AGENT_NAME])
2. .secrets/fruits/{fruit}.json (contains: { "agent": "[AGENT_NAME]" })

TIMING TRACKING (CRITICAL):
When you are COMPLETELY DONE, create this completion file:
/tmp/agent-completion.json

Contents:
{
  "agent": "[AGENT_NAME]",
  "startTime": [start timestamp from /tmp/agent-start-time.txt],
  "endTime": [your completion timestamp],
  "durationSeconds": [total seconds],
  "buildStatus": "PASS" or "FAIL",
  "completed": true
}

This file signals completion to the tester without revealing the fruit name.

Read specs/CODING_AGENT_SPEC.md for complete requirements.
EOF
```

### Step 3: Customize the Prompt for Your Agent

**Replace `[AGENT_NAME]` with the correct agent identifier:**

- For **Roo Code**: Replace with `Roo Code`
- For **Cline**: Replace with `Cline`
- For **Antigravity**: Replace with `Antigravity`

```bash
# Example for Roo Code:
sed -i '' 's/\[AGENT_NAME\]/Roo Code/g' /tmp/agent-prompt.txt

# Or manually edit the file:
nano /tmp/agent-prompt.txt
```

### Step 4: Launch the Agent and Walk Away 🚶

**Option A: Copy-paste the prompt**
1. Open your agent's UI/IDE extension
2. Copy the contents of `/tmp/agent-prompt.txt`
3. Paste into the agent's chat
4. Press send

**Option B: Reference the spec directly**
1. Open the agent
2. Say: "Read specs/CODING_AGENT_SPEC.md and implement a module for an unused fruit. Your agent name is [AGENT_NAME]. Create BOTH secret files: src/modules/fruits/{fruit}/secret.txt (contains: [AGENT_NAME]) and .secrets/fruits/{fruit}.json (contains: { \"agent\": \"[AGENT_NAME]\" }). Do not ask questions, implement everything."

**🚶 IMMEDIATELY AFTER SENDING:**
1. **Minimize the terminal/IDE window**
2. **Walk away or switch to a completely different task**
3. **Do NOT watch the agent's discovery process**
4. **Set a timer for 20-30 minutes**
5. Return only when timer goes off or you get a completion notification

### How to Know When It's Done (Without Looking!)

**✅ RECOMMENDED: Use the Automated Watcher Script**

In a **separate terminal window**, run this BEFORE launching the agent:

```bash
# Run the blind completion watcher
./scripts/watch-for-completion.sh
```

This script will:
- Watch for new modules without revealing names
- Send you a system notification when done (macOS/Linux)
- Play a sound to alert you
- Remind you NOT to look at folder names

Then you can walk away completely and wait for the notification!

---

**Alternative Options:**

**Option 1: Simple Phone Timer (No Tech Required)**
```bash
# Set a 30-minute timer on your phone
# When it goes off, come back and check
# Most agents will be done by then
```

**Option 2: Agent-Specific Notifications**
- **Roo Code**: Enable desktop notifications in settings
- **Cline**: VS Code usually shows notifications when agent completes
- **Antigravity**: Check their notification settings
- Make sure sound/banner notifications are enabled

**Option 3: Periodic Blind Checks**
```bash
# Set a repeating timer for every 10 minutes
# Come back, run build with eyes averted
# Just check if it says SUCCESS or ERROR at the end
pnpm run build
```

### Step 5: DO NOT MONITOR - Stay Away! 🚫👀

**CRITICAL FOR BLIND TESTING:**

You should be doing something completely different right now. If you're reading this during the agent's execution, you're doing it wrong!

**Recommended Approach:**
1. Set a 30-minute timer on your phone
2. If you set up the file watcher (Option 3 above), you'll get notified when it's done
3. Otherwise, just come back when the timer goes off

**Go do one of these instead:**
- ☕ Make coffee/tea
- 🚶 Take a walk
- 📧 Check email
- 🎮 Play a quick game
- 💼 Work on a different task
- 📺 Watch a video
- 🧹 Do some chores

**When you return:**
- If agent is still running: give it 10 more minutes
- If agent asked questions: answer minimally, walk away again
- If agent is done: proceed to Step 6

---

**IF the agent messages you with a question** (only then!):
- If it asks which fruit to use: "Check src/modules/fruits/ and pick an unused one from data/fruits.json"
- If it says a fruit is taken: "Correct, pick a different unused one"
- Answer ONLY the specific question, then walk away again
- **Do NOT look at what fruit it's trying to use**

### Step 6: Verify Implementation (Without Looking at Fruit Name!)

When you return after the timer:

**Check completion WITHOUT revealing the fruit:**

```bash
# Check if agent created a new module (shows just count, not names)
NEW_MODULES=$(find src/modules/fruits -maxdepth 1 -type d | wc -l)
echo "Total fruit modules now: $NEW_MODULES"

# Check if .secrets file was created
NEW_SECRETS=$(find .secrets/fruits -name "*.json" | wc -l)
echo "Total secret files: $NEW_SECRETS"

# Most important: Check if build passes
pnpm run build
```

**Record only the build result:**
- ✅ If build passes: Success!
- ❌ If build fails: Note the failure (you can let agent fix it if needed)

**DO NOT:**
- ❌ `ls src/modules/fruits/` (will show fruit names)
- ❌ `cat src/modules/fruits/*/secret.txt` (will show which fruit)
- ❌ Look at specific folder names

**YOU SHOULD ONLY KNOW:**
- ✅ Did the agent complete?
- ✅ Does the build pass or fail?
- ✅ How long did it take?

### Step 7 & 8: Commit Results (Use Helper Script!)

**⚡ EASIEST METHOD: Use the helper script**

```bash
# This does Steps 7 & 8 automatically!
./scripts/blind-commit.sh
```

This script will:
- ✅ Read `/tmp/agent-completion.json` created by the agent
- ✅ Update `testing/timing-data.json` automatically
- ✅ Stage and commit files without showing fruit names
- ✅ Clean up temp files
- ✅ Never reveal the fruit name to you!

Then skip to Step 9 (merge to main).

---

**📖 MANUAL METHOD (if you prefer):**

### Step 7: Read Agent Completion Data

**The agent should have created `/tmp/agent-completion.json` when done.**

Check if it exists and read it:

```bash
# Check if agent created completion file
if [ -f /tmp/agent-completion.json ]; then
  echo "✅ Agent completion file found!"
  cat /tmp/agent-completion.json
else
  echo "⚠️  No completion file found. Agent may not have finished properly."
  echo "Calculating manually as fallback..."

  # Manual fallback calculation
  START_TIME=$(cat /tmp/agent-start-time.txt 2>/dev/null || echo "0")
  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))

  # Create completion file manually
  AGENT_NAME="Roo Code"  # CHANGE THIS
  BUILD_STATUS="UNKNOWN"

  cat > /tmp/agent-completion.json << EOF
{
  "agent": "$AGENT_NAME",
  "startTime": $START_TIME,
  "endTime": $END_TIME,
  "durationSeconds": $DURATION,
  "buildStatus": "$BUILD_STATUS",
  "completed": true,
  "note": "Manually created - agent didn't create file"
}
EOF
fi
```

**Add to timing-data.json:**

```bash
# Automatically merge the completion data
node -e "
const fs = require('fs');
const completion = JSON.parse(fs.readFileSync('/tmp/agent-completion.json'));
const timingFile = 'testing/timing-data.json';
const data = fs.existsSync(timingFile) ? JSON.parse(fs.readFileSync(timingFile)) : {agents: []};

const durationMin = Math.floor(completion.durationSeconds / 60);
const durationSec = completion.durationSeconds % 60;
const timeDisplay = durationMin.toString().padStart(2, '0') + ':' + durationSec.toString().padStart(2, '0');

data.agents.push({
  agent: completion.agent,
  durationMinutes: durationMin,
  durationSeconds: durationSec,
  timeDisplay: timeDisplay,
  canRunCLI: false,
  note: 'Manual testing - Build: ' + completion.buildStatus
});

fs.writeFileSync(timingFile, JSON.stringify(data, null, 2));
console.log('✅ Added to timing-data.json:', timeDisplay);
"
```

### Step 8: Commit Changes (Without Seeing Fruit Name!)

**Use this blind commit script (reads from agent completion file):**

```bash
# Add all new files (without seeing names)
git add src/modules/fruits/
git add .secrets/fruits/

# Read metadata from agent completion file
COMPLETION=$(cat /tmp/agent-completion.json)
AGENT_NAME=$(echo $COMPLETION | jq -r '.agent')
DURATION_SEC=$(echo $COMPLETION | jq -r '.durationSeconds')
BUILD_STATUS=$(echo $COMPLETION | jq -r '.buildStatus')

# Format duration as MM:SS
DURATION_MIN=$((DURATION_SEC / 60))
DURATION_SEC_PART=$((DURATION_SEC % 60))
TIME_DISPLAY=$(printf "%02d:%02d" $DURATION_MIN $DURATION_SEC_PART)

# Commit with generic message (no fruit name visible to you)
git commit -m "Manual test: $AGENT_NAME implementation

Agent: $AGENT_NAME
Duration: $TIME_DISPLAY
Build: $BUILD_STATUS
Blind testing - fruit name hidden from tester

Co-Authored-By: AI Agent <noreply@agent.com>"

# Check what was committed (without opening files)
echo "Files committed (count only):"
git diff --name-only HEAD~1 | wc -l

# Clean up temp files
rm /tmp/agent-completion.json
rm /tmp/agent-start-time.txt
```

**IMPORTANT:** The commit message intentionally does NOT include the fruit name to keep your evaluation blind!

### Step 9: Merge to Main

```bash
# Get current branch name
CURRENT_BRANCH=$(git branch --show-current)

# Return to main
git checkout impl/model-garlic  # Your main working branch

# Merge (using the branch name, not fruit name)
git merge $CURRENT_BRANCH --no-edit

# Clean up
git branch -d $CURRENT_BRANCH
```

### Step 10: Save Notes (Without Fruit Names!)

Create a blind log that doesn't reveal the fruit:

```bash
# Create blind summary (no fruit name!)
cat > testing/phase2-results/output-${AGENT_NAME// /-}.txt << EOF
Agent: $AGENT_NAME
Duration: $TIME_DISPLAY
Build Status: $BUILD_STATUS
Completed: $(date)

Observations (without revealing fruit):
- Did agent complete successfully? [Yes/No]
- Any errors encountered? [Describe without naming fruit]
- Did agent ask questions? [What questions?]
- Overall impression? [Note behavior, not implementation]

FRUIT NAME INTENTIONALLY HIDDEN FOR BLIND EVALUATION
EOF

echo "Blind log saved. You're done with this agent!"
echo "DO NOT look at src/modules/fruits/ folder yet!"
```

## Testing All Three Manual Agents

Repeat the above steps for each agent (one at a time):

1. **First agent** (e.g., Roo Code)
   - Branch: `impl/manual-roocode`
   - Complete all 10 steps
   - Merge to main
   - **DO NOT look at which fruit it implemented!**

2. **Second agent** (e.g., Cline)
   - Start from main branch
   - Branch: `impl/manual-cline`
   - Complete all 10 steps
   - Merge to main
   - **DO NOT look at which fruit it implemented!**

3. **Third agent** (e.g., Antigravity)
   - Start from main branch
   - Branch: `impl/manual-antigravity`
   - Complete all 10 steps
   - Merge to main
   - **DO NOT look at which fruit it implemented!**

**Between agents:**
- Take a break
- Clear your mind
- Don't try to guess which fruits were used
- Stay disciplined about not peeking!

## After All Manual Testing

### Run Final Tests

```bash
# Build check
pnpm run build

# Start dev server
pnpm run dev &
DEV_PID=$!

# Wait for server
sleep 10

# Run module tests
pnpm run test:modules

# Stop dev server
kill $DEV_PID
```

### Review Results

```bash
# Check timing data
cat testing/timing-data.json

# Check test results
cat testing/results/results.csv

# View all fruit modules
ls -la src/modules/fruits/
```

## Tips for Maintaining Blind Testing

The entire value of this evaluation depends on you NOT knowing which agent did which fruit:

### What TO DO ✅
1. **Walk away** after launching the agent
2. **Minimize/close** the terminal window immediately
3. **Set a timer** and do something else
4. **Only check** build success/failure upon return
5. **Trust the process** - the mapping is recorded automatically
6. **Be disciplined** - resist the urge to peek!
7. **Judge fruits** based on code quality, not which agent you think did it

### What NOT TO DO ❌
1. **Don't watch** the agent discover the fruit
2. **Don't read** file names in src/modules/fruits/
3. **Don't look** at git diff output with fruit names
4. **Don't check** which files were created
5. **Don't try** to guess from commit times or patterns
6. **Don't peek** at the assignment JSON file
7. **Don't reveal** fruits until ALL testing and judging is complete

### Why This Matters
- **Confirmation bias**: If you know Roo Code did lemon, you'll judge lemon differently
- **Fair comparison**: Judge implementations solely on merit
- **Genuine surprise**: The reveal at the end is more meaningful
- **Scientific method**: Blind testing is the gold standard

**Remember:** You can look at everything AFTER you've judged all fruits!

## Troubleshooting

### 😱 I Accidentally Saw the Fruit Name!
**Solution:**
1. Don't panic - note which agent/fruit pairing you saw
2. Write it down: "I know [Agent] did [Fruit]"
3. When judging that specific fruit later, try extra hard to be objective
4. Consider having someone else judge that particular fruit
5. Be honest about it in your final analysis
6. The experiment is still valuable even with one spoiled pairing

### Agent picks already-used fruit
**Solution:** Say "That fruit is taken. Check src/modules/fruits/ for available options."
- If it mentions the fruit name, look away/close eyes during that exchange
- You only need to confirm "yes it's taken" or "no it's available"

### Agent asks which fruit to use
**Solution:** "Read data/fruits.json and pick any unused fruit. Check src/modules/fruits/ to see what's taken."
- Don't let it tell you which fruit it's choosing

### Build fails
**Solution:**
1. You'll see the error in the terminal (try not to read fruit names in paths)
2. Let the agent fix it (say "Build failed, please fix the errors")
3. Update BUILD_STATUS to "❌ FAIL" if it can't be fixed
4. Commit anyway for comparison purposes
5. The blind evaluation still works even with failed builds

### Agent creates wrong file structure
**Solution:**
1. Let it complete
2. Note the issue in blind output log (without naming the fruit)
3. This is part of the evaluation (agent capability)
4. Record the structural issues for later analysis

### I Want to Give Up on Blind Testing
**Solution:** Don't! Here's why it matters:
- Your gut reaction to code quality is influenced by agent reputation
- "Brand bias" is real - you'll judge "Claude Sonnet" code more favorably
- The surprise factor at the reveal makes the whole experiment worthwhile
- Scientific rigor requires observer blindness
- You can always look after you've made your judgements!

## Practical Tips for Not Seeing Fruit Names

### Terminal/IDE Management
```bash
# Before launching agent:
# 1. Make terminal/IDE full screen
# 2. After sending prompt, immediately:
osascript -e 'tell application "System Events" to keystroke "m" using command down'  # Minimize on Mac
# OR just Cmd+M manually

# 3. Open a different workspace/desktop
# 4. Set a timer on your phone
# 5. Walk away!
```

### If You Must Check Progress
**Use these "blind" commands:**
```bash
# Check if agent is still running (shows process only)
ps aux | grep -i [your-agent-process-name]

# Check file count without seeing names
find src/modules/fruits -type f | wc -l

# Check if build would pass (in a separate terminal, eyes averted from output)
pnpm run build 2>&1 | grep -q "error" && echo "FAIL" || echo "PASS"
```

### Physical Strategies
1. **Blur your vision** when looking at terminal
2. **Use peripheral vision** to see status without reading names
3. **Ask a friend** to check if it's done
4. **Literally walk away** - go to another room
5. **Use noise-cancelling headphones** with music (helps ignore agent notifications)
6. **Cover fruit name regions** with sticky notes on screen (if you must watch)

### Mental Discipline
- Think of it like a scientific experiment (which it is!)
- Remind yourself: "The reveal will be so much better"
- Consider: Would you want to spoil a movie ending?
- This is your one chance to judge code blindly

## Expected Time Ranges

Based on the vegetable testing:
- **Fast agents:** 0-5 minutes
- **Average agents:** 5-15 minutes
- **Thorough agents:** 15-30 minutes
- **Manual testing timeout:** 30 minutes (be generous, this is manual)

## Final Checklist

After completing all 3 manual agents:

### Before Judging
- [ ] All 3 agents have entries in timing-data.json
- [ ] All 3 fruits have modules in src/modules/fruits/ (but you don't know which!)
- [ ] All 3 have blind output logs in testing/phase2-results/
- [ ] All branches merged to main
- [ ] Build passes for all
- [ ] You have NOT looked at which fruits were implemented
- [ ] You have NOT peeked at the mapping file

### Judging Phase (Still Blind!)
- [ ] Review all fruit implementations in src/modules/fruits/
- [ ] Judge each fruit's code quality independently
- [ ] Rank fruits into your tierlist (S, A, B, C, D tiers)
- [ ] Write notes about each fruit (without knowing the agent)
- [ ] Make your final tierlist decisions

### The Reveal (Finally!)
- [ ] Run the reveal script (see "The Final Reveal" section)
- [ ] Compare your rankings with actual agent performance
- [ ] Reflect on any surprises or confirmation biases
- [ ] Document insights about agent capabilities

---

## The Final Reveal 🎉

**Only do this AFTER:**
- All 3 manual agents tested
- All automated agents tested
- All fruits have been judged and ranked
- You've made your tierlist decisions

### Reveal Script

```bash
# Now you can finally see which agent did which fruit!
echo "=== AGENT TO FRUIT MAPPING ==="
echo ""

for agent in "Roo Code" "Cline" "Antigravity"; do
  echo "Agent: $agent"
  # Find which fruit this agent created by checking secret files
  find src/modules/fruits -name "secret.txt" -exec grep -l "$agent" {} \; | \
    while read file; do
      fruit=$(echo $file | sed 's|src/modules/fruits/||; s|/secret.txt||')
      emoji=$(node -p "require('./data/fruits.json').find(f => f.name === '$fruit')?.emoji || '?'")
      echo "  → $emoji $fruit"
    done
  echo ""
done

echo "=== JUDGEMENT TIME ==="
echo "Now compare your blind rankings with the actual agent performance!"
```

### Compare Your Assumptions

1. **Before reveal**: "I think lemon is S-tier code"
2. **After reveal**: "Oh! That was done by [Agent X]!"
3. **Reflection**: Did the agent's reputation match the actual quality?

## Quick Reference

### ⚡ SUPER EASY MODE (Recommended - Uses Helper Scripts)

```bash
# Terminal 1: Start watcher (gets you notified when done)
./scripts/watch-for-completion.sh

# Terminal 2: Prepare and launch
echo $(date +%s) > /tmp/agent-start-time.txt
git checkout -b impl/manual-roocode  # or cline, antigravity

# Create prompt with agent name
./scripts/create-prompt.sh "Roo Code"  # Creates /tmp/agent-prompt.txt

# Copy prompt to clipboard (macOS)
cat /tmp/agent-prompt.txt | pbcopy

# Or view it to copy manually
cat /tmp/agent-prompt.txt

# [Paste into agent and send]
# 🚶 WALK AWAY IMMEDIATELY - watcher will notify you!

# === Come back when notified ===

# Verify completion file exists
ls /tmp/agent-completion.json  # Should exist

# Verify build passed (optional)
pnpm run build  # Check if it says "success"

# Commit everything blindly
./scripts/blind-commit.sh

# Merge to main
BRANCH=$(git branch --show-current)
git checkout impl/model-garlic
git merge $BRANCH --no-edit
git branch -d $BRANCH

# Done! DO NOT LOOK AT FRUIT NAMES!
```

### 📱 SIMPLE MODE (Phone Timer)

```bash
# Just use your phone timer - no tech required
echo $(date +%s) > /tmp/agent-start-time.txt
git checkout -b impl/manual-[agent]
# [Launch agent, set 30-min phone timer]
# 🚶 WALK AWAY
# [Return after timer, use blind-commit.sh script]
./scripts/blind-commit.sh
git checkout impl/model-garlic && git merge - --no-edit
```

### 🔧 MANUAL MODE (Full Control)

```bash
# Do everything manually (see Steps 1-10 in guide)
echo $(date +%s) > /tmp/agent-start-time.txt
git checkout -b impl/manual-[agent]
# [Launch agent with prompt]
# 🚶 WALK AWAY FOR 30 MINUTES
# [Return, check /tmp/agent-completion.json]
# [Manually update timing-data.json - see Step 7]
# [Manually commit - see Step 8]
git checkout impl/model-garlic
git merge impl/manual-[agent] --no-edit
```

Good luck with your blind manual testing! 🚀🔒
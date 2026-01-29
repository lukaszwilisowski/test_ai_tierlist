# Automated Testing System

This directory contains scripts to automate model testing with double-blind evaluation and timing measurements.

## Overview

The testing system solves two key problems:
1. **Double-blind evaluation**: Prevents accidental observation of which vegetable was created by which model
2. **Consistent timing**: Automatically measures and records execution time for each model

## Files

### Configuration
- `timing-data.json` - Stores timing data for all agents and models
- `vegetable-assignment.json` - Maps models to vegetables (generated)

### Scripts
- `assign-vegetables.js` - Randomly assigns vegetables to models
- `phase1-simple-test.sh` - Quick test to verify Copilot CLI works
- `phase2-full-test.sh` - Full MODEL_SPEC implementation

### Results
- `phase1-results/` - Simple test outputs
- `phase2-results/` - Full implementation outputs
- `results/` - Test scores (CSV format)

## Quick Start

### Step 1: Assign Vegetables to Models

This creates a random mapping to ensure double-blind evaluation:

```bash
node testing/assign-vegetables.js
```

**Output**: Creates `testing/vegetable-assignment.json`

**Important**: Only run this ONCE at the start. The assignment is permanent for consistency.

### Step 2: Phase 1 - Simple Test (Optional)

Verify that Copilot CLI works with all models:

```bash
./testing/phase1-simple-test.sh
```

**What it does**:
- Creates simple `test-{vegetable}.js` files
- Tests each model with a trivial task (factorial function)
- Measures timing
- Creates branches, commits, and merges

**Duration**: ~5-10 minutes per model (~1 hour total)

### Step 3: Phase 2 - Full Implementation

Run the complete MODEL_SPEC for all models:

```bash
./testing/phase2-full-test.sh
```

**What it does**:
- For each model:
  - Creates a branch `impl/model-{vegetable}`
  - Runs Copilot CLI with full MODEL_SPEC
  - Creates 7 files (6 module files + secret)
  - Measures timing
  - Runs build verification
  - Commits and merges to main
- After all models:
  - Runs final build check
  - Starts dev server
  - Runs automated tests
  - Saves results to CSV

**Duration**: ~15-30 minutes per model (~3-4 hours total)

## Understanding the Results

### Timing Data

View timing for each model in `testing/timing-data.json`:

```json
{
  "model": "Sonnet 4.5",
  "durationMinutes": 3,
  "durationSeconds": 24,
  "timeDisplay": "03:24"
}
```

The `timeDisplay` field shows in the tierlist as `⏱️ 03:24` below each fruit/vegetable.

### Test Scores

Automated test results are in `testing/results/results.csv`:

```
Module,Create,Read,ReadOne,Update,Delete,InvalidId,Validation,Empty,NotFound,Build,Total
carrot,10,10,5,10,5,5,5,3,5,10,55
```

Scores show in the tierlist as `55/55` below each fruit/vegetable.

### Output Logs

Each model's execution is logged:
- `phase2-results/output-{vegetable}.txt` - Full CLI output
- `phase2-results/log-{vegetable}.log` - Build logs

## Manual Testing Workflow

For agents that can't run via CLI (Cursor, Roo Code, Cline, Antigravity):

1. **Note your start time**
2. **Open the agent** and provide the spec
3. **Let it work** without looking at which fruit it picks
4. **Note completion time**
5. **Update timing-data.json manually**:
   ```json
   {
     "agent": "Roo Code",
     "durationMinutes": 5,
     "durationSeconds": 42,
     "timeDisplay": "05:42"
   }
   ```
6. **Run build and tests**:
   ```bash
   pnpm run build
   pnpm run dev &
   pnpm run test:modules
   ```

## Troubleshooting

### Assignment file already exists
If you need to regenerate vegetable assignments:
```bash
rm testing/vegetable-assignment.json
node testing/assign-vegetables.js
```

### Copilot CLI not found
Make sure Copilot CLI is installed and in your PATH:
```bash
which copilot
```

### Build failures
Check the build log for the specific module:
```bash
cat testing/phase2-results/log-{vegetable}.log
```

### Script hangs
Phase 2 has a 20-minute timeout per model. If it hangs, the script will automatically continue to the next model.

### Merge conflicts
If branches conflict, resolve manually:
```bash
git status
git merge --abort  # If needed
# Fix issues manually
git checkout main
```

## Viewing Results

### In the Tierlist

1. Start the app:
   ```bash
   pnpm run dev
   ```

2. Open [http://localhost:3000/tierlist](http://localhost:3000/tierlist)

3. You'll see:
   - **Left side (Expectations)**: Agents/Models (your predictions)
   - **Right side (Reality)**: Fruits/Vegetables (actual results)
   - Each reality item shows:
     - Name (e.g., "carrot")
     - Score (e.g., "55/55")
     - Time (e.g., "⏱️ 03:24")

4. Double-click a fruit/vegetable to reveal which agent/model created it

### Raw Data

- **Timing**: `cat testing/timing-data.json | jq`
- **Scores**: `cat testing/results/results.csv | column -t -s,`
- **Assignments**: `cat testing/vegetable-assignment.json | jq`

## Architecture

### Why Branches?

Each model gets its own branch to:
1. Isolate implementations
2. Prevent models from seeing each other's code
3. Enable parallel testing (future enhancement)
4. Keep git history clean

### Double-Blind Process

```
User → assign-vegetables.js → vegetable-assignment.json (hidden mapping)
                                        ↓
Model A → creates "carrot" module → .secrets/vegetables/carrot.json
Model B → creates "eggplant" module → .secrets/vegetables/eggplant.json
                                        ↓
Tierlist reads secrets → matches timing → displays without revealing identity
                                        ↓
User reveals → sees which model created which vegetable
```

## Extending

### Add More Models

1. Edit `testing/timing-data.json`:
   ```json
   {
     "model": "New Model",
     "agent": "Any",
     "durationMinutes": 0,
     "durationSeconds": 0,
     "timeDisplay": "00:00",
     "canRunCLI": true,
     "note": "Via copilot CLI with model-id"
   }
   ```

2. Update the `case` statement in scripts to map model name to CLI ID

3. Regenerate assignments:
   ```bash
   rm testing/vegetable-assignment.json
   node testing/assign-vegetables.js
   ```

### Change Timeout

Edit Phase 2 script line with `timeout`:
```bash
timeout 1200  # 20 minutes (in seconds)
```

## Best Practices

1. **Run Phase 1 first** - Catch CLI issues early
2. **Don't peek** - Keep evaluation blind until reveal
3. **Monitor progress** - Check output logs if issues arise
4. **Commit frequently** - Each model is committed separately
5. **Backup results** - Copy `testing/results/` before re-running

## Questions?

See the main project documentation:
- `docs/IMPLEMENTATION_PLAN.md` - Overall project plan
- `specs/MODEL_SPEC.md` - Model testing specification
- `specs/CODING_AGENT_SPEC.md` - Agent testing specification

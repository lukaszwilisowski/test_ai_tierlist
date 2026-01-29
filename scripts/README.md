# Testing Scripts

This directory contains all automated testing scripts for the AI Tierlist project.

## Assignment Scripts

### `assign-vegetables.js`
Randomly assigns vegetables to AI models for double-blind testing.

**Usage:**
```bash
node scripts/assign-vegetables.js
```

**Output:** Creates `testing/vegetable-assignment.json`

**Note:** Only run once at the start. Will error if assignment file already exists.

### `assign-fruits.js`
Randomly assigns fruits to coding agents for double-blind testing.

**Usage:**
```bash
node scripts/assign-fruits.js
```

**Output:** Creates `testing/fruit-assignment.json`

## Full Test Scripts

### `test-vegetables.sh`
Runs complete MODEL_SPEC implementation for all assigned models via Copilot CLI.

**Usage:**
```bash
./scripts/test-vegetables.sh
```

**What it does:**
- Creates a branch for each model (`impl/model-{vegetable}`)
- Runs full MODEL_SPEC implementation
- Creates 6 module files + 1 secret file
- Measures timing for each model
- Runs build verification
- Commits and merges to main branch
- Updates timing data
- Runs automated tests at the end

**Duration:** ~15-30 minutes per model

**Requirements:**
- Copilot CLI installed
- `testing/vegetable-assignment.json` must exist
- Clean git state

### `test-fruits.sh`
Runs complete CODING_AGENT_SPEC implementation for CLI-capable coding agents.

**Usage:**
```bash
./scripts/test-fruits.sh
```

**What it does:**
- Similar to `test-vegetables.sh` but for coding agents
- Uses CODING_AGENT_SPEC instead of MODEL_SPEC
- Only processes CLI-capable agents

**Duration:** ~15-30 minutes per agent

**Requirements:**
- Copilot CLI installed
- `testing/fruit-assignment.json` must exist
- Clean git state

## Simple Test Scripts

### `test-simple.sh`
Quick verification test that Copilot CLI works with all models.

**Usage:**
```bash
./scripts/test-simple.sh
```

**What it does:**
- Creates simple `test-{vegetable}.js` files with factorial function
- Tests each model with a trivial task
- Measures basic timing
- Creates branches and commits

**Duration:** ~5-10 minutes per model

**Use case:** Run before full tests to catch CLI configuration issues early.

## Single Model Test Scripts

### `test-claude-single.sh`
Tests a single model (Sonnet 4.5 → garlic) using Claude Code CLI.

**Usage:**
```bash
./scripts/test-claude-single.sh
```

**What it does:**
- Implements full MODEL_SPEC for garlic module
- Uses Claude Code CLI (faster than Copilot CLI)
- Measures timing
- Updates timing data

**Use case:** Quick iteration testing during development.

**Note:** Hardcoded for garlic/Sonnet 4.5. Edit script to test other combinations.

### `test-single-model.sh`
Tests a single model (Codex 5.2 → onion) using Copilot CLI.

**Usage:**
```bash
./scripts/test-single-model.sh
```

**What it does:**
- Implements full MODEL_SPEC for onion module
- Uses Copilot CLI
- Measures timing
- Updates timing data

**Use case:** Quick iteration testing for specific model/vegetable combinations.

**Note:** Hardcoded for onion/Codex 5.2. Edit script to test other combinations.

## Script Organization

All scripts now live in `scripts/` directory, while configuration and results remain in `testing/`:

```
scripts/                           # Executable scripts
├── assign-vegetables.js           # Generate assignments
├── assign-fruits.js
├── test-vegetables.sh            # Full test suites
├── test-fruits.sh
├── test-simple.sh                # Quick verification
├── test-claude-single.sh         # Single model tests
└── test-single-model.sh

testing/                          # Configuration and results
├── vegetable-assignment.json     # Generated assignments
├── fruit-assignment.json
├── timing-data.json             # Timing measurements
├── phase1-results/              # Simple test outputs
├── phase2-results/              # Full test outputs
└── results/                     # Test scores (CSV)
```

## Common Workflows

### First-time setup
```bash
# 1. Assign vegetables to models
node scripts/assign-vegetables.js

# 2. Run simple test (optional)
./scripts/test-simple.sh

# 3. Run full test
./scripts/test-vegetables.sh
```

### Testing fruits (agents)
```bash
# 1. Assign fruits to agents
node scripts/assign-fruits.js

# 2. Run full test for CLI agents
./scripts/test-fruits.sh
```

### Quick iteration on single model
```bash
# Edit the script to set your model/vegetable
vim scripts/test-claude-single.sh

# Run it
./scripts/test-claude-single.sh
```

### Regenerate assignments
```bash
# Delete old assignment
rm testing/vegetable-assignment.json

# Generate new one
node scripts/assign-vegetables.js
```

## Troubleshooting

### Scripts not executable
```bash
chmod +x scripts/*.sh
```

### Assignment file conflicts
```bash
rm testing/vegetable-assignment.json
rm testing/fruit-assignment.json
node scripts/assign-vegetables.js
node scripts/assign-fruits.js
```

### Path issues
All scripts now calculate PROJECT_ROOT dynamically, so they should work from any location as long as the project structure is intact.

## See Also

- [testing/README.md](../testing/README.md) - Comprehensive testing system documentation
- [specs/MODEL_SPEC.md](../specs/MODEL_SPEC.md) - Model testing specification
- [specs/CODING_AGENT_SPEC.md](../specs/CODING_AGENT_SPEC.md) - Agent testing specification

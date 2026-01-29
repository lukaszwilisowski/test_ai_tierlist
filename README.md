```
pnpm run test:modules
```

How to run Agents as CLI?

1. Claude

```
claude --dangerously-skip-permissions "create test file test.js with few lines of code, do not ask any questions"
```

2. Codex

```
codex --dangerously-bypass-approvals-and-sandbox "create test file test.js with few lines of code, do not ask any questions"
```

3. Copilot

```
copilot -p "create example test.js file with few lines of code, do not ask any questions" --allow-all-tools --allow-all-paths --model gpt-5.2-codex
```

or models:
gpt-5.1-codex-max
claude-sonnet-4.5
claude-opus-4.5
gemini-3-flash
gemini-3-pro

4. Antigravity

agy chat "do sth" does not work
Fallback to manual only

5. Roo Code

Manual only

6. Cline CLI

Manual only

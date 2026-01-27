# Presentation Flow

## Overview

**Total Time**: 30 minutes presentation + 30 minutes Q&A
**Audience**: JS Meetup Krakow

---

## Presentation Structure

### Part 1: Introduction (5-7 minutes)

#### Slide 1: Title
- "AI Coding Tools: Expectations vs Reality"
- "A Quasi-Scientific Comparison"

#### Slide 2: The Problem
- Many AI coding tools available
- Marketing claims vs actual performance
- Hard to compare objectively

#### Slide 3: Experiment Design
- Two comparisons:
  1. **Agents** with same model (Claude Sonnet 4.5)
  2. **Models** with same agent (Roo Code)
- Blind evaluation using fruit/vegetable codenames
- Same task for all subjects

#### Slide 4: The Task
- Modular Next.js shop
- CRUD operations
- Edge case handling
- Specific tool-usage tests (for agents)

#### Slide 5: Methodology
- Sequential testing
- No peeking at which module is which
- Automated + manual evaluation
- Scoring rubric

---

### Part 2: Coding Agents Tierlist (10 minutes)

#### Live Demo: Expectations

1. Open tierlist app
2. Navigate to "Coding Agents" tab
3. Show left side: "My Expectations"
4. **Talk through your reasoning** as you drag:
   - "I expect Cursor to be S-tier because..."
   - "Copilot I'm putting in B because..."
   - etc.

#### Live Demo: Reality

1. Show right side: "Reality"
2. Drag fruits based on your testing:
   - "Apple performed really well, so S-tier"
   - "Banana had some issues with X, so B-tier"
   - Don't reveal which is which yet!

#### The Reveal

1. Double-click each fruit
2. Watch transformation animation
3. Compare to expectations
4. **React genuinely** to surprises
5. Brief commentary on each

#### Quick Stats
- Show automated test results (results.csv)
- Highlight interesting differences

---

### Part 3: LLM Models Tierlist (10 minutes)

#### Live Demo: Expectations

1. Switch to "LLM Models" tab
2. Fill in expectations:
   - "Opus should be best, so S-tier"
   - "DeepSeek I'm curious about, putting in B"
   - etc.

#### Live Demo: Reality

1. Drag vegetables based on testing
2. Same process as before

#### The Reveal

1. Double-click each vegetable
2. Compare expectations vs reality
3. Discuss which models surprised you

#### Quick Stats
- Show test results
- Compare code quality observations

---

### Part 4: Conclusions (3-5 minutes)

#### Key Takeaways

1. **Agents**: Tool implementation matters
   - Same model, different results
   - Context handling varies
   - File operations differ

2. **Models**: Size isn't everything
   - Smaller models can compete
   - Code style differences
   - Edge case handling varies

#### Recommendations
- For [use case X], consider [agent/model Y]
- For rapid prototyping: [suggestion]
- For production code: [suggestion]

#### Caveats
- Single task, limited scope
- Your mileage may vary
- Technology evolves rapidly

---

## Q&A Preparation (30 minutes)

### Expected Questions

1. **"Why these specific agents/models?"**
   - Cover availability, popularity, accessibility

2. **"Was the task representative?"**
   - Discuss tradeoffs, acknowledge limitations

3. **"How did you ensure fairness?"**
   - Blind evaluation, same prompt, same environment

4. **"What about [X tool/model]?"**
   - "Didn't include due to [reason], would be interesting to test"

5. **"Can we see the code?"**
   - Be prepared to show module implementations
   - Point out interesting differences

6. **"How did you track which is which?"**
   - Show .secrets folder structure
   - Explain manual tracking process

### Live Demos to Prepare

1. Show a fruit module's code (without revealing which agent)
2. Show comparison between two implementations
3. Show automated test output
4. Show the actual shop working

---

## Technical Setup

### Before Presentation

1. **Clear browser cache** - Fresh tierlist state
2. **Close unnecessary apps** - No notifications
3. **Test microphone/display** - Works with projector
4. **Have backup screenshots** - In case of demo failure
5. **Pre-position windows**:
   - Browser with tierlist
   - VS Code with module code
   - Terminal with test results

### Backup Plan

If live demo fails:
1. Have screenshots of tierlist reveal
2. Have recorded video backup
3. Show static results

---

## Script Snippets

### Opening
> "How many of you use AI coding tools? [hands]
> How many have tried more than one? [hands]
> Today I'll share what I learned testing seven coding agents and six LLMs on the same task."

### Before Expectations Drag
> "Before I show you my results, let me share what I expected going in. These are my biases."

### Before Reality Drag
> "Now here's what actually happened. Remember, I didn't know which fruit was which agent when I was testing."

### During Reveal
> "And now... the moment of truth. [double-click]
> Oh interesting! That was actually [agent name]!"

### Closing
> "So what's the takeaway? The best tool depends on your specific needs. But hopefully this gives you a data point beyond marketing claims."

---

## Timing Checkpoints

| Time | Section | Status |
|------|---------|--------|
| 0:00 | Start intro | |
| 5:00 | Begin agents tierlist | |
| 15:00 | Begin models tierlist | |
| 25:00 | Begin conclusions | |
| 30:00 | Q&A starts | |

If running behind:
- Cut some "reasoning" during drags
- Skip detailed stats
- Shorten conclusions

If running ahead:
- More detailed explanations
- Show code comparisons
- Extra live demos

---

## Pre-Presentation Checklist

### Day Before
- [ ] Run all automated tests
- [ ] Verify all modules work
- [ ] Fill in .secrets files
- [ ] Test tierlist reveal animations
- [ ] Prepare backup screenshots
- [ ] Practice timing

### 1 Hour Before
- [ ] Start local dev server
- [ ] Open all necessary tabs
- [ ] Test projector/display
- [ ] Check internet connection
- [ ] Silence phone

### 5 Minutes Before
- [ ] Refresh tierlist page (clean state)
- [ ] Deep breath
- [ ] Water nearby

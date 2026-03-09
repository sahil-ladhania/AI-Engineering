# Phase 6 — Architecture

## Your Job
Validate whether the tech stack and architecture
is realistic for a solo developer.
Not what's cool — what will actually ship.

## What to Look For
- Is the tech stack familiar to the user?
- Is the complexity justified for P0?
- Are there any single points of failure?
- Is this genuinely buildable solo in reasonable time?

## Opening Question
"Let's talk about the tech.

What is your planned stack —
and have you built something
with it before?"

## If Stack is Unfamiliar
Push back:
"You're planning to learn a new stack
AND build a new product at the same time.
That's two risks, not one.
Can you simplify the stack to something
you've already shipped with?"

## If Stack is Familiar
Follow up:
"Good. What is the hardest technical
problem you'll face in this build —
the one thing you haven't solved before?"

## Sharpening Questions (use if needed)
- "Do you need a mobile app in P0 or will web work?"
- "What does your data model look like at its core?"
- "Are there any third party APIs this depends on?
   What happens if they go down or change pricing?"
- "What is your auth strategy?"
- "Where will this be hosted and what is the estimated cost?"

## Red Flags to Watch For
- Planning microservices for a solo MVP
- Unfamiliar stack + unfamiliar domain
- Heavy dependency on paid third party APIs
- No clear data model yet
- "I'll figure out hosting later"

## Scoring This Phase

| Response Quality | Score |
|-----------------|-------|
| Familiar stack, clear architecture, risks identified | 12-15 |
| Familiar stack, some unknowns | 6-11 |
| Unfamiliar stack, vague architecture | 0-5 |

## After Architecture Phase
Load `phases/07-scoring.md`
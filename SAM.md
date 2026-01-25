# SAM.md — How to Work With Claude Code

## The Core Shift

Treat Claude like a senior dev you're pairing with, not a command line you type into one command at a time.

---

## Batching

**Don't do this:**
```
> add the evaluate button
[wait]
> now update the worklog
[wait]
> check for typescript errors
```

**Do this:**
```
> add the evaluate button, update WORKLOG, check for TS errors, checkpoint when done
```

One message. Claude parallelizes. You review once.

---

## Git Triggers

| Say This | Claude Does |
|----------|-------------|
| `checkpoint` | Stages + commits with descriptive message |
| `commit this` | Same as checkpoint |
| `PR this` | Creates branch if needed, pushes, opens PR |

Use `checkpoint` liberally. Every time something works, say it.

---

## Plan Mode

Before asking for something big (new feature, 5+ files, unclear design):

```
> plan this first: [describe the feature]
```

Claude explores, drafts approach, waits for your approval, then builds.

If you forget, Claude should ask: "This touches X files — want me to plan first or just go?"

---

## Front-Load What You Know

**Don't do this:**
```
> add an evaluate button
> [where?] in the header
> [what does it do?] copies a prompt
> [tooltip?] "Copy evaluation prompt"
```

**Do this:**
```
> add evaluate button in kit detail header, copies evaluation prompt to clipboard, tooltip "Copy evaluation prompt"
```

If you can see it, say it all at once.

---

## Ask for Feedback

After Claude finishes something:

| Say This | You Get |
|----------|---------|
| `what am I missing?` | Edge cases, bugs, gaps |
| `what would you improve?` | Polish opportunities |
| `review this for bugs` | Code review before deploy |

---

## Background Tasks

Keep momentum while things run:

```
> run tests in background, keep going with the UI stuff
```

Claude runs tests, continues conversation, reports results when done.

---

## Quick Reference

| Situation | What to Say |
|-----------|-------------|
| Multiple small tasks | `Do X, Y, Z, then checkpoint` |
| Something works | `checkpoint` |
| Big feature coming | `plan this first: [feature]` |
| You know the details | Say them all in one message |
| Just finished something | `what am I missing?` |
| Want parallel work | `run X in background, keep going` |
| Ready to deploy | `PR this` |
| Need code review | `review this file for bugs` |

---

## The Mantra

**Batch. Checkpoint. Front-load. Ask.**

That's it.

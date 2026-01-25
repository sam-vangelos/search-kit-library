# Hedra Design Reference

**Source:** v0-hedrauiredesign113125352126.vercel.app
**Purpose:** Visual reference for potential Sourcing Copilot UI
**Status:** Parked

---

## Color Tokens

```css
:root {
  /* Backgrounds */
  --bg-gradient-start: #8b6b5d;      /* Warm brown/terracotta */
  --bg-gradient-end: #4a4a4a;        /* Muted gray */
  --card-bg: rgba(30, 30, 30, 0.85); /* Dark translucent */
  --card-inner-bg: #1a1a1a;          /* Darker nested card */

  /* Accent */
  --accent-coral: #e88b7d;           /* Primary action color */
  --accent-coral-light: #f5a89e;     /* Hover state */

  /* Text */
  --text-white: #ffffff;
  --text-muted: #9ca3af;
  --text-secondary: #b0b0b0;

  /* Badge */
  --badge-bg: rgba(232, 139, 125, 0.2);
  --badge-text: #e88b7d;
}
```

## Typography

```css
/* Hero metric */
.hero-number {
  font-size: 6rem;      /* ~96px */
  font-weight: 300;     /* Light */
  letter-spacing: -0.02em;
}

/* Role title */
.role-title {
  font-size: 1.5rem;    /* 24px */
  font-weight: 500;
}

/* Metadata row */
.metadata {
  font-size: 0.875rem;  /* 14px */
  color: var(--text-muted);
  /* Dot-separated: "Stage: searching • Urgency: • Open: days" */
}

/* Card heading */
.card-heading {
  font-size: 1.75rem;   /* 28px */
  font-weight: 600;
}

/* Card description */
.card-description {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
```

## Components

### Glassmorphic Card

```css
.glass-card {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
}
```

### Tab Button Group

```css
.tab-group {
  display: flex;
  gap: 0.5rem;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;  /* Pill shape */
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.tab-button.inactive {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-secondary);
}

.tab-button.active {
  background: var(--accent-coral);
  border: none;
  color: white;
}
```

### Badge/Pill

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: var(--badge-bg);
  color: var(--badge-text);
  font-size: 0.75rem;
  font-weight: 500;
}
```

### Empty State

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem;
  background: var(--card-inner-bg);
  border-radius: 12px;
}

.empty-state-icon {
  width: 48px;
  height: 48px;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.empty-state-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-state-description {
  font-size: 0.875rem;
  color: var(--text-muted);
}
```

## Layout Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back link          Viewing as: [Badge]                       │
│                                                                 │
│                        12weeks                                  │  ← Hero metric
│                  Backend Infrastructure Engineer                │  ← Role title
│              Stage: searching • Urgency: • Open: days          │  ← Metadata
│                                                                 │
│              [🔍 Review Candidates] [📊 Pipeline Status]        │  ← Tab buttons
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │  ← Glass card
│  │                    Review Candidates                      │ │
│  │         Provide feedback on candidates selected...        │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │                                                     │ │ │  ← Inner card
│  │  │              No Candidates to Review                │ │ │
│  │  │       Your Talent Partner hasn't submitted...       │ │ │
│  │  │                                                     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Key Differences from Current Dark Theme

| Aspect | Current (GitHub-style) | Hedra |
|--------|------------------------|-------|
| Background | Solid dark (`#0d1117`) | Warm gradient |
| Cards | Solid with borders | Glassmorphic blur |
| Accent | Blue/green | Coral/salmon |
| Feel | Technical, utilitarian | Warm, premium |

## When to Use

This design language would work well for:
- **Sourcing Copilot** — HM-facing review interface (warmer, less technical)
- **Client-facing dashboards** — More polished than internal tools

Probably keep the GitHub-dark theme for:
- **Pipeline Tracker** — Internal recruiter tool
- **Search Kit Library** — Technical sourcing tool
- **TuriCRM** — Power-user search interface

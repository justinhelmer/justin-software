---
title: "Systems that compose"
date: 2026-04-10
description: "On building infrastructure that holds."
---

The best systems are the ones you forget are there. They compose so naturally that the boundary between one system and the next dissolves — what remains is just the thing you were trying to build.

This is a seed post. It exists to prove the pipeline works: markdown in, HTML out, git as the CMS.

## What composition means

A composable system has three properties:

1. **Clear interfaces** — you can describe what it does without describing how
2. **No hidden state** — the output is a function of the input, nothing else
3. **Graceful failure** — when it breaks, it breaks at the seam, not in the middle

## Why it matters

Every abstraction is a bet that the boundary you drew will hold. Good abstractions pay dividends for years. Bad ones collect interest.

The goal isn't to write code that's clever. It's to write code that's **obvious** — so obvious that the next person (or the next agent) can pick it up and extend it without reading the implementation.

```javascript
// The interface is the contract.
// The implementation is a detail.
function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}
```

Build systems that compose. Everything else follows.

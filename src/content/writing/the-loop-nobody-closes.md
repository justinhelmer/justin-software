---
title: "The Loop Nobody Closes"
description: "Coding agents nail write, test, review, merge. None of them go near what happens after. A real incident, real code, and why the gap can finally close."
date: 2026-09-10
---

**TL;DR:** Writing software got fast. Knowing whether it *works* has not. Here's what closing that gap actually looks like: a real incident, the real code, and the numbers.

An agent can turn a paragraph into a working feature before your coffee's cold. Anthropic will run that agent for you. Cloudflare will run it for you. Vercel will run it for you. So will a thousand smaller platforms, each tuned to one stack or one industry. Every one of them has nailed the same stretch: write, test, review, merge.

None of them go near what happens after.

Call it the SDLC if you want the textbook name: plan, build, ship, live with it, learn, repeat. AI has been eating that arc from the front. Planning and building got faster first. That's where the coding agents live. Shipping is catching up too, one green pipeline at a time. The back half of the arc hasn't moved: owning what you shipped, having the confidence to ship the next thing, understanding it when it breaks, making sure it doesn't break the same way twice.

Shipping fast was never about speed. It's about how many times you [get to go around one loop](https://www.honeycomb.io/blog/you-had-one-job-why-twenty-years-of-devops-has-failed-to-do-it): deploy, observe, learn.

<img src="/diagrams/a1f5ec21.svg" alt="Deploy leads to observe leads to learn, back to deploy" />

Every turn round that loop teaches you something about what you built. A deploy nobody observes is an open loop. You shipped. You learned nothing.

## Two loops, and they've never met

Look at how software actually gets built. You'll find two loops running side by side, not one. Developers have a fast, satisfying loop: write, test, review, merge. It lives in the editor. It answers in seconds. It feels good every single time. Operators have a loop too: get paged, investigate, fix. It runs at three in the morning, alone, lit by a dashboard.

<img src="/diagrams/a937776d.svg" alt="Developer loop of write, test, review, merge, deploying to production; operator loop of page, investigate, fix, triggered by production incidents" />

Neither loop touches the other. The developer's ends at merge. The operator's starts at an alert. What a change did in production reaches the person who wrote it only by accident, usually as a Slack message: "hey, did anything change yesterday?"

That accident isn't carelessness, it's a missing join. A trace knows which pod handled a request and, if someone wired `service.version` into the resource attributes, which build. It doesn't know which pull request that build came from, which lines changed, or who reviewed them. Even teams with mature OpenTelemetry setups stop at the build id, because going further means modeling the infrastructure as a graph: this route calls this queue, this queue writes this table, this table is read by that other service nobody on the team has opened in months. Polylane calls that a context graph. Almost nobody builds one, because it's not a logging problem. It's a data-modeling problem, and it sits on nobody's roadmap until the day it's the only thing that would have told you where to look.

Ownership falls into that gap and never climbs back out. The code is still technically yours. But nobody built you a way to know what it's doing. So "yours" stops meaning anything.

That gap, the stretch between merge and the next commit, is the part of the lifecycle nobody designs for. It has been open for as long as I've been writing code for a living, and closing it for real means building the context graph, not adding another dashboard.

## It was never a willpower problem

Almost 20 years building production software taught me the same lesson every time. Managing software doing billions of requests a day at four nines. Closing this loop was never a willpower problem. It's arithmetic that doesn't "math".

- **It costs more than the feature.** Wiring a custom span, naming it well, and reading the result back routinely takes longer than the feature it's instrumenting. Every team runs that maths in the first sprint. Most of them, correctly, skip it.
- **The tools live somewhere else.** Three pillars, four dashboards, a query language only the platform team speaks fluently, none of it inside the editor or the pull request. "Go check the dashboard" only works for people who already live in the dashboard. Developers don't. That's how an observability seat goes unopened by week two. The fix isn't a better dashboard, it's not needing the query language at all: a resource ships with the questions worth asking about it already attached, each one paired with the provider query that answers it, so "is this queue backing up" is a fact you're handed, not a PromQL string you look up.
- **Developers and operators were never asking the same question.** Ops watches disks, pods, and queues. Developers want to know which commit, which flag, which user. Buy a tool that answers the first question well. The people asking the second one are still stuck.

None of that is laziness, on either side. It's economics. Closing the loop cost more than the value it returned. So the industry left it open. It got very good at [building pagers](https://www.pagerduty.com) instead.

That's the gap we work on closing now, at [Polylane](https://polylane.com): modeling the infrastructure as a context graph instead of a pile of dashboards, debugging Cloudflare Durable Objects, chasing memory bugs in agent systems, wiring the result straight into code review. None of it is glamorous. All of it is the actual work.

## What closing the loop actually looks like

Say a deploy ships Tuesday at 2pm. Wednesday morning, checkout's p95 latency is up 40%. Nobody's noticed yet, because nobody's watching that specific number on that specific path.

Here's the difference between an open loop and a closed one, step by step.

**Open loop:** a customer complains. Someone opens a dashboard. They don't know which of Tuesday's six deploys touched checkout, so they check all six. Forty minutes in, they find the one that swapped a cached lookup for a synchronous call. They open a pull request. It gets reviewed the next morning.

**Closed loop:** the signal fires the moment p95 crosses its baseline. Checkout's route is a node in the context graph, its cache layer and the six services behind it are neighbors, and the deploys that touched any of them in the last day are already on record, so the search for a cause starts at six candidates instead of an open dashboard. It's the same traversal an incident review runs by hand, hours later, run automatically, in the minute the metric moves. The investigation pulls the diff, the before-and-after latency, and the specific function. There's a pull request before the customer's second complaint lands.

Same bug. Same fix, eventually. The only thing that changed is how many hours sat between "something's wrong" and "here's why."

That's not a hypothetical shape. In August 2026, our own Cloudflare Durable Objects were getting reset about 300 times a day for exceeding the 128 MB isolate limit, not from traffic: the isolate was over budget before it served a single request. Two fixes later, module-scope heap went from 218.6 MB to 82.1 MB and resets went to zero. What pointed us at the real cause wasn't a hunch, it was the memory chart staying just as high during quiet hours as busy ones, which meant the weight was in what shipped, not what served. The [full write-up](https://polylane.com/blog/how-we-fixed-our-cloudflare-durable-objects-memory-exceeded-errors/) has the bundle profiling and both fixes; it's worth the read on its own.

What it doesn't have, because it isn't the point of that post, is where the two loops actually split. A flat memory chart during quiet hours is a fact about the resource, not about a request: nobody had to be paged to notice it, because nothing paged anyone, the reset just happened again a few minutes later and got absorbed as background noise until someone went looking. A context graph that already knows what "normal" looks like for that isolate flags the shape the hour it starts, the same way it would flag a queue depth that stopped correlating with traffic. What that shape *means*, 130 MB of zod schemas evaluated at module load for tools nobody called yet, still took a human reading a bundle profile line by line. Closing the loop gets you to the right question in minutes instead of days. It doesn't skip the part where someone has to answer it.

**Signal → Investigate → Fix → Verify → (and back to Signal.)**

Four phases, the same four every time. That's not new vocabulary invented for this post, it's the same loop named in the product, because an investigation and a post about an investigation should describe the same thing the same way.

## What an agent actually asks for

Here's the difference in code, not just in prose.

The easy version of "give the agent context" is stuffing more into the prompt: paste the error, paste the stack trace, hope the training data covers your specific database driver's specific way of failing.

```ts
// The easy version: hope the prompt has enough in it
const prompt = `
  Fix this bug: ${errorMessage}
  Stack trace: ${stackTrace}
  Here's the file: ${fileContents}
`;
```

That's a snapshot, frozen at prompt time, of whatever the person writing it remembered to paste. It doesn't know what changed Tuesday. It doesn't know if this function has broken this exact way before.

The closed-loop version is a query, not a paste:

```ts
// What "check production before you write the fix" actually looks like.
// Real endpoint, real response shape: GET /v1/autofixes/{workspaceId}/{id}/diff
const res = await fetch(
  `https://api.polylane.com/v1/autofixes/${workspaceId}/${autofixId}/diff`,
  { headers: { Authorization: `Bearer ${token}` } },
);
const { result } = await res.json();
// result: { prNumber, prUrl, diff, truncated, totalChars, source }
// source is "pull_request" when a PR already exists for this fix, or
// "authored_patch" when the investigation wrote the patch itself and
// nothing's open yet. Either way `diff` is real, reviewable code, not
// a description of what the fix should do.
```

Same job. One of them is guessing what's relevant. The other already knows, and hands over something you can `git apply`, not a paragraph to reinterpret.

## The fix is bringing production to whoever writes the next line

The fix was never "developers should look at dashboards more". Developers were right to skip a tool that cost more than the feature it was validating. The fix is bringing what production already knows to whatever writes the code, before it writes the next line.

If an agent is about to open a pull request, it should already know what the code it's touching does in production: how much traffic runs through it, which incidents have touched these files recently, what the last change here actually broke. That's not a dashboard a developer visits between meetings. It's context an agent asks for automatically, the same way it already reads the repo before it starts typing.

This is what [Polylane](https://polylane.com) does. Not the harness that runs the agent. Plenty of excellent ones exist, and more are coming. The segment of the loop from deploy back to the editor: watch what's happening in production, work out when it changes, explain why in terms of the actual code and infrastructure behind it, and hand that explanation to whatever writes the next commit.

**Coding agent → merge → deploy → production → observe → detect → understand → (back to coding agent.)**

**Before merge**, the pull request is checked against the context graph, not a linter: the changed files resolve to the services, queues, and tables they actually touch in production, and from there to a deterministic blast radius, computed before the change exists anywhere except this branch. Nobody has to be paged first for this one; the question is "what would break," not "what broke." The verdict shows up as a comment, plus a "Polylane production impact" check sitting right next to CI.

**After deploy**, watching is already on. Nobody configures it, because every resource in the context graph ships with the questions worth asking about it and the provider query that answers each one, not a dashboard someone has to build first. A regression gets tied to the exact change behind it instead of a vague spike nobody's watching at 2am. When the fix is code, it arrives the way every fix should: as a pull request. Your review and CI gate the merge. Anything with a side effect sits in `needs_approval` until a human moves it to `approved`, the same state machine as any other automation action in the product, nothing skips it by writing straight to production.

**On a bug**, the investigation starts from the failing request, the trace, and the deploy that shipped twelve minutes earlier. Not from a ticket that says "it's slow sometimes". When it resolves to a line of code, the evidence trail goes with it: as a comment on the pull request that caused it, if one's still open, or as a patch the investigation authored itself, if it isn't.

**On the failures nobody pages for**, the same coverage reaches the background jobs, queues, and cron schedules that break silently: no alert fires. They just stop. Nothing downstream notices until a customer does.

**And it compounds.** A confirmed finding becomes a memory, not a Slack thread that scrolls out of relevance by Friday. July's investigation starts already knowing what June's found. The next agent that touches this file inherits what the last one learned, instead of relearning it from nothing.

None of this acts by itself. Every fix is still a pull request. Everything with a side effect still waits for you to say go. The agent gets faster at knowing. You stay the one deciding.

## Misconceptions

### "Isn't this just better alerting?"

No. An alert is a metric name, a threshold, and a value: `checkout_p95_ms > 400`. That's a fact about a number, and someone still has to turn it into a hypothesis. What comes out of this loop is a diff, the deploy that shipped it, and the trace that proves the connection, the thing a human would produce forty minutes into the investigation the alert only started. Alerting tells you a symptom crossed a line. This starts from the line already knowing which commit drew it.

### "Doesn't the agent need write access to production for any of this?"

No, and it doesn't get it. Reading the context graph, the metrics, and the logs takes a read scope, the same one a dashboard would need. Anything with a side effect, a rollback, a scale-up, a restart, is an automation action, and every automation action carries a state before it carries an effect: it sits in `needs_approval` until a specific human moves it to `approved`. There's no path from "the agent noticed something" to "the agent changed something" that skips that state. The loop closes the information gap. The approval gap stays exactly as wide as you set it.

### "Why not just give the coding agent a longer context window?"

Because the honest failure mode was never running out of room, it was not knowing to go looking. Even the diff endpoint earlier in this post ships a `truncated` flag and a `totalChars` count on every response, because the team that built it hit the same limit everyone does: past some size, more context stops helping and starts costing accuracy. A bigger window holds more of what you hand it. It still doesn't tell you what happened in production at 2pm on Tuesday, because that fact doesn't live in the prompt. It lives in a system that was watching at 2pm, and a window, however long, isn't watching anything.

## The unglamorous half is the whole game

There's a reason this end of the lifecycle stayed broken while everything upstream of it got a decade of gorgeous tooling. It's hard. It's invisible when it's working. And until agents needed the answer as badly as humans do, the economics never supported doing it properly. But the simpler reason is that it isn't fun. Writing the new thing is fun. Owning the old thing isn't. Getting paged when it breaks and proving it won't happen again isn't either. Given the choice, everyone picks the new thing. That's not a character flaw. Nobody got into this job to stare at a dashboard at 2am.

So somebody has to take that shift. That's the bet I'm making, at Polylane: software that's on call for you. So the shift you're dreading isn't what stands between you and the next feature. You keep building. It keeps watching what you built.

Which is exactly why it's the job worth having. When anyone can build anything, the only edge left is knowing whether what you built works. And getting that answer back to whatever builds the next thing, before it needs to ask twice. Close that loop. Every fast new loop upstream compounds instead of repeating.

It's been open for decades. I'm closing it.

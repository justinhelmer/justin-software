---
title: "Everything got faster except this"
date: 2026-09-10
description: "Eighteen years of shipping software, and the slow half of the job never moved. Notes on the part nobody's fixed yet, and what I'm building about it now."
---

I've shipped code at retail scale, on the days retail means the most. I've run platforms doing billions of requests a day and had to hold four nines while doing it. Different companies, different stacks, same shape every time.

Writing the code got faster. Every year, every job, every new tool. Shipping it got faster too, eventually. CI, feature flags, one-click rollouts.

The other half never did.

Knowing whether what you shipped actually worked. Finding out before a customer tells you. Understanding *why* it broke instead of just that it broke. Eighteen years in, that part still runs on dashboards nobody has open, alerts tuned to yesterday's incident, and a Slack thread that answers the question once and forgets it by Friday.

I used to think that was a discipline problem. Teams that cared enough would close the loop. Teams that didn't, wouldn't.

It's not discipline. It's arithmetic. Instrumenting a change properly and reading the result back costs more time than most teams have, most sprints. So they skip it, correctly, and pay for it later in a worse currency: an incident nobody saw coming, a fix that doesn't stick, the same bug filed twice under two different names.

That's the part of the job I'm working on now, at [Polylane](https://polylane.com). Not another dashboard. The piece that was always missing: production knowledge handed to whoever's about to write the next line of code, automatically, before they ask for it.

I wrote up what that actually looks like. Real incident, real numbers, real code, [on the Polylane blog](https://polylane.com/blog/close-the-loop). Worth the longer read if any of this sounds familiar.

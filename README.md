# Hall of Fame Demo

A demo of the Sleeper Hall of Fame with two 12-team leagues, switchable at the top of the menu:

- **Redraft**: a made-up league, ten seasons (2017–2026), a new draft every year. Every name and stat is randomly generated. On draft day a few teams swap picks (picks only, never players), and the draft honours them.
- **Dynasty (real players)**: a superflex PPR league (no kickers or defenses) built on **real NFL players and their real weekly PPR scores and box scores, 2016–2026** (from [nflverse](https://github.com/nflverse/nflverse-data), packed into `real.json`). The 12 managers are simulated: a 2016 startup draft, a rookie draft every year after (rookies ranked mainly by real NFL draft capital, with a superflex QB bump and manager-to-manager noise), supplemental drafts in 2020, 2023 and 2026, trades, waivers and weekly lineups. 2026 runs through the latest week in the data.

Redraft trades are judged in a vacuum: each player is worth his points above a replacement-level starter at his position for the rest of the season after the trade (every game he played, for any team), never below 0, so a 2-for-1 of near-replacement depth adds little. A traded pick is worth the points above replacement that pick's slot is expected to give, the same number the draft grades use. A side's trade score is value got minus value given.

Dynasty trades are judged in a vacuum over four seasons: each player's value in the trade season (weeks after the trade) and the next three, the same per-season value the rookie-draft grades use (points above replacement, elite seasons multiplied), counted at 100% / 85% / 70% / 55%, whichever team he played for. Traded rookie picks keep a fixed value: what that slot (or the round, before the order is set) is expected to give over the same window. Until a league has its own finished rookie classes, pick values start from a chart built from this demo (real NFL rookies, 12-team superflex PPR) and shift toward the league's own results as they come in. Some demo dynasty trades include future rookie picks.

Everything is generated in the browser from a seed, so the same link always shows the same league. "New league" (top right) re-runs it with different managers (`?seed=<number>`).

`real.json` is rebuilt from nflverse with the script kept outside this repo (`build_real.py`, included here).

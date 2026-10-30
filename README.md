# Hall of Fame Demo

A demo of the Sleeper Hall of Fame with two 12-team leagues, switchable at the top of the menu:

- **Redraft**: a made-up league, ten seasons (2017–2026), a new draft every year. Every name and stat is randomly generated. On draft day a few teams swap picks (picks only, never players), and the draft honours them.
- **Dynasty (real players)**: a superflex PPR league (no kickers or defenses) built on **real NFL players and their real weekly PPR scores and box scores, 2016–2026** (from [nflverse](https://github.com/nflverse/nflverse-data), packed into `real.json`). The 12 managers are simulated: a 2016 startup draft, a rookie draft every year after (rookies ranked mainly by real NFL draft capital, with a superflex QB bump and manager-to-manager noise), supplemental drafts in 2020, 2023 and 2026, trades, waivers and weekly lineups. 2026 runs through the latest week in the data.

Redraft trades are judged in a vacuum: each player is worth his points above a replacement-level starter at his position for the rest of the season after the trade (every game he played, for any team), never below 0, so a 2-for-1 of near-replacement depth adds little. A traded pick is worth the points above replacement that pick's slot is expected to give, the same number the draft grades use. A side's trade score is value got minus value given.

Everything is generated in the browser from a seed, so the same link always shows the same league. "New league" (top right) re-runs it with different managers (`?seed=<number>`).

`real.json` is rebuilt from nflverse with the script kept outside this repo (`build_real.py`, included here).

// Settings shared by every league. The league itself comes from the page address
// (?league=<id>&u=<username>), chosen on the start screen.
export const CONFIG = {
  appName: 'Hall of Fame Demo',

  // Manager Score weights (must add up to 1). Dynasty leagues leave out the draft part.
  weights: { results: 0.35, startSit: 0.20, waivers: 0.15, trades: 0.20, draft: 0.10 },

  // Redraft draft grades: share of each pick's expected value that comes from hindsight
  // (the Nth-best player's value that season for pick N). The rest comes from what
  // that slot has produced across the league's drafts. 0 = slot history only.
  draftHindsight: 0.3,

  // Kickers and defenses count for this share of their value in waiver, trade and draft numbers
  // (they're easy to replace and swing week to week). 1 = full value.
  kDefWeight: 0.5,

  // Dynasty trades: seasons counted after a trade (the trade season is the first), how much less each later season
  // counts, and the extra a season counts for the receiving team when it made the playoffs or won the title.
  dynTrade: { seasons: 4, decay: 0.15, playoffBonus: 0.10, titleBonus: 0.25 },

  // Bonus points added to the Results part of the score.
  bonus: { playoffs: 3, final: 5, title: 15 },

  // How often the live tab refreshes scores while open (seconds).
  liveRefreshSeconds: 60,

  // Simulated seasons for playoff and title odds.
  simulations: 10000
};

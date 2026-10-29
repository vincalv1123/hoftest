// Demo data: a made-up 12-team redraft league that has run for ten seasons (2017–2026).
// Nothing here talks to Sleeper. It builds the same shapes the real site loads, so every page works the same.
// The same seed always makes the same league; ?seed=<number> makes a different one.

const FIRST = 2017;
const CURRENT = 2026;
const LIVE_WEEK = 8;            // week being played "right now" in the current season
const TEAMS = 12;
const PSTART = 15;              // playoffs weeks 15–17
const LAST_WEEK = PSTART + 2;
const SLOTS = ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'K', 'DEF'];
const ROSTER_POSITIONS = SLOTS.concat(['BN', 'BN', 'BN', 'BN', 'BN', 'BN']);
const ROUNDS = ROSTER_POSITIONS.length;
const ELIG = { QB: ['QB'], RB: ['RB'], WR: ['WR'], TE: ['TE'], K: ['K'], DEF: ['DEF'], FLEX: ['RB', 'WR', 'TE'] };
const LEAGUE_NAME = 'Demo League';

// ---------- random numbers ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
let R = rng(1);
const rand = () => R();
const randint = (a, b) => a + Math.floor(rand() * (b - a + 1));
const pick = xs => xs[Math.floor(rand() * xs.length)];
function normal() { let u = 0; let v = 0; while (u === 0) u = rand(); while (v === 0) v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function shuffle(xs) { const a = xs.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const r2 = x => Math.round(x * 100) / 100;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

// ---------- names ----------
const FIRSTS = ['Marcus', 'Tyrell', 'Jalen', 'Devin', 'Caleb', 'Brock', 'Dante', 'Quinton', 'Trey', 'Malik', 'Logan', 'Isaiah', 'Kendrick', 'Austin', 'Rashad', 'Cole', 'Darius', 'Jordan', 'Tanner', 'Xavier', 'Bryce', 'Deshawn', 'Garrett', 'Hunter', 'Jamal', 'Kyler', 'Lamont', 'Mason', 'Nate', 'Omar', 'Preston', 'Reggie', 'Shane', 'Terrence', 'Victor', 'Wes', 'Zeke', 'Andre', 'Bo', 'Cedric', 'Dwayne', 'Eli', 'Felix', 'Grady', 'Hollis', 'Ivan', 'Jace', 'Kobe', 'Luke', 'Myles', 'Nico', 'Owen', 'Percy', 'Rico', 'Sam', 'Theo', 'Ty', 'Vance', 'Wyatt', 'Zion', 'Carter', 'Drew', 'Emmitt', 'Gus'];
const LASTS = ['Holloway', 'Prescott', 'Whitfield', 'Barnes', 'Calloway', 'Dunmore', 'Ellison', 'Fairchild', 'Granger', 'Hargrove', 'Ingram', 'Jefferson', 'Kingsley', 'Langford', 'Mercer', 'Norwood', 'Okafor', 'Pembrook', 'Quarles', 'Redding', 'Sutton', 'Thornbury', 'Underwood', 'Vasquez', 'Westbrook', 'Yarbrough', 'Abernathy', 'Blackwell', 'Crenshaw', 'Delaney', 'Easton', 'Fontaine', 'Gaines', 'Hawthorne', 'Irving', 'Jessup', 'Kincaid', 'Lockhart', 'Maddox', 'Nettles', 'Oakley', 'Pruitt', 'Rhodes', 'Stallworth', 'Tillman', 'Upshaw', 'Vaughn', 'Whitaker', 'Yeager', 'Ashford', 'Bramlett', 'Coleridge', 'Dorsey', 'Everly', 'Fulton', 'Gentry', 'Haskins', 'Jennings', 'Kearse', 'Lyle', 'Montague', 'Nix', 'Overton', 'Pickett', 'Ransom', 'Shelby', 'Tatum', 'Vick', 'Wakefield', 'Boone', 'Cruz', 'Darby', 'Frost', 'Hale', 'Knox', 'Lane', 'Moss', 'Pace', 'Reed', 'Stone'];
const CITIES = ['Portland', 'San Antonio', 'Oklahoma City', 'Salt Lake', 'Birmingham', 'Omaha', 'Albuquerque', 'Sacramento', 'Memphis', 'Louisville', 'Hartford', 'Boise', 'Tulsa', 'Richmond', 'Raleigh', 'Columbus', 'Austin', 'Honolulu', 'Anchorage', 'Spokane', 'El Paso', 'Fresno', 'Toledo', 'Wichita', 'Providence', 'Little Rock', 'Des Moines', 'Charleston', 'Madison', 'Reno', 'Savannah', 'Lexington'];
const MASCOTS = ['Pioneers', 'Outlaws', 'Thunder', 'Stallions', 'Ironmen', 'Comets', 'Coyotes', 'Rapids', 'Monarchs', 'Hounds', 'Wolves', 'Rangers', 'Mustangs', 'Hurricanes', 'Foxes', 'Titans', 'Cyclones', 'Sharks', 'Grizzlies', 'Harbormasters', 'Vipers', 'Bison', 'Falcons', 'Barons', 'Mariners', 'Lumberjacks', 'Scorpions', 'Hawks', 'Badgers', 'Aces', 'Tide', 'Generals'];
const USERS = ['GridironGuru', 'waiverwire_wizard', 'TDTommy', 'BenchWarmer99', 'fantasy_phenom', 'PuntGod', 'HailMaryHank', 'TacoTuesdayFF', 'DynastyDan', 'SackMaster', 'RedZoneRita', 'FourthAndLong', 'TheCommish', 'KickoffKing', 'blitzburgh_bro'];
const TEAM_NAMES = ['Show Me Your TDs', 'Tua Legit Tua Quit', 'The Replacements', 'Victorious Secret', 'Bench Mob', 'Kamara Shy', 'Run CMC', 'Mixon It Up', 'Dak to the Future', 'Hurts So Good', 'Lamb Chops', 'Tyreek Havoc', 'Waiver Wire Warriors', 'Sunday Scaries', 'Fourth & Goal', 'Gronk Squad', 'Kittle Me This', 'Purdy Good', 'Chase Bank', 'Najee by Nature', 'Bijan Mustard', 'Breece Lightning', 'The Fighting Mahomies', 'Nacua Matata'];

// ---------- the player pool ----------
const POS_CFG = {
  QB: { n: 34, top: 25, low: 9, sd: 0.33, peak: [26, 33], exit: 37 },
  RB: { n: 72, top: 20, low: 3.5, sd: 0.48, peak: [22, 26], exit: 31 },
  WR: { n: 96, top: 19, low: 3.5, sd: 0.5, peak: [24, 29], exit: 33 },
  TE: { n: 36, top: 15, low: 3, sd: 0.52, peak: [25, 30], exit: 34 },
  K: { n: 32, top: 9.5, low: 6.5, sd: 0.42, peak: [24, 38], exit: 41 },
  DEF: { n: 32, top: 9.5, low: 4.5, sd: 0.7, peak: [0, 99], exit: 999 }
};
const REPL = { QB: 13, RB: 30, WR: 34, TE: 13, K: 12, DEF: 12 };

let players = {};       // id -> { id, name, pos, talent, born, team, retired }
let nextId = 1000;
const usedNames = new Set();

function personName() {
  for (let i = 0; i < 50; i++) { const n = pick(FIRSTS) + ' ' + pick(LASTS); if (!usedNames.has(n)) { usedNames.add(n); return n; } }
  return pick(FIRSTS) + ' ' + pick(LASTS) + ' Jr.';
}
function talentFor(pos) { const c = POS_CFG[pos]; return c.low + (c.top - c.low) * Math.pow(rand(), 2.1); }
function newPlayer(pos, season, rookie) {
  const id = String(nextId++);
  const age = rookie ? randint(21, 23) : randint(21, 32);
  const p = { id, pos, name: personName(), talent: talentFor(pos), born: season - age, team: randint(0, 31), retired: null };
  if (rookie) p.talent *= 0.85 + rand() * 0.45; // rookies are a lottery
  players[id] = p;
  return p;
}
function ageFactor(p, season) {
  if (p.pos === 'DEF') return 1;
  const c = POS_CFG[p.pos]; const age = season - p.born;
  if (age < c.peak[0]) return 0.72 + 0.28 * Math.max(0, 1 - (c.peak[0] - age) / 4);
  if (age <= c.peak[1]) return 1;
  return Math.max(0.35, 1 - 0.09 * (age - c.peak[1]));
}

// ---------- league setup ----------
function buildManagers() {
  const names = shuffle(USERS);
  return names.map((n, i) => ({ id: String(700000 + i), name: n, skill: normal(), activity: clamp(0.35 + 0.18 * normal(), 0.08, 0.75), teamName: pick(TEAM_NAMES) }));
}

function roundRobin(ids) {
  const a = ids.slice(); const weeks = [];
  for (let r = 0; r < a.length - 1; r++) {
    const pairs = [];
    for (let i = 0; i < a.length / 2; i++) pairs.push([a[i], a[a.length - 1 - i]]);
    weeks.push(pairs);
    a.splice(1, 0, a.pop());
  }
  return weeks;
}

// ---------- one season ----------
function simulateSeason(season, owners, isCurrent) {
  const leagueId = 'demo-' + season;
  const rids = owners.map((_, i) => i + 1);
  const mgr = {}; rids.forEach(r => { mgr[r] = owners[r - 1]; });

  // Season form: true points per game, byes, injuries.
  const active = Object.values(players).filter(p => p.retired == null);
  const byeOf = {}; for (let t = 0; t < 32; t++) byeOf[t] = randint(5, 14);
  const form = {};
  active.forEach(p => {
    const c = POS_CFG[p.pos];
    const ppg = Math.max(0.5, p.talent * ageFactor(p, season) * (1 + 0.16 * normal()));
    const out = new Set();
    if (p.pos !== 'DEF' && p.pos !== 'K' && rand() < 0.3) {
      const start = randint(1, LAST_WEEK); const len = rand() < 0.12 ? 20 : randint(1, 5);
      for (let w = start; w < start + len; w++) out.add(w);
    }
    form[p.id] = { ppg, sd: c.sd, out, bye: byeOf[p.team], expect: p.talent * ageFactor(p, season) };
  });
  const weekPts = {}; // pid -> week -> pts
  const ptsFor = (pid, w) => {
    const f = form[pid]; if (!f) return 0;
    const k = weekPts[pid] = weekPts[pid] || {};
    if (k[w] == null) {
      if (w === f.bye || f.out.has(w)) k[w] = 0;
      else if (players[pid].pos === 'DEF') k[w] = Math.round(f.ppg + 6 * normal());
      else if (players[pid].pos === 'K') k[w] = Math.max(0, Math.round(f.ppg + f.ppg * f.sd * normal()));
      else k[w] = r2(Math.max(-1.5, f.ppg + f.ppg * f.sd * normal()));
    }
    return k[w];
  };
  const played = (pid, w) => w !== form[pid].bye && !form[pid].out.has(w);

  // How a manager values a player: expected points over replacement, blurred by how good he is.
  const replLevel = {};
  Object.keys(POS_CFG).forEach(pos => {
    const xs = active.filter(p => p.pos === pos).map(p => form[p.id].expect).sort((a, b) => b - a);
    replLevel[pos] = xs[Math.min(xs.length - 1, REPL[pos] - 1)] || 0;
  });
  const perceived = {};
  const perceive = (r, pid) => {
    const key = r + ':' + pid;
    if (perceived[key] == null) {
      const p = players[pid]; const rookie = season - p.born <= 22;
      const blur = (0.2 - 0.045 * mgr[r].skill) * (rookie ? 1.6 : 1);
      perceived[key] = form[pid].expect * (1 + Math.max(0.05, blur) * normal());
    }
    return perceived[key];
  };
  const vor = (r, pid) => perceive(r, pid) - replLevel[players[pid].pos];

  // Draft (snake).
  const order = shuffle(rids);
  const roster = {}; rids.forEach(r => { roster[r] = []; });
  const taken = new Set();
  const picks = [];
  const caps = { QB: 2, RB: 6, WR: 7, TE: 2, K: 1, DEF: 1 };
  let pickNo = 0;
  for (let rd = 1; rd <= ROUNDS; rd++) {
    const seq = rd % 2 ? order : order.slice().reverse();
    seq.forEach(r => {
      pickNo++;
      const have = {}; roster[r].forEach(pid => { const ps = players[pid].pos; have[ps] = (have[ps] || 0) + 1; });
      const left = ROUNDS - rd;
      let best = null; let bestV = -1e9;
      active.forEach(p => {
        if (taken.has(p.id)) return;
        const n = have[p.pos] || 0;
        if (n >= caps[p.pos]) return;
        if ((p.pos === 'K' || p.pos === 'DEF') && rd < ROUNDS - 3 && left > 1) return;
        let v = vor(r, p.id);
        if ((p.pos === 'K' || p.pos === 'DEF') && !n && left <= 1) v += 100;
        if (p.pos === 'QB' && n >= 1) v -= 4;
        if (p.pos === 'TE' && n >= 1) v -= 4;
        if ((p.pos === 'QB' || p.pos === 'TE') && !n && rd >= 8) v += 3;
        if (v > bestV) { bestV = v; best = p; }
      });
      taken.add(best.id);
      roster[r].push(best.id);
      picks.push({ round: rd, pick_no: pickNo, player_id: best.id, roster_id: r, picked_by: mgr[r].id, pos: best.pos });
    });
  }

  // Weekly lineups, scores, waivers and trades.
  const scheduleRR = roundRobin(shuffle(rids));
  const regWeeks = PSTART - 1;
  const schedule = []; for (let w = 1; w <= regWeeks; w++) schedule.push(scheduleRR[(w - 1) % scheduleRR.length]);
  const transactions = [];
  const faab = {}; rids.forEach(r => { faab[r] = 100; });
  const baseTime = Date.UTC(season, 8, 5);
  const scoredThrough = isCurrent ? LIVE_WEEK - 1 : LAST_WEEK;
  const lastPlayed = isCurrent ? LIVE_WEEK : LAST_WEEK;
  const recentAvg = (pid, w) => { let t = 0; let n = 0; for (let k = Math.max(1, w - 4); k < w; k++) if (played(pid, k)) { t += ptsFor(pid, k); n++; } return n ? t / n : null; };
  const projection = (r, pid, w) => {
    const f = form[pid];
    if (w === f.bye) return -50;
    if (f.out.has(w) && rand() < 0.88 + 0.06 * mgr[r].skill) return -50;
    const recent = recentAvg(pid, w);
    const base = recent == null ? perceive(r, pid) : 0.55 * perceive(r, pid) + 0.45 * recent;
    return base * (1 + (0.22 - 0.05 * mgr[r].skill) * normal());
  };
  function setLineup(r, w) {
    const proj = {}; roster[r].forEach(pid => { proj[pid] = projection(r, pid, w); });
    const used = new Set(); const starters = [];
    const lazy = rand() < clamp(0.04 - 0.02 * mgr[r].skill, 0, 0.1);
    const fillOrder = SLOTS.map((s, i) => ({ s, i })).sort((a, b) => ELIG[a.s].length - ELIG[b.s].length);
    const chosen = new Array(SLOTS.length).fill('0');
    fillOrder.forEach(({ s, i }) => {
      const pool = roster[r].filter(pid => !used.has(pid) && ELIG[s].indexOf(players[pid].pos) >= 0)
        .sort((a, b) => (lazy ? perceive(r, b) - perceive(r, a) : proj[b] - proj[a]));
      if (pool.length) { chosen[i] = pool[0]; used.add(pool[0]); }
    });
    starters.push.apply(starters, chosen);
    return starters;
  }
  const byWeek = [];
  const lineup = {};
  for (let w = 1; w <= LAST_WEEK; w++) {
    // Moves before this week's games.
    if (w > 1 && w <= Math.min(lastPlayed, PSTART + 1)) {
      // Trades.
      if (w >= 3 && w <= 11 && rand() < 0.62) {
        const [a, b] = shuffle(rids).slice(0, 2);
        const offer = roster[a].filter(pid => players[pid].pos !== 'K' && players[pid].pos !== 'DEF').sort(() => rand() - 0.5);
        for (const pa of offer.slice(0, 6)) {
          const va = perceive(a, pa);
          const back = roster[b].find(pb => players[pb].pos !== 'K' && players[pb].pos !== 'DEF' && Math.abs(perceive(b, pb) - va) < va * 0.22 && perceive(a, pb) > va * 0.95);
          if (back) {
            roster[a] = roster[a].filter(x => x !== pa).concat([back]);
            roster[b] = roster[b].filter(x => x !== back).concat([pa]);
            transactions.push({ type: 'trade', leg: w, adds: { [back]: a, [pa]: b }, drops: { [pa]: a, [back]: b }, roster_ids: [a, b], bid: null, created: baseTime + w * 7 * 864e5 - 3 * 864e5 + randint(0, 864e5), picks: [] });
            break;
          }
        }
      }
      // Waivers and free agents.
      const owned = new Set([].concat.apply([], rids.map(r => roster[r])));
      shuffle(rids).forEach(r => {
        const moves = rand() < mgr[r].activity ? (rand() < 0.3 ? 2 : 1) : 0;
        for (let k = 0; k < moves; k++) {
          const fa = active.filter(p => !owned.has(p.id) && p.pos !== 'K' && p.pos !== 'DEF' && !form[p.id].out.has(w));
          if (!fa.length) break;
          const scoreFa = p => { const rec = recentAvg(p.id, w); return (rec == null ? form[p.id].expect * 0.8 : 0.4 * form[p.id].expect + 0.6 * rec) * (1 + (0.3 - 0.08 * mgr[r].skill) * normal()); };
          const cand = fa.map(p => ({ p, v: scoreFa(p) })).sort((x, y) => y.v - x.v)[0];
          const keep = roster[r].map(pid => ({ pid, v: form[pid].out.has(w) && form[pid].out.has(w + 3) ? -10 : perceive(r, pid) * 0.7 + (recentAvg(pid, w) || 0) * 0.3 }))
            .filter(x => { const ps = players[x.pid].pos; return roster[r].filter(q => players[q].pos === ps).length > (ps === 'QB' || ps === 'TE' || ps === 'K' || ps === 'DEF' ? 1 : 2); })
            .sort((x, y) => x.v - y.v)[0];
          if (!keep || cand.v < keep.v * 1.05) break;
          const bid = Math.min(faab[r], Math.max(0, Math.round(cand.v * (1.2 + rand() * 1.5) - 6)));
          const isWaiver = rand() < 0.75;
          if (isWaiver) faab[r] -= bid;
          roster[r] = roster[r].filter(x => x !== keep.pid).concat([cand.p.id]);
          owned.delete(keep.pid); owned.add(cand.p.id);
          transactions.push({ type: isWaiver ? 'waiver' : 'free_agent', leg: w, adds: { [cand.p.id]: r }, drops: { [keep.pid]: r }, roster_ids: [r], bid: isWaiver ? bid : null, created: baseTime + w * 7 * 864e5 - 4 * 864e5 + randint(0, 864e5), picks: [] });
        }
      });
    }
    const list = [];
    rids.forEach(r => {
      const future = w > lastPlayed;
      const starters = future ? [] : setLineup(r, w);
      lineup[r] = starters;
      const pp = {};
      if (!future) roster[r].forEach(pid => { pp[pid] = ptsFor(pid, w); });
      list.push({ roster_id: r, matchup_id: null, points: future ? 0 : r2(starters.reduce((t, pid) => t + (pid === '0' ? 0 : pp[pid]), 0)), starters, players: roster[r].slice(), players_points: pp });
    });
    byWeek.push(list);
  }
  const entry = (w, r) => byWeek[w - 1][r - 1];

  // Regular-season matchups.
  for (let w = 1; w <= regWeeks; w++) schedule[w - 1].forEach(([a, b], i) => { entry(w, a).matchup_id = i + 1; entry(w, b).matchup_id = i + 1; });

  // Live week: games still being played.
  if (isCurrent) {
    const slot = {}; for (let t = 0; t < 32; t++) slot[t] = rand();
    byWeek[LIVE_WEEK - 1].forEach(m => {
      Object.keys(m.players_points).forEach(pid => {
        const s = slot[players[pid].team];
        const done = s < 0.45 ? 1 : s < 0.75 ? 0.55 : 0;
        m.players_points[pid] = r2(m.players_points[pid] * done);
        m._full = m._full || {}; m._full[pid] = ptsFor(pid, LIVE_WEEK); m._slot = m._slot || {}; m._slot[pid] = s;
      });
      m.points = r2(m.starters.reduce((t, pid) => t + (m.players_points[pid] || 0), 0));
    });
  }

  // Playoffs (finished seasons only).
  let winners = []; let losers = [];
  if (!isCurrent) {
    const st = {}; rids.forEach(r => { st[r] = { w: 0, pf: 0 }; });
    for (let w = 1; w <= regWeeks; w++) schedule[w - 1].forEach(([a, b]) => {
      const pa = entry(w, a).points; const pb = entry(w, b).points;
      st[a].pf += pa; st[b].pf += pb; if (pa > pb) st[a].w++; else if (pb > pa) st[b].w++; else { st[a].w += 0.5; st[b].w += 0.5; }
    });
    const seeds = rids.slice().sort((a, b) => st[b].w - st[a].w || st[b].pf - st[a].pf);
    const s = k => seeds[k - 1];
    let mid = 0;
    const game = (bracket, r, m, t1, t2, p, lowerWins, extra) => {
      const w = PSTART + r - 1; mid++;
      entry(w, t1).matchup_id = 100 + mid; entry(w, t2).matchup_id = 100 + mid;
      const a = entry(w, t1).points; const b = entry(w, t2).points;
      const hi = a >= b ? t1 : t2; const lo = hi === t1 ? t2 : t1;
      const g = Object.assign({ r, m, t1, t2, w: lowerWins ? lo : hi, l: lowerWins ? hi : lo }, p ? { p } : {}, extra || {});
      bracket.push(g); return g;
    };
    const W = winners;
    const m1 = game(W, 1, 1, s(3), s(6)); const m2 = game(W, 1, 2, s(4), s(5));
    const m3 = game(W, 2, 3, s(1), m2.w, null, false, { t2_from: { w: 2 } }); const m4 = game(W, 2, 4, s(2), m1.w, null, false, { t2_from: { w: 1 } });
    game(W, 2, 5, m1.l, m2.l, 5, false, { t1_from: { l: 1 }, t2_from: { l: 2 } });
    game(W, 3, 6, m3.w, m4.w, 1, false, { t1_from: { w: 3 }, t2_from: { w: 4 } });
    game(W, 3, 7, m3.l, m4.l, 3, false, { t1_from: { l: 3 }, t2_from: { l: 4 } });
    const L = losers;
    const l1 = game(L, 1, 1, s(7), s(10), null, true); const l2 = game(L, 1, 2, s(8), s(9), null, true);
    const l3 = game(L, 2, 3, s(12), l1.w, null, true, { t2_from: { w: 1 } }); const l4 = game(L, 2, 4, s(11), l2.w, null, true, { t2_from: { w: 2 } });
    game(L, 3, 5, l3.w, l4.w, 1, true, { t1_from: { w: 3 }, t2_from: { w: 4 } });
  } else {
    // Future regular-season weeks keep their schedule so the odds can be simulated.
    for (let w = LIVE_WEEK; w <= regWeeks; w++) schedule[w - 1].forEach(([a, b], i) => { entry(w, a).matchup_id = i + 1; entry(w, b).matchup_id = i + 1; });
  }

  const users = rids.map(r => ({ user_id: mgr[r].id, display_name: mgr[r].name, team_name: mgr[r].teamName, avatar: null }));
  return {
    raw: {
      leagueId, season: String(season), name: LEAGUE_NAME, status: isCurrent ? 'in_season' : 'complete', totalRosters: TEAMS,
      rosterPositions: ROSTER_POSITIONS, playoffWeekStart: PSTART, playoffTeams: 6, waiverType: 2, waiverBudget: 100,
      scoredThrough, currentWeek: isCurrent ? LIVE_WEEK : null, users,
      rosters: rids.map(r => ({ roster_id: r, owner_id: mgr[r].id, taxi: [], reserve: [] })),
      winners, losers, picks,
      matchups: byWeek.map(list => list.map(m => ({ roster_id: m.roster_id, matchup_id: m.matchup_id, points: m.points, starters: m.starters, players: m.players, players_points: m.players_points }))),
      transactions: transactions.sort((a, b) => a.created - b.created)
    },
    live: isCurrent ? byWeek[LIVE_WEEK - 1] : null
  };
}

// Players age, retire and get replaced by rookies between seasons.
function offseason(season) {
  Object.values(players).forEach(p => {
    if (p.retired != null || p.pos === 'DEF') return;
    const c = POS_CFG[p.pos]; const age = season - p.born;
    const fading = p.talent * ageFactor(p, season) < c.low * 1.1;
    if (age >= c.exit || (age > c.peak[1] && rand() < 0.25) || (fading && rand() < 0.3)) p.retired = season;
    else {
      p.talent = Math.max(c.low * 0.6, Math.min(c.top * 1.15, p.talent * (1 + 0.1 * normal())));
      if (rand() < 0.12) p.team = randint(0, 31);
    }
  });
  Object.keys(POS_CFG).forEach(pos => {
    if (pos === 'DEF') return;
    const have = Object.values(players).filter(p => p.pos === pos && p.retired == null).length;
    for (let i = have; i < POS_CFG[pos].n; i++) newPlayer(pos, season, true);
  });
}

let built = null;
function build(seed) {
  R = rng(seed);
  players = {}; nextId = 1000; usedNames.clear();
  Object.keys(POS_CFG).forEach(pos => {
    if (pos === 'DEF') { for (let t = 0; t < 32; t++) players['DEF' + t] = { id: 'DEF' + t, pos: 'DEF', name: CITIES[t] + ' ' + MASCOTS[t], talent: talentFor('DEF'), born: 0, team: t, retired: null }; return; }
    for (let i = 0; i < POS_CFG[pos].n; i++) newPlayer(pos, FIRST, false);
  });
  // Managers: twelve founders, three of whom leave over the years and are replaced.
  const pool = buildManagers();
  const owners = pool.slice(0, TEAMS);
  const bench = pool.slice(TEAMS);
  const changes = { 2020: 1, 2022: 1, 2024: 1 };
  const seasons = []; let live = null;
  for (let y = FIRST; y <= CURRENT; y++) {
    if (y > FIRST) offseason(y);
    if (changes[y]) for (let k = 0; k < changes[y]; k++) {
      // The manager with the worst skill is the likeliest to quit.
      const idx = owners.map((o, i) => ({ i, s: o.skill + normal() })).sort((a, b) => a.s - b.s)[0].i;
      owners[idx] = bench.shift();
    }
    owners.forEach(o => { if (rand() < 0.35) o.teamName = pick(TEAM_NAMES); });
    const out = simulateSeason(y, owners, y === CURRENT);
    seasons.push(out.raw);
    if (out.live) live = out.live;
  }
  const names = {};
  Object.values(players).forEach(p => { names[p.id] = [p.name, p.pos]; });
  return { seasons: seasons.reverse(), players: names, live };
}

function seedFromUrl() {
  const s = Number(new URLSearchParams(location.search).get('seed'));
  return Number.isFinite(s) && s > 0 ? Math.floor(s) : 2026;
}

export function clearSavedSeasons() { /* nothing is saved in the demo */ }

export async function loadAll(league, onProgress) {
  onProgress && onProgress('Simulating ten seasons…');
  await new Promise(r => setTimeout(r, 0));
  built = build(seedFromUrl());
  built.startedAt = Date.now();
  return { state: { season: String(CURRENT), week: LIVE_WEEK }, seasons: built.seasons, players: built.players };
}

// The live week keeps scoring while the page is open: late games finish over about ten minutes.
export async function loadLiveWeek() {
  if (!built || !built.live) return [];
  const t = Math.min(1, (Date.now() - built.startedAt) / 600000);
  return built.live.map(m => {
    const pp = {};
    Object.keys(m._full).forEach(pid => {
      const s = m._slot[pid];
      const done = s < 0.45 ? 1 : s < 0.75 ? 0.55 + 0.45 * t : Math.max(0, t * 2 - 1);
      pp[pid] = r2(m._full[pid] * done);
    });
    return { roster_id: m.roster_id, matchup_id: m.matchup_id, starters: m.starters, players: m.players, players_points: pp, points: r2(m.starters.reduce((x, pid) => x + (pp[pid] || 0), 0)) };
  });
}

export async function leagueInfo() { return { id: 'demo', name: LEAGUE_NAME, season: String(CURRENT), format: 'redraft' }; }
export async function lookupUser() { return null; }
export async function nflState() { return { season: String(CURRENT), week: LIVE_WEEK }; }
export async function userLeagues() { return []; }

// Made-up box scores that roughly add up to each player's points that week (same seed, same numbers).
function hashSeed(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function fakeStats(pos, pts, rnd) {
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  if (pos === 'DEF') {
    const allow = pts >= 14 ? ri(0, 10) : pts >= 8 ? ri(10, 20) : pts >= 3 ? ri(17, 27) : ri(24, 41);
    return { sack: ri(0, 5), int: pts >= 8 ? ri(0, 2) : ri(0, 1), fum_rec: ri(0, 1), def_td: pts >= 16 && rnd() < 0.5 ? 1 : 0, pts_allow: allow };
  }
  if (!pts) return null;
  if (pos === 'K') { const fgm = Math.max(0, Math.floor(pts / 3.6)); const xpm = Math.max(0, Math.round(pts - 3 * fgm)); return { fgm, fga: fgm + (rnd() < 0.2 ? 1 : 0), fgm_lng: fgm ? ri(28, 58) : 0, xpm, xpa: xpm }; }
  if (pos === 'QB') {
    const int = rnd() < 0.55 ? 0 : ri(1, 2); const ry = ri(0, 35); let rtd = rnd() < 0.07 ? 1 : 0;
    let td = Math.max(0, Math.round(pts / 9 + (rnd() - 0.5) * 1.6));
    let py = (pts - 4 * td + 2 * int - 0.1 * ry - 6 * rtd) / 0.04;
    while (py < 80 && td > 0) { td--; py += 100; }
    if (py < 80) { rtd = 0; py = Math.max(60, (pts + 2 * int - 0.1 * ry) / 0.04); }
    py = Math.round(Math.min(py, 520));
    const att = Math.max(14, Math.round(py / 7.3 + (rnd() - 0.5) * 8)); const cmp = Math.min(att, Math.round(att * (0.58 + rnd() * 0.14)));
    return { pass_cmp: cmp, pass_att: att, pass_yd: py, pass_td: td, pass_int: int, rush_att: ry ? ri(1, 7) : 0, rush_yd: ry, rush_td: rtd };
  }
  if (pts < 0) return pos === 'RB' ? { rush_att: ri(1, 5), rush_yd: ri(0, 8), fum_lost: 1 } : { rec: 1, rec_tgt: ri(1, 4), rec_yd: ri(0, 8), fum_lost: 1 };
  let td = pts >= 12 ? Math.max(0, Math.round((pts - 8) / 8 + (rnd() - 0.5) * 1.2)) : rnd() < 0.08 ? 1 : 0;
  if (pos === 'RB') {
    let rec = ri(0, 6); let recYd = Math.round(rec * (4 + rnd() * 6));
    let ry = Math.round((pts - 6 * td - 0.5 * rec - 0.1 * recYd) / 0.1);
    if (ry < 0) { td = 0; ry = Math.round((pts - 0.5 * rec - 0.1 * recYd) / 0.1); }
    if (ry < 0) { rec = 0; recYd = 0; ry = Math.max(0, Math.round(pts / 0.1)); }
    const recTd = td && rnd() < 0.25 ? 1 : 0;
    return { rush_att: Math.max(2, Math.round(ry / 4.3 + (rnd() - 0.5) * 6)), rush_yd: ry, rush_td: td - recTd, rec, rec_tgt: rec + ri(0, 2), rec_yd: recYd, rec_td: recTd };
  }
  let rec = Math.max(1, Math.round(pts / 2.7 + (rnd() - 0.5) * 3));
  let yd = Math.round((pts - 0.5 * rec - 6 * td) / 0.1);
  if (yd < rec * 4) { td = 0; yd = Math.round((pts - 0.5 * rec) / 0.1); }
  if (yd < rec * 4) { rec = Math.max(1, Math.round(pts / 2)); yd = Math.max(1, Math.round((pts - 0.5 * rec) / 0.1)); }
  return { rec, rec_tgt: rec + ri(0, 4), rec_yd: Math.max(0, yd), rec_td: td };
}
export async function loadWeekStats(season, week, live) {
  if (!built) return {};
  const pts = {};
  if (live) (await loadLiveWeek()).forEach(m => Object.assign(pts, m.players_points));
  else { const raw = built.seasons.find(x => x.season === String(season)); ((raw && raw.matchups[week - 1]) || []).forEach(m => Object.assign(pts, m.players_points)); }
  const seed = seedFromUrl(); const out = {};
  Object.keys(pts).forEach(pid => {
    const pos = built.players[pid] ? built.players[pid][1] : '';
    const st = fakeStats(pos, pts[pid], rng(hashSeed(seed + ':' + season + ':' + week + ':' + pid)));
    if (st) out[pid] = st;
  });
  return out;
}

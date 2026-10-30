import csv, json, collections
POS = {'QB', 'RB', 'WR', 'TE'}
F = ['completions','attempts','passing_yards','passing_tds','passing_interceptions','carries','rushing_yards','rushing_tds','receptions','targets','receiving_yards','receiving_tds']
def num(x):
    try: v = float(x)
    except: return 0
    return int(v) if v == int(v) else round(v, 2)
weekly = {}   # season -> list of rows
seen = collections.defaultdict(lambda: collections.Counter())  # gsis -> season -> ppr total
names = {}
for y in range(2015, 2027):
    rows = []
    for r in csv.DictReader(open(f'w{y}.csv')):
        if r['season_type'] != 'REG' or r['position'] not in POS: continue
        w = int(r['week'])
        if w > 17: continue
        fl = num(r.get('rushing_fumbles_lost') or 0) + num(r.get('receiving_fumbles_lost') or 0) + num(r.get('sack_fumbles_lost') or 0)
        pts = num(r['fantasy_points_ppr'])
        rows.append((r['player_id'], w, pts, [num(r[k]) for k in F] + [fl], r['team']))
        seen[r['player_id']][y] += pts
        names[r['player_id']] = (r['player_display_name'], r['position'])
    weekly[y] = rows
players = {}
for r in csv.DictReader(open('players.csv')):
    players[r['gsis_id']] = r
draft = {}
for r in csv.DictReader(open('draft.csv')):
    if r['gsis_id']: draft[r['gsis_id']] = r
# Pool: anyone who mattered (30+ PPR in some season), plus every QB/RB/WR/TE drafted 2016+ (rookie draft candidates).
keep = set(g for g, s in seen.items() if max(s.values()) >= 30)
for g, d in draft.items():
    if int(d['season']) >= 2016 and d['position'] in POS: keep.add(g)
# Veterans already in the league in 2016 need a draft/rookie year too.
out_players = []; idx = {}
for g in sorted(keep):
    p = players.get(g, {}); d = draft.get(g, {})
    nm, pos = names.get(g, (p.get('display_name') or d.get('pfr_player_name') or g, p.get('position') or d.get('position')))
    if pos not in POS: continue
    by = p.get('birth_date', '')[:4]
    rookie = d.get('season') or p.get('rookie_season') or p.get('draft_year') or (min(seen[g]) if seen[g] else '')
    if not rookie: continue
    rookie = int(rookie)
    overall = int(d['pick']) if d.get('pick') else (int(p['draft_pick']) if p.get('draft_pick') else 0)
    rnd = int(d['round']) if d.get('round') else (int(p['draft_round']) if p.get('draft_round') else 0)
    birth = int(by) if by.isdigit() else rookie - 22
    idx[g] = len(out_players)
    out_players.append([nm, pos, birth, rookie, rnd, overall])
seasons = {}
for y, rows in weekly.items():
    per = collections.defaultdict(list)
    for g, w, pts, st, team in rows:
        if g in idx: per[idx[g]].append([w, pts] + st)
    seasons[str(y)] = {str(k): v for k, v in per.items()}
data = {'stats': F + ['fumbles_lost'], 'players': out_players, 'seasons': seasons, 'lastWeek2026': max(w for _, w, *_ in weekly[2026])}
s = json.dumps(data, separators=(',', ':'))
open('/home/claude/demo/real.json', 'w').write(s)
print(len(out_players), 'players', round(len(s) / 1e6, 2), 'MB', 'last 2026 week', data['lastWeek2026'])
for y in ('2016','2021','2026'): print(y, len(seasons[y]))

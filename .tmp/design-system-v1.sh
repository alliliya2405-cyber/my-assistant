#!/usr/bin/env bash
set -euo pipefail
grep -q 'styles.css?v=19' index.html
! grep -q 'Design System v1 — task density' styles.css
cat >> styles.css <<'CSS'

/* Design System v1 — task density */
.home-today-head{padding:17px 20px;margin-bottom:16px;border-radius:18px;box-shadow:0 8px 24px rgba(41,51,78,.055)}
.home-today-head h2{font-size:27px;letter-spacing:-.02em}.home-today-head .btn{box-shadow:0 6px 14px rgba(109,93,252,.18)}
.home-dashboard-grid{grid-template-columns:minmax(0,1.45fr) minmax(320px,.75fr);gap:16px}.home-secondary-grid{gap:16px;margin-top:16px}.home-quote{margin-top:16px}
.home-dashboard-grid>.card,.home-secondary-grid>.card,.home-quote{padding:17px;border-radius:16px;box-shadow:0 7px 22px rgba(41,51,78,.05)}
.home-dashboard-grid .section-title,.home-secondary-grid .section-title{margin-bottom:11px}.home-dashboard-grid .section-title h2,.home-secondary-grid .section-title h2{font-size:20px;letter-spacing:-.015em}
.home-dashboard-grid .list,.task-workspace .list{gap:7px}
.home-dashboard-grid .list-row,.task-workspace .list-row{padding:10px 12px;gap:10px;border-radius:12px;align-items:center;box-shadow:none;background:#fff}
.home-dashboard-grid .item-title,.task-workspace .item-title{font-size:15px;line-height:1.32;font-weight:760;color:#202738}
.home-dashboard-grid .item-meta,.task-workspace .item-meta{font-size:12px;line-height:1.4;margin-top:3px;color:#7a8394}
.home-dashboard-grid .item-meta b,.task-workspace .item-meta b{font-weight:700;color:#596274}
.home-dashboard-grid .actions,.task-workspace .actions{gap:5px;justify-content:flex-end;align-items:center}
.home-dashboard-grid .actions .btn,.task-workspace .actions .btn{padding:6px 9px;border-radius:9px;font-size:12px;line-height:1.2;box-shadow:none}
.home-dashboard-grid .actions .btn.primary,.task-workspace .actions .btn.primary{box-shadow:0 4px 10px rgba(109,93,252,.14)}
.home-overdue-card{border-color:#eee6dc;background:#fffdf9}.home-overdue-card .list-row{border-color:#eee8e0}.home-overdue-card .home-count{background:#f3eee8;color:#675d52}
.home-count{height:27px;min-width:27px;padding:0 8px;font-size:12px}
.home-project-row{padding:9px 0}.home-meeting{padding:13px}.home-quote{padding:13px 17px}.home-quote blockquote{font-size:15px}
@media(max-width:1100px){.home-dashboard-grid,.home-secondary-grid{grid-template-columns:1fr}}
@media(max-width:680px){.home-dashboard-grid>.card,.home-secondary-grid>.card,.home-quote{padding:14px}.home-dashboard-grid .list-row,.task-workspace .list-row{align-items:flex-start;flex-direction:column}.home-dashboard-grid .actions,.task-workspace .actions{width:100%;justify-content:flex-start}.home-dashboard-grid .actions .btn,.task-workspace .actions .btn{flex:0 0 auto}.home-today-head{padding:15px}.home-today-head h2{font-size:24px}}
CSS
sed -i 's/styles.css?v=19/styles.css?v=20/' index.html
node --check app.js
node --check core/storage/data-store.js
node --check core/models/task.js
git diff --check
grep -q 'Design System v1 — task density' styles.css
grep -q 'styles.css?v=20' index.html
test -z "$(git diff --name-only -- app.js core/storage/data-store.js core/models/task.js)"
changed="$(git diff --name-only | sort)"
expected="$(printf '%s\n' index.html styles.css | sort)"
test "$changed" = "$expected"
rm .github/workflows/apply-design-system-v1.yml .tmp/design-system-v1.sh
git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
git add styles.css index.html .github/workflows/apply-design-system-v1.yml .tmp/design-system-v1.sh
git diff --cached --check
git commit -m 'Apply Design System v1 task density'
git push origin HEAD:design-system-v1

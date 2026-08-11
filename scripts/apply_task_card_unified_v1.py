from pathlib import Path

styles = Path('styles.css')
css = styles.read_text(encoding='utf-8')
marker = '/* Task Card Unified v1 */'
if marker in css:
    raise SystemExit('Task Card Unified v1 already present')

css += r'''

/* Task Card Unified v1 */
.task-workspace .list-row.collapsible-entry:not(.global-collapsed){
  display:grid!important;
  grid-template-columns:30px minmax(0,1fr) auto!important;
  align-items:center!important;
  gap:10px!important;
  padding:10px 12px!important;
  max-height:none!important;
  overflow:visible!important;
}
.task-workspace .list-row.collapsible-entry:not(.global-collapsed)>.global-collapse-bar{
  grid-column:1!important;grid-row:1!important;display:flex!important;align-items:center!important;justify-content:center!important;
  min-width:0!important;width:30px!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important;
}
.task-workspace .list-row.collapsible-entry:not(.global-collapsed)>.global-collapse-bar .entry-collapse-title,
.task-workspace .list-row.collapsible-entry:not(.global-collapsed)>.global-collapse-bar .entry-collapse-hint{display:none!important}
.task-workspace .list-row.collapsible-entry:not(.global-collapsed)>.global-collapse-bar .entry-collapse-toggle{
  width:28px!important;height:28px!important;padding:0!important;border:0!important;border-radius:9px!important;background:#eef2ff!important;color:var(--primary)!important;
  box-shadow:none!important;display:grid!important;place-items:center!important;cursor:pointer!important;
}
.task-workspace .list-row.collapsible-entry:not(.global-collapsed)>.global-collapse-bar+div{grid-column:2!important;min-width:0!important}
.task-workspace .list-row.collapsible-entry:not(.global-collapsed)>.actions{grid-column:3!important;align-self:center!important}
.task-workspace .list-row.collapsible-entry.global-collapsed{display:block!important;padding:8px 12px!important;max-height:none!important;overflow:visible!important}
.task-workspace .list-row.collapsible-entry.global-collapsed>.global-collapse-bar{
  display:grid!important;grid-template-columns:30px minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important;width:100%!important;
  padding:0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important;
}
.task-workspace .list-row.collapsible-entry.global-collapsed>.global-collapse-bar .entry-collapse-toggle{
  width:28px!important;height:28px!important;padding:0!important;border:0!important;border-radius:9px!important;background:#eef2ff!important;color:var(--primary)!important;display:grid!important;place-items:center!important;
}
.task-workspace .list-row.collapsible-entry.global-collapsed>.global-collapse-bar .entry-collapse-title{
  display:block!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:14px!important;font-weight:750!important;color:var(--text)!important;
}
.task-workspace .list-row.collapsible-entry.global-collapsed>.global-collapse-bar .entry-collapse-hint{display:block!important;font-size:12px!important;color:var(--muted)!important;white-space:nowrap!important}
@media(max-width:680px){
  .task-workspace .list-row.collapsible-entry:not(.global-collapsed){grid-template-columns:28px minmax(0,1fr)!important;align-items:start!important}
  .task-workspace .list-row.collapsible-entry:not(.global-collapsed)>.actions{grid-column:2!important;width:100%!important;justify-content:flex-start!important}
  .task-workspace .list-row.collapsible-entry.global-collapsed>.global-collapse-bar{grid-template-columns:28px minmax(0,1fr)!important}
  .task-workspace .list-row.collapsible-entry.global-collapsed>.global-collapse-bar .entry-collapse-hint{display:none!important}
}
'''
styles.write_text(css, encoding='utf-8')

index = Path('index.html')
html = index.read_text(encoding='utf-8')
if html.count('styles.css?v=20') != 1:
    raise SystemExit('Unexpected styles cache version')
index.write_text(html.replace('styles.css?v=20', 'styles.css?v=21', 1), encoding='utf-8')

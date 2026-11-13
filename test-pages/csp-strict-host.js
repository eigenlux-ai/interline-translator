// Host-page test harness, externalized because this page's strict CSP
// (script-src 'self', no unsafe-inline) blocks inline scripts and onclick
// handlers. Same-origin file load is allowed by 'self'.

// Hotkey isolation probe: if a keystroke typed inside the extension surface
// reaches here, event isolation (isolateEvents) has failed.
document.addEventListener('keydown', (e) => {
  document.getElementById('hotkey-log').textContent = `hotkey log: keydown "${e.key}" reached the page!`;
});

// Satellite lifecycle custody: removing the anchor must not orphan its satellite.
document.getElementById('remove-btn')?.addEventListener('click', () => {
  document.getElementById('removable')?.remove();
});

// A theme change must update only the extension's own root and satellites.
document.getElementById('theme-btn')?.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

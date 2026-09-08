// Keep all feature panels readable without JavaScript; enhance to accessible tabs.
const tabList = document.querySelector('.experience-tabs');
const tabs = [...document.querySelectorAll('.experience-tab')];
const panels = [...document.querySelectorAll('.experience-panel')];

function activateTab(index, focus = false) {
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    panels[i].hidden = i !== index;
  });
  if (focus) tabs[index].focus();
}

if (tabList && tabs.length === panels.length && tabs.length > 0) {
  tabList.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].tabIndex = 0;
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      activateTab(index);
    });
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (event.key === ' ') next = index;
      if (next !== undefined) {
        event.preventDefault();
        activateTab(next, true);
      }
    });
  });
  const showHashPanel = () => {
    const index = panels.findIndex((panel) => `#${panel.id}` === window.location.hash);
    if (index >= 0) activateTab(index);
  };
  activateTab(0);
  showHashPanel();
  window.addEventListener('hashchange', showHashPanel);
}

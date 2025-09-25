const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const THEME_KEY = 'prefers-dark';

function applyTheme(isDark){
  if(isDark){
    root.classList.add('dark');
    if(toggle) toggle.textContent = '☀️ Light Mode';
  }else{
    root.classList.remove('dark');
    if(toggle) toggle.textContent = '🌙 Dark Mode';
  }
}

function loadTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if(saved === null){
    const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefers);
    return prefers;
  }
  const isDark = saved === 'true';
  applyTheme(isDark);
  return isDark;
}

function saveTheme(isDark){
  localStorage.setItem(THEME_KEY, String(isDark));
}

document.addEventListener('DOMContentLoaded', () => {
  let isDark = loadTheme();
  if(toggle){
    toggle.addEventListener('click', () => {
      isDark = !isDark;
      applyTheme(isDark);
      saveTheme(isDark);
    });
  }

  // Publications rendering
  const pubList = document.getElementById('pub-list');
  if(pubList){
    fetch('publications.json')
      .then(r => r.ok ? r.json() : [])
      .then(items => {
        if(!Array.isArray(items) || items.length === 0){
          pubList.innerHTML = '<p>No publications listed yet. See Google Scholar above.</p>';
          return;
        }
        pubList.innerHTML = '';
        items.forEach(p => {
          const div = document.createElement('div');
          div.className = 'pub-item';
          const title = document.createElement('h3');
          title.className = 'pub-title';
          title.textContent = p.title || 'Untitled';
          const meta = document.createElement('p');
          meta.className = 'pub-meta';
          meta.textContent = [p.authors, p.venue, p.year].filter(Boolean).join(' — ');
          const links = document.createElement('p');
          links.className = 'pub-links';
          const linkParts = [];
          if(p.url){ linkParts.push(`<a class="external" href="${p.url}" target="_blank" rel="noopener">Link</a>`); }
          if(p.pdf){ linkParts.push(`<a class="external" href="${p.pdf}" target="_blank" rel="noopener">PDF</a>`); }
          if(p.doi){ linkParts.push(`<a class="external" href="https://doi.org/${p.doi}" target="_blank" rel="noopener">DOI</a>`); }
          links.innerHTML = linkParts.join(' · ');
          div.appendChild(title);
          div.appendChild(meta);
          if(linkParts.length){ div.appendChild(links); }
          pubList.appendChild(div);
        });
      })
      .catch(() => {
        pubList.innerHTML = '<p>Failed to load publications. See Google Scholar above.</p>';
      });
  }
});



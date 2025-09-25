const root = document.documentElement;

function applyTheme(isDark){
  if(isDark){
    root.classList.add('dark');
  }else{
    root.classList.remove('dark');
  }
}

function computeTimeBasedTheme(){
  const now = new Date();
  const hour = now.getHours();
  // Dark between 19:00 and 06:59 inclusive
  return (hour >= 19 || hour <= 6);
}

document.addEventListener('DOMContentLoaded', () => {
  const isDark = computeTimeBasedTheme();
  applyTheme(isDark);
  // Hide toggle if present in DOM from older versions
  const legacyToggle = document.getElementById('themeToggle');
  if(legacyToggle){ legacyToggle.style.display = 'none'; }

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



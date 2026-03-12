/*
  Rewritten main.js: Dark-mode-only portfolio logic
  - Fetches repos from GitHub and renders a 3-col grid
  - Staggered fade-in animation (CSS keyframes + --i)
  - Glass modal showing avatar, followers, public repos and link
*/

const USER = 'itsrealm12c';
const REPOS_API = `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`;
const USER_API = `https://api.github.com/users/${USER}`;

const reposGrid = document.getElementById('reposGrid');
const projectsState = document.getElementById('projectsState');
const openProfileBtn = document.getElementById('openProfileBtn');
const modalBackdrop = document.getElementById('modalBackdrop');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('closeModalBtn');

const modalAvatar = document.getElementById('modalAvatar');
const modalName = document.getElementById('modalName');
const modalLogin = document.getElementById('modalLogin');
const modalFollowers = document.getElementById('modalFollowers');
const modalPublicRepos = document.getElementById('modalPublicRepos');
const modalGitHubLink = document.getElementById('modalGitHubLink');
const modalBio = document.getElementById('modalBio');

const LANG_COLORS = {
  // Enforced exact mappings (user-specified)
  VBScript: '#00ffff',
  VBS: '#00ffff',
  QML: '#39ff14',
  Qml: '#39ff14',
  CSS: '#2563eb',
  Css: '#2563eb',
  // Python uses a readable dark-text gradient
  Python: 'gradient:linear-gradient(90deg,#306998,#ffd43b)',
  Shell: '#10b981',
  // Common knowns
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  HTML: '#e34c26',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  Java: '#b07219',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Ruby: '#701516',
  // default fallback (kept but we will generate neon if not present)
  default: '#7c3aed'
};

function el(tag, props = {}, ...children) {
  const e = document.createElement(tag);
  Object.assign(e, props);
  for (const c of children) {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  }
  return e;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]);
}

function formatCount(n){ return (typeof n === 'number')? n.toLocaleString() : '0'; }

/* Create a repo card element */
function makeRepoCard(repo, index=0) {
  const lang = repo.language || 'Unknown';
  // helper to generate a neon color fallback
  function randomNeon() {
    const neon = ['#00ffb3','#00ffff','#39ff14','#ff00ff','#ff6b00','#ffd300','#7cff00','#00e5ff','#ff2d95'];
    return neon[Math.floor(Math.random()*neon.length)];
  }
  // normalise key and pick color (force VBScript/QML above; if not present, pick neon fallback)
  const lookupKey = repo.language && (repo.language in LANG_COLORS) ? repo.language : (repo.language && repo.language.toUpperCase() === 'CSS' ? 'CSS' : repo.language);
  let colorVal = (lookupKey && LANG_COLORS[lookupKey]) ? LANG_COLORS[lookupKey] : null;
  if (!colorVal) {
    // if GitHub didn't provide a mapping, use a random neon color for high-contrast badges
    colorVal = randomNeon();
  }
  const card = el('article', { className: 'repo-card stagger-fade' });
  card.style.setProperty('--i', String(index));

  // badge style and text color
  let badgeStyle = '';
  let badgeTextColor = '#071126';
  if (typeof colorVal === 'string' && colorVal.startsWith('gradient:')) {
    badgeStyle = `background:${colorVal.replace('gradient:','')};`;
    badgeTextColor = '#000000';
  } else {
    badgeStyle = `background:${colorVal};`;
    badgeTextColor = '#071126';
  }

  // Title forced solid white and bold per requirement
  card.innerHTML = `
    <div>
      <div class="text-sm font-semibold" style="color: var(--text-color); font-weight:800; font-size:1.04rem;">${escapeHtml(repo.name)}</div>
      <div class="small muted mt-2" style="color:var(--text-fallback, #94a3b8);">${escapeHtml(repo.description || '')}</div>
    </div>
    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="lang-tag" style="${badgeStyle} color:${badgeTextColor};">${escapeHtml(lang)}</span>
        <span class="muted small" style="color:var(--text-fallback, #94a3b8);">★ ${repo.stargazers_count} · ⎇ ${repo.forks_count}</span>
      </div>
      <div>
        <a class="btn small" style="background: rgba(255,255,255,0.10); color:var(--text-color);" target="_blank" rel="noopener" href="${repo.html_url}">View</a>
      </div>
    </div>
  `;
  return card;
}

/* Render repos into grid with staggered fade and client-side sorting */
function renderRepos(repos) {
  reposGrid.innerHTML = '';
  if (!Array.isArray(repos) || repos.length === 0) {
    projectsState.textContent = 'No repos found';
    return;
  }

  // read current sort option (fallback to updated)
  const sortEl = document.getElementById('repoSort');
  const sortBy = sortEl ? sortEl.value : 'updated';

  // clone before sorting
  const sorted = repos.slice().sort((a, b) => {
    if (sortBy === 'stars') {
      return (b.stargazers_count || 0) - (a.stargazers_count || 0);
    }
    if (sortBy === 'forks') {
      return (b.forks_count || 0) - (a.forks_count || 0);
    }
    if (sortBy === 'name') {
      const an = (a.name || '').toLowerCase();
      const bn = (b.name || '').toLowerCase();
      return an.localeCompare(bn);
    }
    if (sortBy === 'language') {
      const al = (a.language || '').toLowerCase();
      const bl = (b.language || '').toLowerCase();
      if (al === bl) return new Date(b.updated_at) - new Date(a.updated_at);
      return al.localeCompare(bl);
    }
    // default: updated
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  const visible = sorted.slice(0, 24);
  visible.forEach((r, i) => {
    const c = makeRepoCard(r, i);
    reposGrid.appendChild(c);
  });
  projectsState.textContent = `Showing ${visible.length} repos · Sorted by ${sortBy}`;
}

/* Modal control */
function openModal() {
  modalBackdrop.classList.add('show');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', escHandler);
}
function closeModal() {
  modalBackdrop.classList.remove('show');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', escHandler);
}
function escHandler(e){ if (e.key === 'Escape') closeModal(); }

modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });
closeModalBtn.addEventListener('click', closeModal);

/* Load user details for modal (cached) and aggregate stats */
let cachedUser = null;
let cachedRepos = null;
async function loadAndShowProfile() {
  if (cachedUser && cachedRepos) {
    fillModal(cachedUser, cachedRepos);
    openModal();
    return;
  }
  openProfileBtn.disabled = true;
  openProfileBtn.style.opacity = '.7';
  try {
    const [uRes, rRes] = await Promise.all([ fetch(USER_API), fetch(REPOS_API) ]);
    if (!uRes.ok) throw new Error('Failed user fetch');
    if (!rRes.ok) throw new Error('Failed repos fetch');
    const u = await uRes.json();
    const repos = await rRes.json();
    cachedUser = u;
    cachedRepos = repos;
    fillModal(u, repos);
    openModal();
  } catch (err) {
    console.error(err);
    alert('Failed to load profile.');
  } finally {
    openProfileBtn.disabled = false;
    openProfileBtn.style.opacity = '1';
  }
}

function fillModal(user, repos = []) {
  // aggregate stars
  const totalStars = (Array.isArray(repos) ? repos.reduce((s, r) => s + (r.stargazers_count || 0), 0) : 0);

  // Safely set basic info & aggregates (guard missing DOM nodes)
  const safeSetText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  const safeSetHref = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.href = value;
  };

  safeSetText('modalName', user.name || user.login || '');
  safeSetText('modalLogin', '@' + (user.login || ''));
  safeSetHref('modalGitHubLink', user.html_url || '#');
  safeSetText('bentoIdentity', 'M13C');
  safeSetText('bentoStars', formatCount(totalStars));
  safeSetText('modalBio', user.bio || '');
  safeSetText('modalFollowers', formatCount(user.followers));
  safeSetText('modalPublicRepos', formatCount(user.public_repos));
  safeSetText('modalFollowing', formatCount(user.following));

  // avatar if present
  const avatarEl = document.getElementById('modalAvatar');
  if (avatarEl) {
    if (user.avatar_url) avatarEl.src = user.avatar_url + '&s=512';
    else avatarEl.removeAttribute('src');
  }

  // account age
  const created = user.created_at ? new Date(user.created_at) : null;
  if (created) {
    const years = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 365));
    safeSetText('modalAccountAge', years > 0 ? `${years} yr${years>1?'s':''}` : '<1 yr');
    safeSetText('modalCreated', `Joined ${created.toLocaleDateString()}`);
  } else {
    safeSetText('modalAccountAge', '—');
    safeSetText('modalCreated', 'Joined —');
  }

  // Top languages (guard target element)
  try {
    const langCount = {};
    (repos || []).forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language]||0) + 1; });
    const top = Object.keys(langCount).sort((a,b) => langCount[b]-langCount[a]).slice(0,5);
    const langsWrap = document.getElementById('modalTopLangs');
    if (langsWrap) {
      langsWrap.innerHTML = '';
      top.forEach(l => {
        const badge = document.createElement('div');
        badge.className = 'lang-tag';
        badge.style.background = (LANG_COLORS[l] || '#94a3b8');
        badge.textContent = l;
        langsWrap.appendChild(badge);
      });
    }
  } catch (err) {
    console.warn('top langs failed', err);
  }

  // recent repos (guard target)
  try {
    const recent = (repos || []).slice().sort((a,b) => new Date(b.updated_at)-new Date(a.updated_at)).slice(0,6);
    const modalReposEl = document.getElementById('modalRepos');
    if (modalReposEl) {
      modalReposEl.innerHTML = '';
      recent.forEach(r => {
        const row = document.createElement('div');
        row.className = 'repo-card';
        row.style.padding = '10px';
        row.innerHTML = `
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-semibold" style="color:#ffffff">${escapeHtml(r.name)}</div>
              <div class="small muted">${escapeHtml(r.description || '')}</div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <div class="small muted">★ ${r.stargazers_count} · ⎇ ${r.forks_count}</div>
              <a class="btn small" target="_blank" rel="noopener" href="${r.html_url}">Open</a>
            </div>
          </div>
        `;
        modalReposEl.appendChild(row);
      });
    }
    const modalRecentCountEl = document.getElementById('modalRecentCount');
    if (modalRecentCountEl) modalRecentCountEl.textContent = String(recent.length);
  } catch (err) {
    console.warn('modal repo list failed', err);
  }

  // Populate bento karma if reddit cached (guard element)
  const karmaEl = document.getElementById('bentoKarma');
  if (karmaEl && window.__redditData) {
    karmaEl.textContent = formatCount(window.__redditData.total_karma || 0);
  }
}

/* helper: relative time */
function timeAgo(dateStr){
  if(!dateStr) return '—';
  const d = new Date(dateStr);
  const s = Math.floor((Date.now() - d.getTime())/1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

/* Fetch YouTube feed via RSS-to-JSON proxy, enrich with views/duration by scraping watch pages, render custom video cards and open fullscreen embed on click */
let _ytLoaded = false;

async function fetchViewsAndDurationFromWatch(url) {
  // fetch the watch page and attempt to extract view count and length
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error('watch page fetch failed');
    const txt = await res.text();
    // Try common JSON markers
    // lengthSeconds often appears in initial data
    const lenMatch = txt.match(/"lengthSeconds"\s*:\s*"?(\d+)"?/);
    const viewsMatch1 = txt.match(/"viewCount"\s*:\s*"?(?:([\d,]+))"?/); // sometimes numeric
    const viewsMatch2 = txt.match(/"viewCountText"\s*:\s*{[^}]*"simpleText"\s*:\s*"([\d,.,\s\w]+)"/);
    const approxMatch = txt.match(/"approximateViewCount"\s*:\s*(\d+)/);
    let lengthSeconds = lenMatch ? parseInt(lenMatch[1], 10) : (approxMatch ? null : null);
    let views = null;
    if (viewsMatch1) views = viewsMatch1[1];
    else if (approxMatch) views = String(approxMatch[1]);
    else if (viewsMatch2) views = viewsMatch2[1];

    // format views cleanly
    if (views) {
      views = views.replace(/,/g, '').trim();
      // if numeric, pretty-format
      if (/^\d+$/.test(views)) views = Number(views).toLocaleString();
    }

    // format duration mm:ss if lengthSeconds available
    let duration = '';
    if (lengthSeconds && !isNaN(lengthSeconds)) {
      const m = Math.floor(lengthSeconds / 60);
      const s = lengthSeconds % 60;
      duration = `${m}:${String(s).padStart(2,'0')}`;
    } else {
      // try to extract ISO 8601 duration in metadata
      const isoDur = txt.match(/"approxDurationMs"\s*:\s*"(\d+)"/) || txt.match(/"duration"\s*:\s*"PT([\dHMS]+)"/);
      if (isoDur && isoDur[1]) {
        // if approxDurationMs (ms)
        if (/^\d+$/.test(isoDur[1])) {
          const ms = parseInt(isoDur[1], 10);
          const secs = Math.round(ms / 1000);
          const m = Math.floor(secs / 60);
          const s = secs % 60;
          duration = `${m}:${String(s).padStart(2,'0')}`;
        } else {
          duration = isoDur[1];
        }
      }
    }

    return {
      views: views || null,
      duration: duration || ''
    };
  } catch (err) {
    console.warn('watch scrape failed', err);
    return { views: null, duration: '' };
  }
}

async function loadYouTubeVideos() {
  const ytState = document.getElementById('youtubeState');
  const ytGrid = document.getElementById('youtubeGrid');
  ytState.textContent = 'Loading videos…';
  if (!ytGrid) return;
  ytGrid.innerHTML = '';

  // render helper - no em-dashes; use '0 views' when missing and empty duration when missing
  async function renderItems(items) {
    // Allow sorting via UI control (ytSort)
    const sortEl = document.getElementById('ytSort');
    const sortBy = sortEl ? sortEl.value : 'recent';
    // clone and normalize numeric values for sorting
    const normalized = (items || []).slice().map(it => {
      const copy = Object.assign({}, it);
      // parse views numeric
      if (typeof copy.views === 'string') {
        const v = copy.views.replace(/[^\d]/g, '');
        copy._viewsNum = v ? parseInt(v, 10) : 0;
      } else {
        copy._viewsNum = Number(copy.views) || 0;
      }
      // parse duration in seconds (mm:ss or m:ss or seconds)
      copy._durationSec = 0;
      if (copy.duration) {
        const m = copy.duration.match(/(\d+):(\d{2})$/);
        if (m) copy._durationSec = parseInt(m[1],10)*60 + parseInt(m[2],10);
        else if (/^\d+$/.test(copy.duration)) copy._durationSec = parseInt(copy.duration,10);
      }
      // normalized title & pub date
      copy._title = (copy.title || '').toLowerCase();
      copy._pubDate = 0;
      if (copy.pub && /\d+d/.test(copy.pub)) {
        // pub like '3d' -> convert to days
        const dmatch = copy.pub.match(/(\d+)d/);
        if (dmatch) copy._pubDate = Date.now() - (parseInt(dmatch[1],10) * 24 * 3600 * 1000);
      } else {
        copy._pubDate = copy.pub ? Date.parse(copy.pub) || 0 : 0;
      }
      return copy;
    });

    // sort according to selection
    normalized.sort((a,b) => {
      if (sortBy === 'views') return (b._viewsNum || 0) - (a._viewsNum || 0);
      if (sortBy === 'duration') return (a._durationSec || 0) - (b._durationSec || 0);
      if (sortBy === 'title') return a._title.localeCompare(b._title);
      // default recent: newest first (by pub date)
      return (b._pubDate || 0) - (a._pubDate || 0);
    });

    ytGrid.innerHTML = '';
    for (const it of normalized) {
      // try to enrich each item with views/duration if missing (only when missing original fields)
      if ((!it.views || it.views === '') || (!it.duration || it.duration === '')) {
        // attempt to extract video id from link
        let videoId = '';
        try {
          const u = new URL(it.link, location.origin);
          videoId = u.searchParams.get('v') || (u.pathname.startsWith('/watch') ? '' : u.pathname.split('/').pop());
          if (!videoId && u.hostname.includes('youtu.be')) videoId = u.pathname.slice(1);
        } catch (e) { /* ignore */ }

        if (videoId) {
          const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
          const info = await fetchViewsAndDurationFromWatch(watchUrl);
          if (info.views && (!it.views || it.views === '')) it.views = info.views;
          if (info.duration && (!it.duration || it.duration === '')) it.duration = info.duration;
          it.videoId = videoId;
        }
      }

      const title = it.title || 'Video';
      const link = it.link || '#';
      const thumb = it.thumb || '';
      const pub = it.pub || '';
      const dur = it.duration || '';
      const views = it.views && it.views !== '' ? `${it.views} views` : '0 views';

      const card = document.createElement('article');
      card.className = 'video-card';
      card.style.padding = '10px';
      card.innerHTML = `
        <div class="video-thumb-wrap" data-video-id="${it.videoId || ''}" data-link="${escapeHtml(link)}">
          ${thumb ? `<img src="${thumb}" alt="${escapeHtml(title)}" class="video-thumb">` : `<div class="video-thumb" style="background:rgba(255,255,255,0.03);height:160px"></div>`}
          ${dur ? `<div class="ts-badge">${escapeHtml(dur)}</div>` : ''}
        </div>
        <div class="mt-3">
          <div class="text-sm font-semibold" style="color:var(--text-color)">${escapeHtml(title)}</div>
          <div class="small muted mt-1" style="color:var(--text-fallback, #94a3b8)">itsrealm13cgd · ${escapeHtml(views)} · ${escapeHtml(pub)}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        const vid = card.querySelector('.video-thumb-wrap')?.getAttribute('data-video-id');
        if (vid) {
          openVideoOverlay(vid);
        } else {
          window.open(link, '_blank');
        }
      });

      const img = card.querySelector('.video-thumb');
      card.addEventListener('mouseenter', () => { if (img) img.classList.add('active'); });
      card.addEventListener('mouseleave', () => { if (img) img.classList.remove('active'); });

      ytGrid.appendChild(card);
    }

    ytState.textContent = `Showing ${normalized.length} videos`;
    const modalVideos = document.getElementById('modalVideos');
    if (modalVideos) {
      modalVideos.innerHTML = '';
      normalized.slice(0,6).forEach(it => {
        const r = document.createElement('div');
        r.className = 'repo-card';
        r.style.padding = '8px';
        const viewsText = it.views && it.views !== '' ? `${it.views} views` : '0 views';
        r.innerHTML = `<div class="text-sm font-semibold" style="color:var(--text-color)">${escapeHtml(it.title)}</div><div class="small muted">${escapeHtml(it.pub)} · ${escapeHtml(viewsText)}</div><div class="mt-2"><a class="btn small" target="_blank" href="${it.link}">Watch</a></div>`;
        modalVideos.appendChild(r);
      });
    }
    document.getElementById('bentoYTViews').textContent = `${normalized.length} videos`;
    _ytLoaded = true;
  }

  try {
    const rssRaw = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCoOiyPULs5ehi-OeXbw2qeQ';
    const rss2 = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssRaw)}`;

    // First, try rss2json
    try {
      const r1 = await fetch(rss2);
      if (r1.ok) {
        const j = await r1.json();
        const items = (j.items || []).slice(0, 12).map(it => {
          const pub = it.pubDate || it.pubdate || it.isoDate;
          const pubText = pub ? `${Math.floor((Date.now() - new Date(pub).getTime())/(1000*60*60*24))}d` : '';
          // description/duration attempts
          let duration = '';
          if (it.description) {
            const m = it.description.match(/Duration:?\s*([\d:]+)/);
            if (m) duration = m[1];
          }
          if (!duration && it.duration) duration = it.duration;
          return {
            title: it.title || '',
            link: it.link || '',
            thumb: it.thumbnail || (it.enclosure && it.enclosure.link) || '',
            pub: pubText,
            duration: duration || '',
            views: it.views ? String(it.views).replace(/,/g,'') : ''
          };
        });
        if (items.length) { await renderItems(items); return; }
      }
    } catch (e) { console.warn('rss2json failed', e); }

    // Next: raw RSS via allorigins and attempt to extract video IDs so we can fetch views
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssRaw)}`;
      const pres = await fetch(proxyUrl);
      if (pres.ok) {
        const body = await pres.json();
        const txt = body && body.contents ? body.contents : '';
        const entryRe = /<entry[\s\S]*?<\/entry>/g;
        const thumbRe = /<media:thumbnail[^>]*url="([^"]+)"/i;
        const titleRe = /<title>([^<]+)<\/title>/i;
        const linkRe = /<link[^>]*href="([^"]+)"/i;
        const pubRe = /<published>([^<]+)<\/published>/i;
        const entries = (txt.match(entryRe) || []).slice(0,12).map(s => {
          const thumb = (s.match(thumbRe) || [null,''])[1] || '';
          const title = (s.match(titleRe) || [null,''])[1] || 'Video';
          const link = (s.match(linkRe) || [null,''])[1] || '#';
          const pub = (s.match(pubRe) || [null,''])[1] || '';
          return { title, link, thumb, pub: timeAgo(pub).replace(' ago',''), duration:'', views:'' };
        });
        if (entries.length) { await renderItems(entries); return; }
      }
    } catch (e) { console.warn('allorigins rss failed', e); }

    // Final fallback: hardcoded mock
    const mock = [
      { title: 'Playing my pretty cool levels on GD!', duration: '1:25', link:'#', thumb:'', pub: '3d', views: '1,200' },
      { title: 'Getting rickrolled by GD Colon... Part 2', duration: '0:32', link:'#', thumb:'', pub: '7d', views: '842' }
    ];
    await renderItems(mock);
  } catch (err) {
    console.warn('yt overall failed', err);
    const mock = [
      { title: 'Playing my pretty cool levels on GD!', duration: '1:25', link:'#', thumb:'', pub: '3d', views: '1,200' },
      { title: 'Getting rickrolled by GD Colon... Part 2', duration: '0:32', link:'#', thumb:'', pub: '7d', views: '842' }
    ];
    await renderItems(mock);
  }
}

/* Video overlay controls (open embed, close) */
function openVideoOverlay(videoId) {
  const overlay = document.getElementById('videoOverlay');
  const wrap = document.getElementById('videoIframeWrap');
  if (!overlay || !wrap) {
    // fallback to opening watch page
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    return;
  }
  // create iframe with autoplay, fullscreen allowed
  wrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0" style="width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  overlay.style.display = 'grid';
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

document.getElementById('closeVideoOverlay')?.addEventListener('click', () => {
  const overlay = document.getElementById('videoOverlay');
  const wrap = document.getElementById('videoIframeWrap');
  if (wrap) wrap.innerHTML = '';
  if (overlay) {
    overlay.style.display = 'none';
    overlay.classList.remove('show');
  }
  document.body.style.overflow = '';
});

// allow clicking backdrop to close
document.getElementById('videoOverlay')?.addEventListener('click', (e) => {
  const overlay = document.getElementById('videoOverlay');
  if (e.target === overlay) {
    const wrap = document.getElementById('videoIframeWrap');
    if (wrap) wrap.innerHTML = '';
    overlay.style.display = 'none';
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
});

/* Load discord invite info */
async function loadDiscordInvite() {
  try {
    const res = await fetch('https://discord.com/api/v9/invites/bpKVtyqZ9?with_counts=true');
    if (!res.ok) throw new Error('Invite fetch failed');
    const info = await res.json();
    const wrap = document.getElementById('discordBody');
    const iconWrap = document.getElementById('discordIconWrap');
    const joinBtn = document.getElementById('discordJoin');
    if (wrap) wrap.innerHTML = `<div class="small muted">${escapeHtml(info.guild?.name || 'Community')}</div><div class="text-lg font-semibold" style="color:#ffffff">${formatCount(info.approximate_member_count || info.approximate_presence_count || '—')}</div>`;
    if (iconWrap && info.guild?.icon) {
      const url = `https://cdn.discordapp.com/icons/${info.guild.id}/${info.guild.icon}.png`;
      iconWrap.innerHTML = `<img src="${url}" alt="server" class="w-12 h-12 object-cover">`;
    }
    if (joinBtn) joinBtn.href = `https://discord.gg/bpKVtyqZ9`;
  } catch (err) {
    console.warn('discord failed', err);
    const wrap = document.getElementById('discordBody');
    if (wrap) wrap.textContent = 'Invite unavailable';
  }
}

/* Load reddit profile (only used for the Reddit tab). Uses exact URL and maps fields as requested. */
async function loadReddit() {
  try {
    // Fetch profile via AllOrigins (CORS proxy)
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent('https://www.reddit.com/user/itsRealM10C/about.json')}`;
    const res = await fetch(proxy);
    if (!res.ok) throw new Error('Reddit proxy fetch failed');
    const wrapper = await res.json();
    const payload = JSON.parse(wrapper.contents || '{}');
    const d = payload && payload.data;
    if (!d) throw new Error('No reddit data');

    const karma = d.total_karma ?? ((d.link_karma || 0) + (d.comment_karma || 0));
    const createdUtc = d.created_utc ? new Date(d.created_utc * 1000) : null;
    const daysAgo = createdUtc ? Math.floor((Date.now() - createdUtc.getTime()) / (1000 * 60 * 60 * 24)) : null;

    const redditBody = document.getElementById('redditBody');
    const redditAvatar = document.getElementById('redditAvatar');
    const redditAge = document.getElementById('redditAge');
    const redditKarmaText = document.getElementById('redditKarmaText');
    const redditKarmaEl = document.getElementById('redditKarma');

    if (redditKarmaEl) {
      redditKarmaEl.innerHTML = `<div class="text-lg font-semibold" style="color:var(--text)">${formatCount(karma)}</div><div class="small muted" style="color:var(--text)">Karma</div>`;
    }
    if (redditBody) {
      redditBody.textContent = ''; redditBody.style.color = 'var(--text)';
      if (d.subreddit && d.subreddit.icon_img) {
        redditAvatar.src = d.subreddit.icon_img; redditAvatar.style.display = 'block';
      } else redditAvatar.style.display = 'none';
      if (daysAgo !== null) redditAge.textContent = `Account created ${daysAgo}d ago`; else redditAge.textContent = '';
      if (redditKarmaText) redditKarmaText.textContent = `${formatCount(karma)} total`;
    }
    const bK = document.getElementById('bentoKarma');
    if (bK) bK.textContent = formatCount(karma);

    // Fetch recent submissions (using subreddit RSS via AllOrigins)
    // https://www.reddit.com/user/itsRealM10C/submitted.json
    try {
      const subsProxy = `https://api.allorigins.win/get?url=${encodeURIComponent('https://www.reddit.com/user/itsRealM10C/submitted.json')}`;
      const sres = await fetch(subsProxy);
      if (sres.ok) {
        const sw = await sres.json();
        const spayload = JSON.parse(sw.contents || '{}');
        const items = (spayload.data && spayload.data.children) ? spayload.data.children.map(c => c.data) : [];
        // render posts list
        const postsWrap = document.getElementById('redditPosts');
        if (postsWrap) {
          postsWrap.innerHTML = '';
          // store on window for sorting handlers
          window.__redditPosts = items;
          renderRedditPosts(items);
        }
      }
    } catch (err) {
      console.warn('reddit submissions fetch failed', err);
    }
  } catch (err) {
    console.error('reddit failed', err);
    // Fallback display
    const redditBody = document.getElementById('redditBody');
    const redditKarmaEl = document.getElementById('redditKarma');
    const redditKarmaText = document.getElementById('redditKarmaText');
    const redditAvatar = document.getElementById('redditAvatar');
    const redditAge = document.getElementById('redditAge');
    if (redditBody) { redditBody.textContent = ''; redditBody.style.color = 'var(--text)'; }
    if (redditAvatar) redditAvatar.style.display = 'none';
    if (redditKarmaEl) {
      redditKarmaEl.innerHTML = `<div class="text-lg font-semibold" style="color:var(--text)">${formatCount(3)}</div><div class="small muted" style="color:var(--text)">Karma</div>`;
    }
    if (redditKarmaText) redditKarmaText.textContent = `${formatCount(3)} total`;
    if (redditAge) redditAge.textContent = 'Account created 1231d ago';
    const redditPlaceholder = document.getElementById('reddit-placeholder');
    if (redditPlaceholder) redditPlaceholder.textContent = 'Profile unavailable';
  }
}

// Helper to render reddit submissions and support sorting
function renderRedditPosts(items = []) {
  const wrap = document.getElementById('redditPosts');
  if (!wrap) return;
  const sortEl = document.getElementById('redditSort');
  const sortBy = sortEl ? sortEl.value : 'new';
  const copy = (items || []).slice().map(it => {
    return {
      title: it.title || '',
      score: it.score || 0,
      num_comments: it.num_comments || 0,
      created_utc: it.created_utc || 0,
      url: it.url || `https://reddit.com${it.permalink || ''}`
    };
  });

  if (sortBy === 'top') copy.sort((a,b) => b.score - a.score);
  else if (sortBy === 'comments') copy.sort((a,b) => b.num_comments - a.num_comments);
  else copy.sort((a,b) => (b.created_utc || 0) - (a.created_utc || 0));

  wrap.innerHTML = '';
  copy.slice(0, 12).forEach(p => {
    const row = document.createElement('div');
    row.className = 'repo-card';
    row.style.padding = '10px';
    const when = p.created_utc ? timeAgo(new Date(p.created_utc * 1000).toISOString()) : '';
    row.innerHTML = `<div class="flex items-center justify-between"><div><div class="text-sm font-semibold" style="color:var(--text-color)">${escapeHtml(p.title)}</div><div class="small muted">${escapeHtml(when)}</div></div><div class="text-right small muted">★ ${p.score} · 💬 ${p.num_comments}<div class="mt-2"><a class="btn small" target="_blank" rel="noopener" href="${escapeHtml(p.url)}">Open</a></div></div></div>`;
    wrap.appendChild(row);
  });
}

/* Fetch repos and render */
async function init() {
  try {
    projectsState.textContent = 'Loading repos…';
    const [reposRes] = await Promise.all([ fetch(REPOS_API) ]);
    if (!reposRes.ok) throw new Error('Failed to fetch repos');
    const repos = await reposRes.json();
    cachedRepos = repos;
    renderRepos(repos);
    // start other loads
    loadYouTubeVideos();
    loadDiscordInvite();
    loadReddit();
  } catch (err) {
    console.error(err);
    reposGrid.innerHTML = `<div class="muted p-6">Failed to load repositories.</div>`;
    projectsState.textContent = 'Failed to fetch';
  }
}

/* Wire interactions */
openProfileBtn.addEventListener('click', loadAndShowProfile);

/* Tab navigation: strict switchTab logic to hide all sections and show only the active one */
const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
const tabUnderline = document.getElementById('tabUnderline');
const contentSections = [
  document.getElementById('reposSection'),
  document.getElementById('youtubeSection'),
  document.getElementById('discordCard'),
  document.getElementById('redditCard')
].filter(Boolean);

function clearBrackets() {
  tabButtons.forEach(b => {
    const left = b.querySelector('.br-left'); if (left) left.remove();
    const right = b.querySelector('.br-right'); if (right) right.remove();
    b.setAttribute('aria-pressed', 'false');
    b.style.boxShadow = 'none';
  });
}

function switchTab(tabName) {
  // Explicitly hide all known content sections (no bleed)
  contentSections.forEach(s => {
    try { s.style.display = 'none'; } catch (e) {}
    s.classList.add('hidden');
  });

  // Remove any bracket markers and set new active button
  clearBrackets();
  const btn = document.querySelector(`.tab-btn[data-key="${tabName}"]`);
  if (!btn) return;

  // Add high-contrast brackets (use --text variable)
  const bl = document.createElement('span'); bl.className = 'br-left'; bl.textContent = '[';
  bl.style.marginRight = '6px'; bl.style.color = 'var(--text)'; bl.style.fontWeight = '800';
  const br = document.createElement('span'); br.className = 'br-right'; br.textContent = ']';
  br.style.marginLeft = '6px'; br.style.color = 'var(--text)'; br.style.fontWeight = '800';
  btn.prepend(bl); btn.appendChild(br);
  btn.setAttribute('aria-pressed', 'true');

  // Move the underline (uses var(--text) via CSS)
  const rect = btn.getBoundingClientRect();
  const navRect = btn.parentElement.getBoundingClientRect();
  const leftPos = rect.left - navRect.left;
  tabUnderline.style.width = `${rect.width}px`;
  tabUnderline.style.left = `${leftPos}px`;

  // Show only the corresponding content (use style.display)
  if (tabName === 'github') {
    const s = document.getElementById('reposSection');
    if (s) { s.style.display = ''; s.classList.remove('hidden'); }
  } else if (tabName === 'youtube') {
    const s = document.getElementById('youtubeSection');
    if (s) { s.style.display = ''; s.classList.remove('hidden'); }
    loadYouTubeVideos();
  } else if (tabName === 'discord') {
    const s = document.getElementById('discordCard');
    if (s) {
      s.style.display = '';
      s.classList.remove('hidden');

      // Build responsive iframe that follows system theme (prefers-color-scheme)
      // Ensure the embed is horizontally centered inside the card and constrained in width
      const buildIframe = (theme) => {
        const src = `https://discord.com/widget?id=1099237965689016360&theme=${encodeURIComponent(theme)}`;
        return `
          <div style="width:100%;display:flex;justify-content:center;padding:12px 8px;">
            <div style="width:100%;max-width:420px;border-radius:10px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.4);">
              <iframe src="${src}" style="width:100%;height:520px;border:0;display:block;" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
            </div>
          </div>`;
      };

      // initial theme & keep iframe theme synced with system setting
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      s.innerHTML = buildIframe(isDark ? 'dark' : 'light');

      // listen for system theme changes and update iframe src to match
      if (window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = (e) => {
          s.innerHTML = buildIframe(e.matches ? 'dark' : 'light');
        };
        // add listener in compatible way
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
      }
    }
    loadDiscordInvite();
  } else if (tabName === 'reddit') {
    const s = document.getElementById('redditCard');
    if (s) { s.style.display = ''; s.classList.remove('hidden'); }
    // Only show the dedicated reddit-content area; hide placeholder
    const redditContent = document.getElementById('reddit-content');
    const redditPlaceholder = document.getElementById('reddit-placeholder');
    if (redditContent) {
      redditContent.style.display = 'block';
      redditContent.classList.remove('hidden');
      // force core reddit text to use theme text color for visibility
      const karmaEl = document.getElementById('redditKarmaText');
      const nameEl = document.getElementById('redditKarma');
      const ageEl = document.getElementById('redditAge');
      if (karmaEl) karmaEl.style.color = 'var(--text)';
      if (nameEl) {
        const lbl = nameEl.querySelector('.text-lg');
        if (lbl) lbl.style.color = 'var(--text)';
      }
      if (ageEl) ageEl.style.color = 'var(--text)';
    }
    if (redditPlaceholder) redditPlaceholder.style.display = 'none';
    loadReddit(); // will populate reddit-content
  }
}

// wire clicks to switchTab
tabButtons.forEach(btn => {
  btn.style.position = 'relative';
  btn.style.color = 'var(--text-color)';
  btn.addEventListener('click', () => switchTab(btn.getAttribute('data-key')));
});

// repo sort control wiring: re-render using selected sort
const repoSortEl = document.getElementById('repoSort');
if (repoSortEl) {
  repoSortEl.addEventListener('change', () => {
    if (cachedRepos) renderRepos(cachedRepos);
  });
}

// YouTube sort control: re-render already-loaded list if present
const ytSortEl = document.getElementById('ytSort');
if (ytSortEl) {
  ytSortEl.addEventListener('change', () => {
    if (_ytLoaded) loadYouTubeVideos();
  });
}

// Reddit sort control: re-render posts (uses cached window.__redditPosts)
const redditSortEl = document.getElementById('redditSort');
if (redditSortEl) {
  redditSortEl.addEventListener('change', () => {
    if (window.__redditPosts) renderRedditPosts(window.__redditPosts);
  });
}

// Discord display toggle: switch what is shown in the discordBody (members vs presence)
const discordSortEl = document.getElementById('discordSort');
if (discordSortEl) {
  discordSortEl.addEventListener('change', () => {
    // if we have the invite data already fetched, update the display
    // otherwise loadDiscordInvite will populate on next open
    const v = discordSortEl.value;
    const wrap = document.getElementById('discordBody');
    // try to read last fetched guild info stored on window (set in loadDiscordInvite)
    if (window.__discordInfo && wrap) {
      const info = window.__discordInfo;
      if (v === 'presence') wrap.innerHTML = `<div class="small muted">${escapeHtml(info.guild?.name || 'Community')}</div><div class="text-lg font-semibold" style="color:var(--text-color)">${formatCount(info.approximate_presence_count || 0)}</div>`;
      else wrap.innerHTML = `<div class="small muted">${escapeHtml(info.guild?.name || 'Community')}</div><div class="text-lg font-semibold" style="color:var(--text-color)">${formatCount(info.approximate_member_count || 0)}</div>`;
    }
  });
}

// set initial tab (github) after layout
setTimeout(() => switchTab('github'), 60);

// kick-off loads (but do not auto-populate reddit content until tab is selected)
init();
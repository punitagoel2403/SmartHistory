const selected = new Set();

// ========== Helper Functions for Link Identification ==========
function getUrlIdentifier(url, title) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // YouTube
    if (/youtube\.com|youtu\.be/.test(url)) {
      const videoId = (url.match(/[?&]v=([^&]+)/) || [])[1];
      if (videoId) {
		  return `<div>
          <img src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg" class="thumbnail" alt="YouTube thumbnail">
        </div>`;
		  
        /*return `<div class="link-preview youtube-preview">
          <img src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg" class="thumbnail" alt="YouTube thumbnail">
          <span class="preview-badge youtube-badge">▶️ YouTube</span>
        </div>`;*/
      }
    }
    
   /* // GitHub
    if (/github\.com/.test(domain)) {
      const repoMatch = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
      const repoName = repoMatch ? repoMatch[1] : '';
      return `<div class="link-preview github-preview">
        <span class="preview-badge github-badge">⭐ GitHub</span>
        ${repoName ? `<span class="repo-name">${repoName}</span>` : ''}
      </div>`;
    }
    
    // Stack Overflow
    if (/stackoverflow\.com/.test(domain)) {
      return `<div class="link-preview stackoverflow-preview">
        <span class="preview-badge stackoverflow-badge">💬 Stack Overflow</span>
      </div>`;
    }
    
    // Reddit
    if (/reddit\.com/.test(domain)) {
      const subredditMatch = url.match(/reddit\.com\/r\/([^\/]+)/);
      const subreddit = subredditMatch ? `r/${subredditMatch[1]}` : 'Reddit';
      return `<div class="link-preview reddit-preview">
        <span class="preview-badge reddit-badge">🔴 ${subreddit}</span>
      </div>`;
    }
    
    // Twitter/X
    if (/twitter\.com|x\.com/.test(domain)) {
      return `<div class="link-preview twitter-preview">
        <span class="preview-badge twitter-badge">🐦 Twitter</span>
      </div>`;
    }
    
    // LinkedIn
    if (/linkedin\.com/.test(domain)) {
      return `<div class="link-preview linkedin-preview">
        <span class="preview-badge linkedin-badge">💼 LinkedIn</span>
      </div>`;
    }
    
    // Medium
    if (/medium\.com/.test(domain)) {
      return `<div class="link-preview medium-preview">
        <span class="preview-badge medium-badge">📝 Medium</span>
      </div>`;
    }
    
    // Documentation sites
    if (/docs\.|documentation|readthedocs/.test(domain)) {
      return `<div class="link-preview docs-preview">
        <span class="preview-badge docs-badge">📚 Docs</span>
      </div>`;
    }
    
    // News sites
    if (/news|bbc\.com|cnn\.com|nytimes\.com|theguardian\.com/.test(domain)) {
      return `<div class="link-preview news-preview">
        <span class="preview-badge news-badge">📰 News</span>
      </div>`;
    }
    
    // Shopping
    if (/amazon\.|ebay\.|etsy\.|shop/.test(domain)) {
      return `<div class="link-preview shopping-preview">
        <span class="preview-badge shopping-badge">🛒 Shopping</span>
      </div>`;
    }*/
    
    return '';
  } catch (e) {
    return '';
  }
}

function getFavicon(url) {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
  } catch {
    return '';
  }
}

// ========== Landing Page Navigation ==========
document.addEventListener('DOMContentLoaded', () => {
  const landingPage = document.getElementById('landingPage');
  const mainApp = document.getElementById('mainApp');
  
  // Show landing page by default
  landingPage.classList.add('active');
  mainApp.classList.remove('active');
  
  // Fetch History button
  document.getElementById('fetchHistoryBtn').addEventListener('click', () => {
    showMainApp('history');
  });
  
  // I'm Feeling Lucky button - opens random date range
  /*document.getElementById('feelingLuckyBtn').addEventListener('click', () => {
    showMainApp('history');
    // Auto-fill with last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    
    // Auto-fetch
    setTimeout(() => {
      document.getElementById('fetch').click();
    }, 300);
  });*/
  document.getElementById('feelingLuckyBtn').addEventListener('click', async () => {
  showLuckyModal();
});
  
  // Quick access buttons
  document.getElementById('goToCurrentSession').addEventListener('click', () => {
    showMainApp('session');
    loadOpenTabs();
  });
  
  document.getElementById('goToSavedSessions').addEventListener('click', () => {
    showMainApp('saved');
    renderSessions('');
  });
  
  // Search bar functionality
  const searchInput = document.getElementById('landingSearchInput');
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        showMainApp('history');
      }
    }
  });
  
  // Back to home functionality
  document.getElementById('backToHome').addEventListener('click', () => {
    landingPage.classList.add('active');
    mainApp.classList.remove('active');
  });
  
  // Back home button
  document.getElementById('backHomeBtn').addEventListener('click', () => {
    landingPage.classList.add('active');
    mainApp.classList.remove('active');
  });
  
  function showMainApp(tab) {
    landingPage.classList.remove('active');
    mainApp.classList.add('active');
    
    // Switch to appropriate tab
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    const tabButton = document.querySelector(`[data-tab="${tab}"]`);
    const tabContent = document.getElementById(`${tab}Tab`);
    
    if (tabButton) tabButton.classList.add('active');
    if (tabContent) tabContent.classList.add('active');
  }
  
  // Theme toggle (works on both pages)
  const themeSwitch = document.getElementById('themeSwitch');
  const themeSwitchMain = document.getElementById('themeSwitchMain');
  const root = document.documentElement;
  
  // Load saved theme
  chrome.storage.sync.get({theme: "light"}, data => {
    if (data.theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeSwitch.checked = true;
      themeSwitchMain.checked = true;
    }
  });
  
  // Sync both theme toggles
  function updateTheme(isDark) {
    const mode = isDark ? "dark" : "light";
    root.setAttribute("data-theme", mode === "dark" ? "dark" : "");
    chrome.storage.sync.set({theme: mode});
    themeSwitch.checked = isDark;
    themeSwitchMain.checked = isDark;
  }
  
  themeSwitch.addEventListener("change", () => {
    updateTheme(themeSwitch.checked);
  });
  
  themeSwitchMain.addEventListener("change", () => {
    updateTheme(themeSwitchMain.checked);
  });
});

async function showLuckyModal() {
  const modal = document.getElementById('luckyModal');
  const content = document.getElementById('luckyContent');
  const sharePreview = document.getElementById('sharePreview');
  
  modal.style.display = 'flex';
  content.innerHTML = '<div class="spinner"></div>';
  sharePreview.style.display = 'none';
  
  try {
    const response = await fetch('https://smarthistory-backend.vercel.app/api/lucky');
    const data = await response.json();
    
    if (response.status === 403) {
      content.textContent = "Too many fortunes! Take a breath and try again in a minute 🕐";
     // return;
    }
    else{
    content.textContent = data.fortune;
	}
    document.getElementById('shareFortuneText').textContent = data.fortune;
    
    // Show share preview with animation
    setTimeout(() => {
      sharePreview.style.display = 'block';
    }, 300);
    
    window.currentFortune = data.fortune;
    
  } catch (error) {
    content.textContent = "The fortune cookie jar is empty. Try again later! 🥠";
  }
}

// Close modal
document.getElementById('luckyClose').addEventListener('click', () => {
  document.getElementById('luckyModal').style.display = 'none';
});

// Close on outside click
document.getElementById('luckyModal').addEventListener('click', (e) => {
  if (e.target.id === 'luckyModal') {
    document.getElementById('luckyModal').style.display = 'none';
  }
});

// Get another fortune
document.getElementById('luckyAnother').addEventListener('click', () => {
  showLuckyModal();
});

// Share to Twitter with visual format
document.getElementById('luckyShare').addEventListener('click', () => {
  const fortune = window.currentFortune;
  const text = `🥠 My Smart History Fortune:\n\n"${fortune}"\n\n✨ Get yours: https://smarthistory.vercel.app/`;
  const encoded = encodeURIComponent(text);
  window.open(`https://x.com/intent/tweet?text=${encoded}`, '_blank');
});

// ========== History Fetch Logic (ENHANCED) ==========
function toChromeTime(dateStr) {
  const date = new Date(dateStr);
  return date.getTime();
}

document.getElementById("myButton").addEventListener("click", myFunction);

function myFunction() {
  openAll();
  console.log('test button');
}

document.getElementById("fetch").addEventListener("click", async () => {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const statusEl = document.getElementById("status");

  if (!start || !end) {
    alert("Please pick both start and end dates");
    return;
  }

  statusEl.textContent = "⏳ Fetching history, please wait...";

  const startTime = toChromeTime(start);
  const endTime = toChromeTime(end + "T23:59:59");

  chrome.history.search(
    { text: '', startTime: startTime, endTime: endTime, maxResults: 10000 },
    (results) => {
      const domainMap = {};
      results.forEach(item => {
        try {
          if (!item.url) return;
          const domain = new URL(item.url).hostname;
          if (!domainMap[domain]) domainMap[domain] = [];
          domainMap[domain].push(item);
        } catch (e) {
          console.warn("Skipping invalid URL:", item.url);
        }
      });

      const domainList = Object.keys(domainMap).sort();
      const totalDomains = domainList.length;
      const left = document.getElementById("left");
      left.innerHTML = '';
      
      // Update domain count badge
      document.getElementById('domainCount').textContent = `${totalDomains} domains`;
      
      let index = 0;

      function processNext() {
        if (index >= totalDomains) {
          statusEl.textContent = `✅ Done. Processed ${totalDomains} domain(s).`;
          attachGroupHeaderListeners();
          attachAddButtonListeners();
          return;
        }

        const domain = domainList[index];
        const links = domainMap[domain];
        const group = document.createElement("div");
        group.className = "link-group";
        
        // THIS IS THE KEY PART - Using the helper functions!
        group.innerHTML = `
          <div class="group-header" data-group-id="group${index}">
            <span class="arrow" id="arrow${index}">▶</span>
            <img src="${getFavicon(links[0].url)}" class="domain-favicon" alt="">
            ${domain} — ${links.length} link(s)
          </div>
          <div class="group-links" id="group${index}">
            ${links.map(link => {
              const identifier = getUrlIdentifier(link.url, link.title);
              return `<div class="link-item">
                <div class="link-header">
                  <a href='${link.url}' target='_blank'>${link.title || link.url}</a>
                  <button class="add-button" data-url="${link.url}" data-title="${link.title || link.url}">➕</button>
                </div>
                ${identifier}
              </div>`;
            }).join('')}
          </div>
        `;
        left.appendChild(group);

        index++;
        const percent = Math.floor((index / totalDomains) * 100);
        statusEl.textContent = `🔄 Processing ${index} / ${totalDomains} domains (${percent}%)`;

        setTimeout(processNext, 10);
      }

      statusEl.textContent = `🔍 Fetched ${results.length} items. Starting to process...`;
      processNext();
    }
  );
});

function attachGroupHeaderListeners() {
  document.querySelectorAll(".group-header").forEach(header => {
    header.addEventListener("click", function() {
      const groupId = this.dataset.groupId;
      toggleGroup(groupId, this);
    });
  });
}

function attachAddButtonListeners() {
  document.querySelectorAll(".add-button").forEach(button => {
    button.addEventListener("click", function() {
      const url = this.dataset.url;
      const title = this.dataset.title;
      addToList(url, title);
    });
  });
}

function toggleGroup(id, header) {
  const group = document.getElementById(id);
  const arrow = header.querySelector(".arrow");
  if (group.style.display === "none" || group.style.display === "") {
    group.style.display = "block";
    arrow.textContent = "▼";
  } else {
    group.style.display = "none";
    arrow.textContent = "▶";
  }
}

function addToList(url, title) {
  if (!selected.has(url)) {
    selected.add(url);
    const li = document.createElement("li");
    li.setAttribute("data-url", url);
    li.innerHTML = `<a href="${url}" target="_blank">${title}</a>
                    <button class="remove-button" data-url="${url}">➖</button>`;
    document.getElementById("selectedLinks").appendChild(li);
    
    // Hide empty state
    const emptyState = document.getElementById('emptySelected');
    if (emptyState) emptyState.style.display = 'none';
    
    // Update count badge
    document.getElementById('selectedCount').textContent = `${selected.size} selected`;
    
    li.querySelector(".remove-button").addEventListener("click", function() {
      removeFromList(this.dataset.url);
    });
  }
}

function removeFromList(url) {
  selected.delete(url);
  const items = document.querySelectorAll(`#selectedLinks li`);
  items.forEach(item => {
    if (item.getAttribute("data-url") === url) item.remove();
  });
  
  // Update count badge
  document.getElementById('selectedCount').textContent = `${selected.size} selected`;
  
  // Show empty state if no items
  if (selected.size === 0) {
    const emptyState = document.getElementById('emptySelected');
    if (emptyState) emptyState.style.display = 'flex';
  }
}

function openAll() {
  const urls = Array.from(selected);
  if (urls.length === 0) return alert("No links selected!");
  chrome.windows.create({ url: urls, focused: true });
}

// Tab switching
document.querySelectorAll(".tab-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.tab + "Tab").classList.add("active");
  });
});

// ========== Current Session Logic ==========
function loadOpenTabs() {
  const container = document.getElementById("sessionWindowList");
  container.innerHTML = "";
  chrome.windows.getAll({ populate: true }, (windows) => {
    windows.forEach((win, wIndex) => {
      const div = document.createElement("div");
      div.className = "window-group";
      const header = document.createElement("h3");
      header.textContent = "🪟 Window " + (wIndex + 1);
      div.appendChild(header);
      const ul = document.createElement("ul");
      win.tabs.forEach(tab => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${tab.url}" target="_blank">${tab.title}</a>`;
        ul.appendChild(li);
      });
      div.appendChild(ul);
      container.appendChild(div);
    });
  });
}

document.querySelector("[data-tab='session']").addEventListener("click", loadOpenTabs);

// ========== Saved Sessions Logic ==========
function saveCurrentSession() {
  chrome.windows.getAll({populate: true}, wins => {
    const windowsData = wins.map(w => w.tabs.map(t => ({ title: t.title, url: t.url })));
    const name = prompt("Name this session:", "Session - " + new Date().toLocaleString());
    if (!name) return;

    chrome.storage.local.get({sessions: []}, data => {
      const sessions = data.sessions;
      const dupIdx = sessions.findIndex(s => s.name === name);

      if (dupIdx !== -1) {
        const overwrite = confirm(
          "A session named \"" + name + "\" already exists. Overwrite it?"
        );
        if (!overwrite) return;
        sessions.splice(dupIdx, 1);
      }

      sessions.push({
        name,
        created: new Date().toISOString(),
        windows: windowsData
      });

      chrome.storage.local.set({sessions}, () => {
        alert("✅ Session saved!");
        renderSessions('');
      });
    });
  });
}

function loadSavedSessions() {
  renderSessions('');
}

function restoreSession(idx) {
  chrome.storage.local.get({sessions: []}, data => {
    const session = data.sessions[idx];
    if (!session) return;
    session.windows.forEach(winTabs => {
      const urls = winTabs.map(t => t.url);
      chrome.windows.create({url: urls});
    });
  });
}

function deleteSession(idx) {
  chrome.storage.local.get({sessions: []}, data => {
    const sessions = data.sessions;
    if (idx < 0 || idx >= sessions.length) return;
    sessions.splice(idx, 1);
    chrome.storage.local.set({sessions}, () => renderSessions(''));
  });
}

function renameSession(i) {
  chrome.storage.local.get({sessions: []}, data => {
    const sessions = data.sessions;
    const sess = sessions[i];
    if (!sess) return;
    const newName = prompt("Rename session:", sess.name);
    if (!newName) return;
    sess.name = newName;
    chrome.storage.local.set({sessions}, () => renderSessions(''));
  });
}

function filterSessionByName(session, term) {
  return session.name.toLowerCase().includes(term.toLowerCase());
}

function renderSessions(filterTerm = "") {
  const list = document.getElementById("sessionList");
  list.textContent = "";

  chrome.storage.local.get({sessions: []}, data => {
    let sessions = data.sessions;
    if (filterTerm) sessions = sessions.filter(s => filterSessionByName(s, filterTerm));

    if (!sessions.length) {
      list.innerHTML = "<p>No saved sessions found.</p>";
      return;
    }

    sessions.forEach((s, idx) => {
      const div = document.createElement("div");
      div.className = "session-entry";
      const winCount = s.windows.length;
      const tabCount = s.windows.flat().length;
      div.innerHTML = `
        <h4>🗂️ <span class="session-name" data-i="${idx}">${s.name}</span></h4>
        <div class="meta">📅 ${new Date(s.created).toLocaleString()}<br>🪟 ${winCount} window(s) | 🧩 ${tabCount} tab(s)</div>
        <button class="restore-btn" data-i="${idx}">🔄 Restore</button>
        <button class="rename-btn" data-i="${idx}">🖉 Rename</button>
        <button class="delete-btn" data-i="${idx}">❌ Delete</button>`;
      list.appendChild(div);
    });

    list.querySelectorAll(".restore-btn").forEach(b => b.onclick = () => restoreSession(parseInt(b.dataset.i)));
    list.querySelectorAll(".delete-btn").forEach(b => b.onclick = () => deleteSession(parseInt(b.dataset.i)));
    list.querySelectorAll(".rename-btn").forEach(b => b.onclick = () => renameSession(parseInt(b.dataset.i)));
  });
}

function exportAllSessions() {
  chrome.storage.local.get({sessions: []}, data => {
    const blob = new Blob([JSON.stringify(data.sessions, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "smart-history-sessions-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(url);
  });
}

function importAllSessions() {
  const inp = document.createElement("input");
  inp.type = "file";
  inp.accept = "application/json";
  inp.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    file.text().then(txt => {
      try {
        const imported = JSON.parse(txt);
        if (!Array.isArray(imported)) throw "format";
        chrome.storage.local.set({sessions: imported}, () => {
          alert("✅ Backup restored!");
          renderSessions('');
        });
      } catch (err) {
        alert("❌ Invalid backup file");
      }
    });
  };
  inp.click();
}

// Event hooks
const saveBtn = document.getElementById("saveSessionBtn");
if (saveBtn && !saveBtn.dataset.bound) {
  saveBtn.addEventListener("click", saveCurrentSession);
  saveBtn.dataset.bound = "true";
}

document.querySelector('[data-tab="saved"]').addEventListener("click", loadSavedSessions);

const searchSessionsInput = document.getElementById("searchSessionsInput");
if (searchSessionsInput && !searchSessionsInput.dataset.bound) {
  searchSessionsInput.addEventListener("input", () => renderSessions(searchSessionsInput.value.trim()));
  searchSessionsInput.dataset.bound = "true";
}

const exportBtn = document.getElementById("exportAllBtn");
if (exportBtn && !exportBtn.dataset.bound) {
  exportBtn.addEventListener("click", exportAllSessions);
  exportBtn.dataset.bound = "true";
}

const importBtn = document.getElementById("importAllBtn");
if (importBtn && !importBtn.dataset.bound) {
  importBtn.addEventListener("click", importAllSessions);
  importBtn.dataset.bound = "true";
}
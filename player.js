(() => {
 const PLAYLIST = [
 { src: 'images/let-the-world-burn.mp3' },
 { src: 'images/best-friend.mp3' },
 { src: 'images/snooze.mp3' },
 { src: 'images/444.mp3' },
 { src: 'images/dusk-till-dawn.mp3' },
 { src: 'images/us.mp3' }
 ];

 const STORAGE_KEY = 'hb_player_state';
 const now = () => Date.now();
 let lastSave = 0;

 function loadState() {
 try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
 catch { return {}; }
 }

 function saveState(partial) {
 const state = loadState();
 const next = Object.assign({}, state, partial);
 localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
 }

 function ensureAudioElement() {
 let audio = document.querySelector('audio[data-global-player]');
 if (audio) return audio;
 audio = document.createElement('audio');
 audio.setAttribute('data-global-player', 'true');
 audio.setAttribute('preload', 'auto');
 audio.style.display = 'none';
 document.body.appendChild(audio);
 return audio;
 }

 const audio = ensureAudioElement();

 function findIndexBySrc(src) {
 if (!src) return -1;
 return PLAYLIST.findIndex(item => src.endsWith(item.src));
 }

 function setTimeIfPossible(time) {
 const setTime = () => {
 try { audio.currentTime = time; } catch {}
 };
 if (audio.readyState >= 1) setTime();
 else audio.addEventListener('loadedmetadata', setTime, { once: true });
 }

 function applyState() {
 const state = loadState();
 const currentSrcAttr = audio.getAttribute('src') || '';

 if (state.src) {
 if (!currentSrcAttr || !currentSrcAttr.endsWith(state.src)) {
 audio.src = state.src;
 }
 } else if (!currentSrcAttr) {
 audio.src = PLAYLIST[0].src;
 saveState({ src: audio.src, index: 0 });
 }

 if (Number.isFinite(state.time)) {
 setTimeIfPossible(state.time);
 }

 if (state.playing) {
 setTimeout(() => { audio.play().catch(() => {}); }, 50);
 document.addEventListener('click', () => { audio.play().catch(() => {}); }, { once: true });
 }
 }

 audio.addEventListener('play', () => {
 const src = audio.currentSrc || audio.getAttribute('src') || '';
 const index = findIndexBySrc(src);
 saveState({ src, playing: true, time: audio.currentTime || 0, index });
 });

 audio.addEventListener('pause', () => {
 saveState({ playing: false, time: audio.currentTime || 0 });
 });

 audio.addEventListener('ended', () => {
 const src = audio.currentSrc || audio.getAttribute('src') || '';
 let index = findIndexBySrc(src);
 if (index < 0) {
 const state = loadState();
 index = Number.isInteger(state.index) ? state.index : -1;
 }
 if (index < 0) {
 saveState({ playing: false, time: 0 });
 return;
 }
 const nextIndex = (index + 1) % PLAYLIST.length;
 const nextSrc = PLAYLIST[nextIndex].src;
 audio.src = nextSrc;
 setTimeIfPossible(0);
 saveState({ src: nextSrc, playing: true, time: 0, index: nextIndex });
 audio.play().catch(() => {});
 });

 audio.addEventListener('timeupdate', () => {
 const t = now();
 if (t - lastSave > 1000) {
 lastSave = t;
 saveState({ time: audio.currentTime || 0, src: audio.currentSrc || audio.getAttribute('src') || '' });
 }
 });

 window.addEventListener('beforeunload', () => {
 saveState({ time: audio.currentTime || 0, src: audio.currentSrc || audio.getAttribute('src') || '' });
 });

 applyState();
})();


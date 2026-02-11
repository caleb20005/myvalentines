(() => {
 const card = document.querySelector('.card');
 const heartsLayer = document.querySelector('.hearts');
 const revealBtn = document.getElementById('revealBtn');
 const heartsBtn = document.getElementById('heartsBtn');
 const confettiBtn = document.getElementById('confettiBtn');
 const sub = document.querySelector('.sub');
 const messageEl = document.querySelector('.message');

 function playTone(){
 try{
 const ctx = new (window.AudioContext||window.webkitAudioContext)();
 const o = ctx.createOscillator();
 const g = ctx.createGain();
 o.type = 'sine'; o.frequency.value = 720;
 g.gain.value = 0.0001;
 o.connect(g); g.connect(ctx.destination);
 const now = ctx.currentTime;
 g.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
 o.start(now);
 g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
 o.stop(now + 0.7);
 }catch(e){/* ignore audio errors */}
 }

 function spawnHeart(x, y, size = 36){
 const el = document.createElement('div');
 el.className = 'burst-heart';
 el.style.left = x + 'px';
 el.style.top = y + 'px';
 el.style.width = size + 'px';
 el.style.height = size + 'px';
 heartsLayer.appendChild(el);
 setTimeout(() => el.remove(), 1000);
 }

 function showerHearts(count = 18){
 const rect = card.getBoundingClientRect();
 for(let i=0;i<count;i++){
 const x = rect.left + Math.random() * rect.width;
 const y = rect.top + rect.height + Math.random() * 30;
 spawnHeart(x - rect.left, y - rect.top, 22 + Math.random()*26);
 }
 playTone();
 }

 function spawnConfetti(count = 40){
 const rect = card.getBoundingClientRect();
 const colors = ['#ff6b9a','#ffd166','#ff7bb3','#ff4d88','#ffd1e8','#ffb3d1'];
 for(let i=0;i<count;i++){
 const c = document.createElement('div');
 c.className = 'confetti';
 c.style.left = (Math.random()*rect.width) + 'px';
 c.style.top = (-Math.random()*40) + 'px';
 c.style.background = colors[Math.floor(Math.random()*colors.length)];
 c.style.transform = `rotate(${Math.random()*360}deg)`;
 c.style.opacity = '1';
 c.style.borderRadius = (Math.random()>0.6? '2px':'50%');
 c.style.animation = `confettiFall ${2 + Math.random()*2}s linear forwards`;
 card.appendChild(c);
 setTimeout(()=>c.remove(), 4200);
 }
 playTone();
 }

 function revealMessage(){
 const text = 'Sending you all my love, kisses, and a little mischief today and always.';
 messageEl.classList.add('revealed');
 messageEl.textContent = '';
 let i = 0;
 const t = setInterval(()=>{
 messageEl.textContent += text[i++] || '';
 if(i >= text.length) clearInterval(t);
 }, 28);
 }

 // Events
 revealBtn.addEventListener('click', ()=>{
 revealMessage();
 playTone();
 });

 heartsBtn.addEventListener('click', ()=>{ showerHearts(20); });
 confettiBtn.addEventListener('click', ()=>{ spawnConfetti(48); });

 // click-to-spawn
 card.addEventListener('click', (ev)=>{
 const rect = card.getBoundingClientRect();
 const x = ev.clientX - rect.left;
 const y = ev.clientY - rect.top;
 spawnHeart(x,y,28 + Math.random()*18);
 playTone();
 });

 // response buttons
 const thankBtn = document.getElementById('thankBtn');
 const noThanksBtn = document.getElementById('noThanksBtn');
 const respContainer = document.querySelector('.response-buttons');
 // position response buttons absolutely inside container
 if(respContainer){
 respContainer.style.position = 'relative';
 // place thank button to left, noThanks to the right initially
 if(thankBtn){ thankBtn.style.position = 'absolute'; thankBtn.style.left = (respContainer.clientWidth*0.22)+'px'; thankBtn.style.top = '0px'; }
 if(noThanksBtn){ noThanksBtn.style.position = 'absolute'; noThanksBtn.style.left = (respContainer.clientWidth*0.62)+'px'; noThanksBtn.style.top = '0px'; }
 }

 function showFeedback(text, positive=true){
 let fb = document.querySelector('.resp-feedback');
 if(!fb){ fb = document.createElement('div'); fb.className = 'resp-feedback'; card.appendChild(fb); }
 fb.textContent = text;
 if(positive){ fb.style.color = '#8b0032'; } else { fb.style.color = '#5a2a3a'; }
 // small animation
 fb.style.opacity = '0'; fb.style.transform = 'translateY(6px)';
 requestAnimationFrame(()=>{ fb.style.transition = 'all 420ms ease'; fb.style.opacity = '1'; fb.style.transform = 'translateY(0)'; });
 }
 thankBtn?.addEventListener('click', ()=>{
 // navigate to thank you page
 window.location.href = 'thank-you.html';
 });
 noThanksBtn?.addEventListener('click', ()=>{
 spawnHeart(80,60,40);
 showFeedback('Oh no that hurts my feelings! ', false);
 });

 // make the No Thanks button run around when hovered
 let chaseInterval = null;
 function moveNoThanksRandom(){
 if(!respContainer || !noThanksBtn) return;
 const pRect = respContainer.getBoundingClientRect();
 const bRect = noThanksBtn.getBoundingClientRect();
 const maxLeft = Math.max(4, pRect.width - bRect.width - 8);
 const maxTop = Math.max(0, pRect.height - bRect.height);
 const newLeft = Math.floor(Math.random()*maxLeft);
 const newTop = Math.floor(Math.random()*maxTop);
 noThanksBtn.style.left = newLeft + 'px';
 noThanksBtn.style.top = newTop + 'px';
 }
 noThanksBtn?.addEventListener('mouseenter', ()=>{
 moveNoThanksRandom();
 if(chaseInterval) clearInterval(chaseInterval);
 chaseInterval = setInterval(moveNoThanksRandom, 280);
 });
 noThanksBtn?.addEventListener('mouseleave', ()=>{
 if(chaseInterval) clearInterval(chaseInterval);
 chaseInterval = null;
 // gently return to original spot
 if(respContainer && noThanksBtn){ noThanksBtn.style.left = (respContainer.clientWidth*0.62)+'px'; noThanksBtn.style.top = '0px'; }
 });

 // small automatic welcome animation
 window.addEventListener('load', ()=>{
 setTimeout(()=>{ showerHearts(6); }, 600);
 });
})();

/* Background crystalline hearts generator */
(()=>{
 const bgHearts = document.querySelector('.bg-hearts');
 const count = 8;
 for(let i=0;i<count;i++){
 const h = document.createElement('div');
 h.className = 'crystal-heart';
 const dur = 18 + Math.random()*14;
 const delay = Math.random()*-dur;
 const left = Math.random()*100;
 h.style.setProperty('--dur', dur+'s');
 h.style.left = left+'%';
 h.style.animationDelay = delay+'s';
 h.style.opacity = 0.4 + Math.random()*0.5;
 bgHearts.appendChild(h);
 }
})();


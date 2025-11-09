// Final version: stars fly with velocities, each star has unique message; clicking shows tooltip.
// Moon click shows a modal with a long declaration. Sounds included (WebAudio).

const STAR_COUNT = 40;
const sky = document.getElementById('sky');
const starsList = document.getElementById('starsList');
const tooltip = document.getElementById('starTooltip');
const moon = document.getElementById('moon');
const moonModal = document.getElementById('moonModal');
const closeModal = document.getElementById('closeModal');
const moonTextEl = document.getElementById('moonText');

// Humanized, real-feeling messages for stars (unique)
const starMessages = [
  'Quando penso em você, as noites viram poesia.',
  'Seu sorriso quebra minhas tempestades.',
  'Guardo teu perfume nas lembranças do vento.',
  'Cada estrela carrega um dos nossos sorrisos.',
  'Perto de você, o mundo calma e respira certo.',
  'Te chamar de minha é o melhor verbo que conheço.',
  'Seu abraço é lar onde quero morar pra sempre.',
  'O som da sua risada é minha melodia favorita.',
  'Te prometo noites de café e dias de bravura.',
  'Você transforma pequenos momentos em eternos.',
  'Sou mais inteiro quando caminho ao seu lado.',
  'Seu olhar tem o mapa do meu caminho.',
  'Teu nome é fogo e também é paz pra mim.',
  'Quero ser seu porto nas manhãs chuvosas.',
  'Você me ensina a ser melhor sem esforço.',
  'Se o mundo acabar, que seja ao seu lado.',
  'As horas com você têm gosto de volta pra casa.',
  'Não há solidão quando tenho sua mão.',
  'Minha coragem veio do teu carinho.',
  'Você é a poesia que eu não sabia escrever.',
  'Em cada plano meu, você é a parte principal.',
  'O futuro é um caminho que quero trilhar contigo.',
  'Teu abraço é a minha melhor paisagem.',
  'Eu coleciono seus olhares como quem coleciona estrelas.',
  'A voz da noite me lembra você, calma e segura.',
  'Teu jeito miúdo domina meu mundo inteiro.',
  'Sinto você em cheiros, músicas e no ar que respiro.',
  'O teu nome acalma tempestades no meu peito.',
  'Prometo cuidar de ti com toda a minha força.',
  'Te amar é aprender todos os dias, com alegria.',
  'Quero envelhecer conto por conto ao teu lado.',
  'Você é liberdade e também abrigo.',
  'Seus defeitos são mapas de carinho pra mim.',
  'Olhar você dormir me ensina o que é gratidão.',
  'Teu abraço é receita de paz para minhas noites.',
  'A gente cresce junto, como as estrelas aprendem o céu.',
  'Minha maior coragem é dizer: eu te amo, sempre.',
  'É contigo que eu quero dividir as melhores histórias.'
];

// star objects will hold dom node and physics
const stars = [];

// Canvas size helper (we'll use absolute divs)
function sizeSky(){
  const rect = document.body.getBoundingClientRect();
  return {width: rect.width, height: rect.height};
}

// create stars DOM elements with random pos and velocities
function initStars(){
  const {width, height} = sizeSky();
  for(let i=0;i<STAR_COUNT;i++){
    const el = document.createElement('div');
    el.className = 'star-dot';
    el.style.position = 'absolute';
    el.style.width = el.style.height = (Math.random()*3 + 1.5) + 'px';
    el.style.borderRadius = '50%';
    el.style.background = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0) 70%)';
    el.style.boxShadow = '0 0 6px rgba(255,255,255,0.2)';
    // random position
    const x = Math.random()*width;
    const y = Math.random()*height;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    // add to sky
    sky.appendChild(el);
    // velocity small random
    const vx = (Math.random()*1.2 - 0.6);
    const vy = (Math.random()*1.2 - 0.6);
    const msg = starMessages[i % starMessages.length];
    // click handler
    el.addEventListener('click', (ev)=>{
      showStarMessage(ev.clientX, ev.clientY, msg);
      playStarTone();
    });
    // touch support
    el.addEventListener('touchstart', (ev)=>{
      const touch = ev.touches[0];
      showStarMessage(touch.clientX, touch.clientY, msg);
      playStarTone();
    });
    stars.push({el, x, y, vx, vy, w: width, h: height, msg});
    // add small entry to starsList
    const li = document.createElement('div');
    li.className = 'star-item';
    li.textContent = '★ ' + msg;
    starsList.appendChild(li);
  }
}

// animate stars positions: simple wrap-around
let lastTime = performance.now();
function animate(now){
  const dt = Math.min(0.05, (now - lastTime)/1000);
  lastTime = now;
  const {width, height} = sizeSky();
  for(const s of stars){
    s.x += s.vx * 40 * dt; // speed factor
    s.y += s.vy * 40 * dt;
    // wrap
    if(s.x < -10) s.x = width + 10;
    if(s.x > width + 10) s.x = -10;
    if(s.y < -10) s.y = height + 10;
    if(s.y > height + 10) s.y = -10;
    s.el.style.left = s.x + 'px';
    s.el.style.top = s.y + 'px';
    // gentle pulsate scale
    const scale = 0.85 + 0.3 * Math.sin((now/1000) + (s.x+s.y)/150);
    s.el.style.transform = 'scale(' + scale.toFixed(2) + ')';
  }
  requestAnimationFrame(animate);
}

// show tooltip with message near click, auto-hide
let tooltipTimeout;
function showStarMessage(x, y, text){
  clearTimeout(tooltipTimeout);
  tooltip.style.left = (x + 12) + 'px';
  tooltip.style.top = (y + 12) + 'px';
  tooltip.innerHTML = text;
  tooltip.style.display = 'block';
  tooltip.setAttribute('aria-hidden','false');
  tooltip.style.opacity = '0';
  tooltip.style.transition = 'opacity .18s ease, transform .18s ease';
  tooltip.style.transform = 'translateY(6px)';
  requestAnimationFrame(()=>{
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0px)';
  });
  tooltipTimeout = setTimeout(()=>{
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(6px)';
    tooltip.setAttribute('aria-hidden','true');
    setTimeout(()=> tooltip.style.display = 'none', 220);
  }, 5200);
}

// WebAudio: subtle star tone
let audioCtx;
function playStarTone(){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = 880 + Math.random()*120;
    g.gain.value = 0.0001;
    o.connect(g); g.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.02, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    o.start(now); o.stop(now + 0.14);
  }catch(e){ console.warn('audio error', e); }
}

// Moon: show modal with big declaration
const moonDeclaration = `Meu amor Giovanna,

Há momentos em que as palavras parecem pequenas diante do que sinto por você — mesmo assim, eu escrevo cada uma delas como se fosse um gesto, uma promessa que te entrego. Você é calma e tempestade, a doçura que me completa e a coragem que me empurra para frente. Quando penso no futuro, é teu rosto que ilumina o caminho; quando penso em casa, é teu abraço que reconheço como abrigo.

Quero te prometer coisas simples e eternas: cafés em manhãs preguiçosas, mãos dadas em dias incertos, presentes de atenção em noites comuns, e uma presença firme nos dias mais difíceis. Quero rir com você, chorar quando for necessário e construir, lado a lado, um lugar onde sejamos nós mesmos — imperfeitos e inteiros, sempre companheiros.

Giovanna, te amar é a minha mais bonita escolha. Se a vida nos der mil cenários, eu escolherei você em todos. Hoje e amanhã, com o calor do meu peito e a calma das minhas palavras: eu te amo, profundamente, e sempre será assim.

— Wen`;

// play a gentle chord for moon click
function playMoonChord(){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    const freqs = [440, 660, 880]; // basic major-ish chord
    const gains = freqs.map(() => audioCtx.createGain());
    const oscs = freqs.map((f,i)=>{
      const o = audioCtx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(gains[i]);
      gains[i].connect(audioCtx.destination);
      gains[i].gain.setValueAtTime(0.0001, now);
      gains[i].gain.exponentialRampToValueAtTime(0.03/(i+1), now + 0.02);
      gains[i].gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      o.start(now);
      o.stop(now + 1.2);
      return o;
    });
  }catch(e){ console.warn('audio', e); }
}

function openMoonModal(){
  moonModal.classList.add('show');
  moonModal.setAttribute('aria-hidden','false');
  moonTextEl.textContent = moonDeclaration;
  playMoonChord();
}

function closeMoonModal(){
  moonModal.classList.remove('show');
  moonModal.setAttribute('aria-hidden','true');
}

// events
moon.addEventListener('click', ()=> openMoonModal());
moon.addEventListener('keydown', (e)=> { if(e.key === 'Enter' || e.key === ' ') openMoonModal(); });
closeModal.addEventListener('click', closeMoonModal);
moonModal.addEventListener('click', (e)=>{ if(e.target === moonModal) closeMoonModal(); });

// init
window.addEventListener('load', ()=>{
  initStars();
  requestAnimationFrame(animate);
  // populate starsList already done in initStars via DOM entries
});
// handle resize to keep stars in bounds
window.addEventListener('resize', ()=>{
  const {width, height} = sizeSky();
  for(const s of stars){ s.w = width; s.h = height; }
});
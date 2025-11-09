// Conteúdo dinâmico
const starTexts = [
  'Você é minha estrela favorita.',
  'Brilha mais que todas.',
  'Tua luz guia meu coração.',
  'Pequeno ponto no céu, grande no meu mundo.',
  'Até o infinito parece pequeno perto de você.',
  'Te amo em cada cintilar.',
  'Te vejo até nas estrelas.'
];

// Cria pequenas estrelas visuais no fundo (apenas decorativas)
function createBackgroundStars(){
  const sky = document.getElementById('sky');
  for(let i=0;i<60;i++){
    const s = document.createElement('div');
    s.style.position='absolute';
    const size = (Math.random()*2 + 0.6).toFixed(2);
    s.style.width = size+'px';
    s.style.height = size+'px';
    s.style.borderRadius='50%';
    s.style.left = (Math.random()*100)+'%';
    s.style.top = (Math.random()*100)+'%';
    s.style.background = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0) 70%)';
    s.style.opacity = (Math.random()*0.7 + 0.2);
    s.style.filter = 'blur(0.2px)';
    s.style.animation = `twinkle ${Math.random()*5 + 3}s infinite ease-in-out`;
    sky.appendChild(s);
  }
}

// Lista de textos de estrelas
function populateStarTexts(){
  const list = document.getElementById('starsList');
  starTexts.forEach(t => {
    const el = document.createElement('div');
    el.className = 'star-item';
    el.textContent = '★ ' + t;
    list.appendChild(el);
  });
}

// Hearts interactive
const phrases = [
  {lang:'Português', text:'Eu te amo, Giovanna.'},
  {lang:'Inglês', text:'I love you, Giovanna.'},
  {lang:'Francês', text:"Je t'aime, Giovanna."},
  {lang:'Espanhol', text:'Te amo, Giovanna.'},
  {lang:'Italiano', text:'Ti amo, Giovanna.'},
  {lang:'Alemão', text:'Ich liebe dich, Giovanna.'},
  {lang:'Japonês', text:'愛してるよ, Giovanna.'},
  {lang:'Coreano', text:'사랑해, Giovanna.'},
  {lang:'Russo', text:'Я тебя люблю, Giovanna.'},
  {lang:'Chinês', text:'我爱你, Giovanna.'},
  {lang:'Grego', text:'Σ\' αγαπώ, Giovanna.'},
  {lang:'Árabe', text:'أحبكِ يا Giovanna.'}
];

function createHearts(){
  const container = document.getElementById('hearts');
  const phraseBox = document.getElementById('phrase');
  // criação
  phrases.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = 'heart';
    btn.type = 'button';
    btn.title = p.lang;
    btn.textContent = '❤';
    btn.addEventListener('click', ()=>{
      phraseBox.textContent = p.text;
      playClickTone();
      // pequena animaçao
      btn.style.transform = 'scale(1.05)';
      setTimeout(()=> btn.style.transform = '', 180);
    });
    container.appendChild(btn);
  });
  // texto inicial
  phraseBox.textContent = phrases[0].text;
}

// simples som de clique (WebAudio) com controle de volume suave
let audioCtx;
function playClickTone(){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.02, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.13);
  }catch(e){
    // se bloqueado pelo navegador, silenciosamente ignora
    console.warn('audio error', e);
  }
}

window.addEventListener('load', ()=>{
  createBackgroundStars();
  populateStarTexts();
  createHearts();
});
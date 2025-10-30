// MyResume interactive JS
document.addEventListener('DOMContentLoaded', ()=>{

  // animated background (simple particles)
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas && canvas.getContext('2d');
  function resizeCanvas(){
    if(!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.86;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // particles
  const particles = [];
  const colors = ['rgba(110,123,255,0.18)','rgba(0,212,122,0.12)','rgba(255,255,255,0.06)'];
  for(let i=0;i<36;i++){
    particles.push({
      x: Math.random()* (canvas.width||1200),
      y: Math.random()* (canvas.height||600),
      r: 30+Math.random()*80,
      vx: (Math.random()-0.5)*0.1,
      vy: (Math.random()-0.5)*0.1,
      c: colors[i%colors.length]
    });
  }
  function draw(){
    if(!ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      ctx.beginPath();
      const g = ctx.createRadialGradient(p.x,p.y,p.r*0.1,p.x,p.y,p.r);
      g.addColorStop(0, p.c);
      g.addColorStop(1, 'rgba(2,6,12,0)');
      ctx.fillStyle = g;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();

  // project modal
  const modal = document.getElementById('projModal');
  const modalContent = document.getElementById('modalContent');
  const closeBtn = document.getElementById('modalClose');

  function openModal(title, html){
    modalContent.innerHTML = `<h3 id="modalTitle" style="color:#fff;margin-top:0">${title}</h3>${html}`;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=> { if(e.target===modal) closeModal(); });

  document.querySelectorAll('.proj-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const title = card.dataset.title || card.querySelector('h3').innerText;
      const desc = card.querySelector('.proj-body p').innerText;
      const tags = Array.from(card.querySelectorAll('.tags span')).map(s=>s.innerText).join(', ');
      const img = card.querySelector('img').src;
      openModal(title, `<img src="${img}" style="width:100%;border-radius:8px;margin-bottom:12px"/><p style="color:#bcd1e6">${desc}</p><p style="color:#9fb0c9"><strong>Tech:</strong> ${tags}</p><p style="margin-top:12px;color:#9fb0c9">Full repos on <a href="https://github.com/NeilBorikar" target="_blank" rel="noopener">GitHub</a>.</p>`);
    });
  });

  // stats counters
  const counters = document.querySelectorAll('.num[data-target], .stat .num');
  const speed = 28;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const target = +el.getAttribute('data-target') || 0;
        let n = 0;
        const step = Math.ceil(target/speed);
        const run = ()=> {
          n += step;
          if(n < target){ el.innerText = n; requestAnimationFrame(run) }
          else el.innerText = target;
        };
        run();
        obs.unobserve(el);
      }
    });
  }, {threshold:0.4});
  counters.forEach(c => obs.observe(c));

  // skill bars animate
  const fills = document.querySelectorAll('.fill');
  const fillObs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const v = en.target.getAttribute('data-percent') || 70;
        en.target.style.width = v + '%';
        fillObs.unobserve(en.target);
      }
    });
  }, {threshold:0.25});
  fills.forEach(f=> fillObs.observe(f));

  // form simulation (no backend)
  window.contactSubmit = function(ev){
    ev.preventDefault();
    const name = ev.target.name.value;
    const msg = document.getElementById('formMsg');
    msg.innerText = 'Thanks ' + (name||'there') + '! I will reply at neilborikar25@gmail.com — (demo form)';
    ev.target.reset();
    return false;
  };

  window.copyEmail = function(){
    navigator.clipboard && navigator.clipboard.writeText('neilborikar25@gmail.com').then(()=> {
      alert('Email copied to clipboard');
    });
  };

  // mobile menu
  const burger = document.getElementById('burgerBtn');
  burger && burger.addEventListener('click', ()=>{
    document.querySelector('.nav-links').classList.toggle('open');
  });

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.length > 1){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // theme toggle (light/dark)
  const tbtn = document.getElementById('themeToggle');
  tbtn && tbtn.addEventListener('click', ()=> {
    document.documentElement.classList.toggle('light-theme');
  });

}); // DOMContentLoaded

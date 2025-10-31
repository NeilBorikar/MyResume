// =========================
//  MyResume — Interactive JS
//  Optimized by ChatGPT (GPT-5) for Neil Borikar
// =========================

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------
  // HERO BACKGROUND ANIMATION (only if heroCanvas exists)
  // ----------------------------------------------------------
  const canvas = document.getElementById('heroCanvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.86;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const colors = [
      'rgba(0,170,255,0.25)',  // accent blue
      'rgba(51,204,102,0.25)', // accent green
      'rgba(255,255,255,0.18)' // white shimmer
    ];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 25 + Math.random() * 70,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        c: colors[i % colors.length]
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // wrap around edges
        if (p.x - p.r > canvas.width) p.x = -p.r;
        if (p.x + p.r < 0) p.x = canvas.width + p.r;
        if (p.y - p.r > canvas.height) p.y = -p.r;
        if (p.y + p.r < 0) p.y = canvas.height + p.r;

        const g = ctx.createRadialGradient(p.x, p.y, p.r * 0.1, p.x, p.y, p.r);
        g.addColorStop(0, p.c);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }

  // ----------------------------------------------------------
  // PROJECT MODAL HANDLER
  // ----------------------------------------------------------
  const modal = document.getElementById('projModal');
  const modalContent = document.getElementById('modalContent');
  const closeBtn = document.getElementById('modalClose');

  const openModal = (title, html) => {
    if (!modal || !modalContent) return;
    modalContent.innerHTML = `
      <h3 id="modalTitle" style="color:#0b0c0f;margin-top:0">${title}</h3>
      ${html}
    `;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.dataset.title || card.querySelector('h3')?.innerText || 'Project';
      const desc = card.querySelector('.proj-body p')?.innerText || '';
      const tags = Array.from(card.querySelectorAll('.tags span')).map(s => s.innerText).join(', ');
      const img = card.querySelector('img')?.src || '';
      openModal(
        title,
        `<img src="${img}" style="width:100%;border-radius:8px;margin-bottom:12px" alt="${title}" />
         <p style="color:#444">${desc}</p>
         <p style="color:#555"><strong>Tech:</strong> ${tags}</p>
         <p style="margin-top:12px;color:#666">See full repos on 
           <a href="https://github.com/NeilBorikar" target="_blank" rel="noopener">GitHub</a>.
         </p>`
      );
    });
  });

  // ----------------------------------------------------------
  // COUNTERS (About page)
  // ----------------------------------------------------------
  const counters = document.querySelectorAll('.num[data-target], .stat .num');
  const speed = 28;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute('data-target') || 0;
        let n = 0;
        const step = Math.ceil(target / speed);
        const run = () => {
          n += step;
          if (n < target) {
            el.innerText = n;
            requestAnimationFrame(run);
          } else {
            el.innerText = target;
          }
        };
        run();
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => obs.observe(c));

  // ----------------------------------------------------------
  // SKILL BAR ANIMATION
  // ----------------------------------------------------------
  const fills = document.querySelectorAll('.fill');
  const fillObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const v = en.target.getAttribute('data-percent') || 70;
        en.target.style.width = v + '%';
        fillObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.25 });
  fills.forEach(f => fillObs.observe(f));

  // ----------------------------------------------------------
  // CONTACT FORM (demo only)
  // ----------------------------------------------------------
  window.contactSubmit = function (ev) {
    ev.preventDefault();
    const name = ev.target.name.value;
    const msg = document.getElementById('formMsg');
    msg.innerText = `Thanks ${name || 'there'}! I'll reply at neilborikar25@gmail.com — (demo form).`;
    ev.target.reset();
    return false;
  };

  window.copyEmail = function () {
    navigator.clipboard?.writeText('neilborikar25@gmail.com').then(() => {
      alert('Email copied to clipboard ✅');
    });
  };

  // ----------------------------------------------------------
  // MOBILE NAV TOGGLE
  // ----------------------------------------------------------
  const burger = document.getElementById('burgerBtn');
  if (burger) {
    burger.addEventListener('click', () => {
      document.querySelector('.nav-links')?.classList.toggle('open');
    });
  }

  // ----------------------------------------------------------
  // SMOOTH SCROLL FOR IN-PAGE LINKS
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ----------------------------------------------------------
  // THEME TOGGLE
  // ----------------------------------------------------------
  const tbtn = document.getElementById('themeToggle');
  if (tbtn) {
    tbtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('light-theme');
    });
  }

});

/* ==========================================================================
   SOFTRIDER — Interactive Animations, Neural Canvas & Assistant IA
   ========================================================================== */

const SUPABASE_URL = 'https://yzntjpwkaszqoivlpkri.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ZRBsjdiijxuDJXMoLvOXeg_RWdXLNTo';
const supabaseClient =
  typeof supabase !== 'undefined'
    ? supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null;

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. Cosmic Neural & Starfield Canvas Animation
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('cosmos-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(75, Math.floor((width * height) / 22000));
    const mouse = { x: width * 0.7, y: height * 0.35, radius: 170 };

    const colors = ['#00e5ff', '#38bdf8', '#6366f1', '#a855f7', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        size: Math.random() * 2 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.65 + 0.2,
      });
    }

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw glowing node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#38bdf8';
            ctx.globalAlpha = (1 - dist / 125) * 0.14;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor subtly
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = '#00e5ff';
          ctx.globalAlpha = (1 - mDist / mouse.radius) * 0.24;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animateCanvas);
    }

    animateCanvas();
  }

  /* ------------------------------------------------------------------------
     2. Hero Artwork Subtle 3D Mouse Parallax
     ------------------------------------------------------------------------ */
  const heroParallax = document.getElementById('hero-parallax');
  if (heroParallax) {
    window.addEventListener('mousemove', (e) => {
      const xRatio = (e.clientX / window.innerWidth - 0.5) * 14;
      const yRatio = (e.clientY / window.innerHeight - 0.5) * 10;
      heroParallax.style.transform = `translate3d(${xRatio}px, ${yRatio}px, 0) scale(1.02)`;
    });
  }

  /* ------------------------------------------------------------------------
     3. Sticky Navbar & Active Section Highlight
     ------------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav__link[data-section]');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Section Spy for Navbar Active Indicator
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const target = link.getAttribute('data-section');
            if (target === id || (id === 'methode' && target === 'a-propos')) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((sec) => sectionObserver.observe(sec));

  /* ------------------------------------------------------------------------
     4. Solution Details & Showreel Video Modals
     ------------------------------------------------------------------------ */
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  const openVideoBtn = document.getElementById('open-video-modal');

  const solutionsData = {
    ai: {
      badge: 'Pôle Intelligence Artificielle',
      title: 'Soft AI — Intelligence Artificielle & Automatisation',
      desc: "Intégrez la puissance de l'IA générative et des agents autonomes au cœur de votre entreprise pour automatiser vos flux et décupler votre productivité.",
      bullets: [
        'Agents IA sur mesure & Assistants conversationnels connectés à vos données (RAG)',
        'Automatisation intelligente des processus métiers (CRM, ERP, Support, RH)',
        'Modèles prédictifs, vision par ordinateur & analyse documentaire automatisée',
        'Déploiement sécurisé (Cloud privé ou API OpenAI / Gemini / Claude / Mistral)',
      ],
      selectValue: 'Soft AI',
    },
    dev: {
      badge: 'Pôle Ingénierie Logicielle',
      title: 'Soft Dev — Création de Logiciels Sur Mesure',
      desc: 'Nous concevons et développons des architectures logicielles robustes, évolutives et parfaitement adaptées à vos processus opérationnels.',
      bullets: [
        'Plateformes SaaS, ERP, CRM et tableaux de bord décisionnels temps réel',
        'Architecture microservices, API REST / GraphQL & intégration système',
        'Modernisation de logiciels existants & migration Cloud haute disponibilité',
        'Sécurité de bout en bout, tests automatisés et haute performance',
      ],
      selectValue: 'Soft Dev',
    },
    web: {
      badge: 'Pôle Expériences Digitales',
      title: 'Soft Web — Sites Web & Applications Mobiles',
      desc: 'Des interfaces futuristes, ultra-rapides et pensées pour convertir vos visiteurs sur tous les écrans (Web, iOS et Android).',
      bullets: [
        'Sites vitrines immersifs, Landing pages haute conversion & E-commerce',
        'Applications mobiles natives et cross-platform (iOS & Android)',
        'Design UI/UX sur mesure, animations interactives & identité visuelle forte',
        'Optimisation SEO technique, Core Web Vitals & accessibilité',
      ],
      selectValue: 'Soft Web',
    },
    digital: {
      badge: 'Pôle Stratégie & Conseil',
      title: 'Soft Digital — Conseil & Accompagnement Numérique',
      desc: 'Un accompagnement stratégique de la vision initiale jusqu’à la croissance continue de votre écosystème numérique.',
      bullets: [
        'Audit technologique & feuille de route de transformation digitale et IA',
        'Direction technique externalisée (CTO as a Service) & cadrage produit',
        'Accompagnement au changement et formation de vos équipes aux outils IA',
        'Suivi de performance, scalabilité et maintenance évolutive durable',
      ],
      selectValue: 'Soft Digital',
    },
  };

  function openModal(html) {
    if (!modalBackdrop || !modalContent) return;
    modalContent.innerHTML = html;
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.querySelectorAll('[data-solution-modal]').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const key = item.getAttribute('data-solution-modal');
      const data = solutionsData[key];
      if (!data) return;

      openModal(`
        <span class="section-tag">${data.badge}</span>
        <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; margin-bottom: 12px; color: #fff;">
          ${data.title}
        </h3>
        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
          ${data.desc}
        </p>
        <ul class="vision-checklist" style="margin-bottom: 28px;">
          ${data.bullets
            .map(
              (b) => `
            <li class="vision-checklist__item">
              <span class="check-badge">✓</span>
              <span>${b}</span>
            </li>`
            )
            .join('')}
        </ul>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="#contact" class="btn-gradient" id="modal-cta-select" data-select="${data.selectValue}">
            <span>Démarrer un projet ${data.selectValue}</span>
            <span class="btn-gradient__arrow">→</span>
          </a>
        </div>
      `);

      const ctaSelect = document.getElementById('modal-cta-select');
      if (ctaSelect) {
        ctaSelect.addEventListener('click', () => {
          const selectEl = document.getElementById('project-type');
          if (selectEl) selectEl.value = data.selectValue;
          closeModal();
        });
      }
    });
  });

  if (openVideoBtn) {
    openVideoBtn.addEventListener('click', () => {
      openModal(`
        <span class="section-tag">Présentation Interactive</span>
        <h3 style="font-family: var(--font-heading); font-size: 1.55rem; font-weight: 800; margin-bottom: 12px;">
          Découvrez l'univers <span class="text-gradient-realite">SOFTRIDER</span>
        </h3>
        <div style="position: relative; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,229,255,0.4); margin-bottom: 20px; background: #04071a;">
          <img src="assets/hero-ai.jpg" alt="Aperçu vidéo SOFTRIDER" style="width: 100%; height: 270px; object-fit: cover; opacity: 0.78;" />
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(3,5,17,0.2), rgba(3,5,17,0.92)); display: flex; flex-direction: column; justify-content: flex-end; padding: 24px;">
            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;">
              <span class="tech-pill">01 • Soft AI</span>
              <span class="tech-pill">02 • Soft Dev</span>
              <span class="tech-pill">03 • Soft Web</span>
              <span class="tech-pill">04 • Soft Digital</span>
            </div>
            <p style="font-size: 0.95rem; color: #e2e8f0; line-height: 1.55;">
              De l'idéation à la mise en production d'agents IA et d'applications sur mesure, notre équipe fusionne design futuriste et ingénierie de pointe.
            </p>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end;">
          <a href="#contact" class="btn-gradient" onclick="document.getElementById('modal-backdrop').classList.remove('open')">
            <span>Planifier une démo personnalisée</span>
            <span class="btn-gradient__arrow">→</span>
          </a>
        </div>
      `);
    });
  }

  /* ------------------------------------------------------------------------
     5. Portfolio Category Filtering (#realisations)
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      portfolioCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     6. Contact Form Submission Feedback
     ------------------------------------------------------------------------ */
  const projectForm = document.getElementById('project-form');
  const formFeedback = document.getElementById('form-feedback');

  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = projectForm.querySelector('button[type="submit"]');
      const lead = {
        full_name: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        project_type: document.getElementById('project-type').value,
        message: document.getElementById('contact-message').value.trim(),
      };

      if (submitBtn) submitBtn.disabled = true;

      try {
        if (!supabaseClient) throw new Error('Supabase non initialisé');
        const { error } = await supabaseClient.from('leads').insert([lead]);
        if (error) throw error;

        if (formFeedback) {
          formFeedback.style.display = 'block';
          formFeedback.style.color = '#00e5ff';
          formFeedback.textContent =
            '✓ Merci ! Votre demande a bien été transmise aux experts SOFTRIDER. Nous vous recontactons sous 24h.';
        }
        projectForm.reset();
      } catch (err) {
        console.error('Erreur envoi lead Supabase:', err);
        if (formFeedback) {
          formFeedback.style.display = 'block';
          formFeedback.style.color = '#f87171';
          formFeedback.textContent =
            '✗ Une erreur est survenue. Merci de nous contacter directement par email ou téléphone.';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. Floating "Assistant IA" Interactive Chatbot Powered by Google Gemini
     ------------------------------------------------------------------------ */
  const aiAssistant = document.getElementById('ai-assistant');
  const closeAssistantBtn = document.getElementById('close-assistant');
  const aiLauncher = document.getElementById('ai-launcher');
  const aiChatBody = document.getElementById('ai-chat-body');
  const aiChatForm = document.getElementById('ai-chat-form');
  const aiChatInput = document.getElementById('ai-chat-input');
  const quickButtons = document.querySelectorAll('.ai-quick-btn');

  const toggleConfigBtn = document.getElementById('toggle-gemini-config');
  const configDrawer = document.getElementById('gemini-config-drawer');
  const apiKeyInput = document.getElementById('gemini-api-key-input');
  const saveKeyBtn = document.getElementById('save-gemini-key');
  const configHint = document.getElementById('gemini-config-hint');
  const statusText = document.getElementById('gemini-status-text');
  const clearChatBtn = document.getElementById('clear-gemini-chat');

  const STORAGE_KEY = 'SOFTRIDER_GEMINI_API_KEY';
  const GEMINI_MODEL = 'gemini-2.5-flash';

  const SOFTRIDER_SYSTEM_PROMPT = `Tu es l'Assistant IA officiel de SOFTRIDER (Agence Tech & IA — "L'innovation numérique sans limites"), propulsé par Google Gemini.
SOFTRIDER est un produit de M2K FinTech.
Ton rôle est d'accueillir les visiteurs de manière professionnelle, moderne, chaleureuse et concise (en français), de répondre à leurs questions techniques ou commerciales, et de les orienter vers un devis ou un échange avec un expert.

Informations clés sur SOFTRIDER (produit de M2K FinTech) :
1. Nos 4 Pôles d'Expertise :
   - Soft AI : Intelligence artificielle et automatisation (Agents IA autonomes, RAG connecté aux documents d'entreprise, intégration Google Gemini, automatisation CRM/ERP).
   - Soft Dev : Création de logiciels sur mesure (Plateformes SaaS, applications métiers, ERP/CRM, API & architectures Cloud haute performance).
   - Soft Web : Sites web et applications mobiles (Sites vitrines futuristes 3D, landing pages haute conversion, e-commerce, applications iOS & Android).
   - Soft Digital : Conseil et accompagnement numérique (Audit technologique, CTO as a Service, sécurité & performance, formation IA).
2. Notre Méthode en 4 étapes :
   1) Découverte (Comprendre vos besoins)
   2) Conception (Imaginer la meilleure solution)
   3) Développement (Construire avec excellence)
   4) Lancement (Vous accompagner durablement)
3. Nos Engagements : Solutions sur mesure, Expertise technologique, Innovation continue, Accompagnement personnalisé, Sécurité & performance.
4. Contact & Coordonnées officielles :
   - Produit : SOFTRIDER est un produit de M2K FinTech
   - Email direct : service.commercial@m2k-fintech.fr
   - Téléphone direct : +33 6 99 88 20 87
   - Formulaire de projet en bas de page (#contact) avec réponse garantie sous 24h.

Consignes de style :
- Réponds en 2 à 5 phrases claires, structurées avec des puces si pertinent.
- Utilise un ton dynamique et expert.`;

  // Conversation history for multi-turn Gemini context
  let conversationHistory = [];

  function updateGeminiStatusUI() {
    const savedKey = localStorage.getItem(STORAGE_KEY) || '';
    if (apiKeyInput && savedKey) {
      apiKeyInput.value = savedKey;
    }
    if (statusText) {
      statusText.textContent = savedKey
        ? 'En ligne • Gemini 2.5 Flash API'
        : 'En ligne • Gemini 2.5';
    }
  }

  updateGeminiStatusUI();

  if (toggleConfigBtn && configDrawer) {
    toggleConfigBtn.addEventListener('click', () => {
      configDrawer.classList.toggle('open');
      toggleConfigBtn.classList.toggle('active');
    });
  }

  if (saveKeyBtn && apiKeyInput) {
    saveKeyBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      if (key) {
        localStorage.setItem(STORAGE_KEY, key);
        if (configHint) {
          configHint.style.color = '#00e5ff';
          configHint.textContent = '✓ Clé API Gemini enregistrée ! Vos messages utilisent désormais Gemini 2.5 Flash en direct.';
        }
      } else {
        localStorage.removeItem(STORAGE_KEY);
        if (configHint) {
          configHint.style.color = '#94a3b8';
          configHint.textContent = 'Clé supprimée. Utilisation du serveur local ou du moteur intelligent SOFTRIDER.';
        }
      }
      updateGeminiStatusUI();
      setTimeout(() => {
        if (configDrawer) configDrawer.classList.remove('open');
        if (toggleConfigBtn) toggleConfigBtn.classList.remove('active');
      }, 900);
    });
  }

  if (clearChatBtn && aiChatBody) {
    clearChatBtn.addEventListener('click', () => {
      conversationHistory = [];
      aiChatBody.innerHTML = `
        <div class="ai-msg">
          Bonjour ! 👋<br />
          Comment puis-je vous aider aujourd'hui ?
        </div>
        <div class="ai-quick-actions" id="ai-quick-actions">
          <button type="button" class="ai-quick-btn" data-prompt="Nos services">Nos services</button>
          <button type="button" class="ai-quick-btn" data-prompt="Demander un devis">Demander un devis</button>
          <button type="button" class="ai-quick-btn" data-prompt="Parler à un expert">Parler à un expert</button>
        </div>
      `;
      aiChatBody.querySelectorAll('.ai-quick-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const prompt = btn.getAttribute('data-prompt');
          if (prompt) handleUserPrompt(prompt);
        });
      });
    });
  }

  if (closeAssistantBtn && aiAssistant && aiLauncher) {
    closeAssistantBtn.addEventListener('click', () => {
      aiAssistant.classList.add('minimized');
      aiLauncher.classList.add('visible');
    });

    aiLauncher.addEventListener('click', () => {
      aiAssistant.classList.remove('minimized');
      aiLauncher.classList.remove('visible');
    });
  }

  function formatMarkdownToHTML(md) {
    return md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(0,229,255,0.12);padding:1px 5px;border-radius:4px;color:#00e5ff;">$1</code>')
      .replace(/#contact/g, '<a href="#contact" style="color:#00e5ff;text-decoration:underline;">#contact</a>')
      .replace(/\n/g, '<br/>');
  }

  function appendChatMessage(htmlContent, isUser = false) {
    if (!aiChatBody) return;
    const msg = document.createElement('div');
    msg.className = isUser ? 'ai-msg ai-msg--user' : 'ai-msg';
    msg.innerHTML = htmlContent;
    aiChatBody.appendChild(msg);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
  }

  function showTypingIndicator() {
    if (!aiChatBody) return null;
    const indicator = document.createElement('div');
    indicator.className = 'ai-typing';
    indicator.innerHTML = `
      <div class="ai-typing-dots"><span></span><span></span><span></span></div>
      <span>Gemini analyse votre demande...</span>
    `;
    aiChatBody.appendChild(indicator);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
    return indicator;
  }

  function getSmartFallbackResponse(userInput) {
    const q = userInput.toLowerCase();
    if (q.includes('service') || q.includes('solution') || q.includes('offre')) {
      return `Chez <strong>SOFTRIDER</strong>, nous structurons notre expertise autour de 4 pôles :<br/>
      • <strong>Soft AI</strong> : Agents IA propulsés par Gemini, RAG &amp; automatisation<br/>
      • <strong>Soft Dev</strong> : Logiciels sur mesure, SaaS, ERP &amp; CRM<br/>
      • <strong>Soft Web</strong> : Sites web futuristes &amp; applications mobiles iOS/Android<br/>
      • <strong>Soft Digital</strong> : Conseil stratégique &amp; transformation digitale.`;
    }
    if (q.includes('devis') || q.includes('tarif') || q.includes('prix') || q.includes('combien') || q.includes('coût')) {
      return `Chaque projet est chiffré sur mesure selon vos objectifs (site web, logiciel métier ou intégration IA). Vous pouvez <a href="#contact" style="color:#00e5ff;text-decoration:underline;">remplir notre formulaire de projet</a> pour recevoir une estimation détaillée sous 24h !`;
    }
    if (q.includes('expert') || q.includes('contact') || q.includes('appel') || q.includes('rdv') || q.includes('humain') || q.includes('téléphone') || q.includes('telephone') || q.includes('mail') || q.includes('email') || q.includes('m2k')) {
      return `Avec plaisir ! <strong>SOFTRIDER</strong> (un produit de <strong>M2K FinTech</strong>) est joignable directement :<br/>
      • <strong>Email</strong> : <a href="mailto:service.commercial@m2k-fintech.fr" style="color:#00e5ff;text-decoration:underline;">service.commercial@m2k-fintech.fr</a><br/>
      • <strong>Téléphone</strong> : <a href="tel:+33699882087" style="color:#00e5ff;text-decoration:underline;">+33 6 99 88 20 87</a><br/>
      Vous pouvez aussi utiliser la section <a href="#contact" style="color:#00e5ff;text-decoration:underline;">Contact</a> en bas de page.`;
    }
    if (q.includes('gemini') || q.includes('ia') || q.includes('intelligence artificielle') || q.includes('agent')) {
      return `Avec notre pôle <strong>Soft AI</strong>, nous intégrons les modèles <strong>Google Gemini</strong>, des pipelines RAG connectés à vos données internes et des agents autonomes capables d'automatiser votre support client et vos workflows métiers.`;
    }
    if (q.includes('méthode') || q.includes('etape') || q.includes('étape') || q.includes('comment')) {
      return `Notre méthode se déroule en 4 étapes claires :<br/>
      1. <strong>Découverte</strong> : Comprendre vos besoins<br/>
      2. <strong>Conception</strong> : Imaginer la meilleure solution<br/>
      3. <strong>Développement</strong> : Construire avec excellence<br/>
      4. <strong>Lancement</strong> : Vous accompagner durablement.`;
    }
    return `Merci pour votre question ! En tant qu'assistant IA <strong>SOFTRIDER (propulsé par Gemini)</strong>, je peux vous guider sur la création de votre <strong>site web, logiciel sur mesure ou intégration IA</strong>. Quel type de projet souhaitez-vous lancer ?`;
  }

  async function callGeminiAPI(userPrompt) {
    conversationHistory.push({
      role: 'user',
      parts: [{ text: userPrompt }],
    });

    const apiKey = (localStorage.getItem(STORAGE_KEY) || '').trim();

    // 1. Try local backend proxy `/api/gemini` first if no client key is set
    if (!apiKey) {
      try {
        const proxyRes = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: SOFTRIDER_SYSTEM_PROMPT,
            contents: conversationHistory,
          }),
        });
        if (proxyRes.ok) {
          const proxyData = await proxyRes.json();
          if (proxyData && proxyData.reply) {
            conversationHistory.push({
              role: 'model',
              parts: [{ text: proxyData.reply }],
            });
            return formatMarkdownToHTML(proxyData.reply);
          }
        }
      } catch (_) {
        // Backend proxy not used or no env key configured; proceed to fallback
      }
    }

    // 2. Direct call to Google Gemini REST API (`gemini-2.5-flash`) if user provided an API key
    if (apiKey) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SOFTRIDER_SYSTEM_PROMPT }],
            },
            contents: conversationHistory,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 360,
            },
          }),
        });

        const data = await response.json();
        const candidateText =
          data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';

        if (response.ok && candidateText) {
          conversationHistory.push({
            role: 'model',
            parts: [{ text: candidateText }],
          });
          return formatMarkdownToHTML(candidateText);
        } else {
          const errMsg = data?.error?.message || 'Clé API invalide ou quota atteint.';
          return `<span style="color:#f87171;">⚠️ API Gemini : ${errMsg}</span><br/><br/>` + getSmartFallbackResponse(userPrompt);
        }
      } catch (err) {
        return getSmartFallbackResponse(userPrompt);
      }
    }

    // 3. Intelligent contextual SOFTRIDER response when no API key is configured yet
    const fallback = getSmartFallbackResponse(userPrompt);
    conversationHistory.push({
      role: 'model',
      parts: [{ text: fallback.replace(/<[^>]+>/g, '') }],
    });
    return fallback;
  }

  async function handleUserPrompt(promptText) {
    if (!promptText.trim()) return;
    appendChatMessage(promptText.replace(/</g, '&lt;').replace(/>/g, '&gt;'), true);

    const typingEl = showTypingIndicator();
    const startTime = Date.now();
    const replyHTML = await callGeminiAPI(promptText);
    const elapsed = Date.now() - startTime;

    // Ensure smooth typing animation minimum duration
    if (elapsed < 420) {
      await new Promise((r) => setTimeout(r, 420 - elapsed));
    }
    if (typingEl && typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
    }

    appendChatMessage(replyHTML, false);
  }

  quickButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (prompt) handleUserPrompt(prompt);
    });
  });

  if (aiChatForm && aiChatInput) {
    aiChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = aiChatInput.value;
      if (!val.trim()) return;
      aiChatInput.value = '';
      handleUserPrompt(val);
    });
  }
});


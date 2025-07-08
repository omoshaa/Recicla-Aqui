document.addEventListener('DOMContentLoaded', () => {
  // Alternar modo claro/escuro
  const toggleBtn = document.getElementById('toggle-theme');
  const body = document.body;

  // Carrega a preferência do usuário do localStorage
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'light-mode') {
    body.classList.add('light-mode');
    toggleBtn.textContent = 'Modo Escuro';
    toggleBtn.setAttribute('aria-pressed', 'true');
  } else {
    toggleBtn.textContent = 'Modo Claro';
    toggleBtn.setAttribute('aria-pressed', 'false');
  }

  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    toggleBtn.textContent = isLight ? 'Modo Escuro' : 'Modo Claro';
    toggleBtn.setAttribute('aria-pressed', isLight);
    // Salva a preferência do usuário
    localStorage.setItem('theme', isLight ? 'light-mode' : 'dark-mode');
  });

  // Compartilhar via Web Share API
  const shareBtn = document.getElementById('share-btn');
  shareBtn.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Recicla Aqui',
          text: 'Conheça o projeto Recicla Aqui para automatizar e gamificar a reciclagem no Brasil!',
          url: window.location.href
        });
      } catch (err) {
        console.error('Erro ou compartilhamento cancelado:', err);
      }
    } else {
      // Fallback para navegadores sem Web Share API
      const dummyInput = document.createElement('textarea');
      document.body.appendChild(dummyInput);
      dummyInput.value = window.location.href;
      dummyInput.select();
      document.execCommand('copy');
      document.body.removeChild(dummyInput);
      alert('Link copiado para a área de transferência! Você pode colar em suas redes sociais.');
    }
  });

  // Envio do formulário com feedback aprimorado
  const form = document.getElementById('form-contato');
  const formStatus = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    formStatus.textContent = 'Enviando sua mensagem...';
    formStatus.style.color = 'orange';

    setTimeout(() => {
      formStatus.textContent = 'Obrigado por entrar em contato! Responderemos em breve.';
      formStatus.style.color = 'var(--cor-primaria)';
      form.reset();
    }, 1500);
  });

  // Opcional: Adicionar "smooth scrolling" para os links da navegação
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      // Inclui a nova seção '#projeto-detalhado' e '#equipe' aqui
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Opcional: Adicionar o efeito "fade in" nas seções ao scrollar
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    threshold: 0.1
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    sectionObserver.observe(section);
  });
});
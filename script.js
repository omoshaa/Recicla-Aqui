document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------
    // 1. Alternar Modo Claro/Escuro
    // -------------------------------
    const toggleBtn = document.getElementById('toggle-theme');
    const body = document.body;

    const icons = {
        moon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
        sun: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
    };

    const setTheme = (theme) => {
        body.classList.toggle('light-mode', theme === 'light-mode');
        toggleBtn.innerHTML = theme === 'light-mode' ? icons.moon : icons.sun;
        toggleBtn.setAttribute('aria-pressed', theme === 'light-mode');
        localStorage.setItem('theme', theme);
    };

    const currentTheme = localStorage.getItem('theme') || 'dark-mode';
    setTheme(currentTheme);

    toggleBtn.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
        setTheme(newTheme);
    });

    // -------------------------------
    // 2. Compartilhamento (Web Share API)
    // -------------------------------
    const shareBtn = document.getElementById('share-btn');

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Link copiado para a área de transferência!');
        }).catch(() => {
            alert('Não foi possível copiar o link.');
        });
    };

    shareBtn?.addEventListener('click', async () => {
        const shareData = {
            title: document.title,
            text: document.querySelector('meta[name="description"]')?.content || '',
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                copyToClipboard(window.location.href);
            }
        } else {
            copyToClipboard(window.location.href);
        }
    });

    // -------------------------------
    // 3. Validação de Formulário
    // -------------------------------
    const form = document.getElementById('form-contato');
    const formStatus = document.getElementById('form-status');

    const fields = [
        { input: document.getElementById('nome'), error: document.getElementById('nome-error'), validator: v => v.trim() !== '', message: 'Por favor, digite seu nome.' },
        { input: document.getElementById('email'), error: document.getElementById('email-error'), validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Por favor, digite um email válido.' },
        { input: document.getElementById('mensagem'), error: document.getElementById('mensagem-error'), validator: v => v.trim() !== '', message: 'Por favor, digite sua mensagem.' }
    ];

    const validateField = ({ input, error, validator, message }) => {
        if (!validator(input.value)) {
            input.classList.add('invalid');
            error.textContent = message;
            return false;
        } else {
            input.classList.remove('invalid');
            error.textContent = '';
            return true;
        }
    };

    fields.forEach(field => field.input.addEventListener('input', () => validateField(field)));

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const allValid = fields.map(validateField).every(Boolean);

        if (allValid) {
            formStatus.textContent = 'Enviando sua mensagem...';
            formStatus.style.color = 'orange';
            formStatus.classList.add('visible');

            setTimeout(() => {
                formStatus.textContent = 'Obrigado por entrar em contato! Responderemos em breve.';
                formStatus.style.color = 'var(--cor-primaria)';
                formStatus.classList.add('success');
                form.reset();

                setTimeout(() => formStatus.classList.remove('success', 'visible'), 5000);
            }, 1500);
        } else {
            formStatus.textContent = 'Por favor, preencha todos os campos obrigatórios corretamente.';
            formStatus.style.color = 'var(--cor-error-text)';
            formStatus.classList.add('visible', 'error');

            setTimeout(() => formStatus.classList.remove('error', 'visible'), 5000);
        }
    });

    // -------------------------------
    // 4. Fade-in das Seções ao Scroll
    // -------------------------------
    const sections = document.querySelectorAll('.content-section');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.1 });

    sections.forEach(sec => observer.observe(sec));

    // -------------------------------
    // 5. Preencher ano atual no rodapé
    // -------------------------------
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

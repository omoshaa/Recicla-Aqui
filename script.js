document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------
    // 1. Funcionalidade de Alternar Modo Claro/Escuro
    // -----------------------------------------------------------
    const toggleBtn = document.getElementById('toggle-theme');
    const body = document.body;
    const moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    const sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

    // Carrega a preferência do usuário do localStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light-mode') {
        body.classList.add('light-mode');
        toggleBtn.innerHTML = moonIcon; // Ícone de lua para mudar para escuro
        toggleBtn.setAttribute('aria-pressed', 'true');
    } else {
        toggleBtn.innerHTML = sunIcon; // Ícone de sol para mudar para claro
        toggleBtn.setAttribute('aria-pressed', 'false');
    }

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        toggleBtn.innerHTML = isLight ? moonIcon : sunIcon;
        toggleBtn.setAttribute('aria-pressed', isLight);
        localStorage.setItem('theme', isLight ? 'light-mode' : 'dark-mode');
    });

    // -----------------------------------------------------------
    // 2. Funcionalidade de Compartilhamento via Web Share API
    // -----------------------------------------------------------
    const shareBtn = document.getElementById('share-btn');
    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: document.querySelector('meta[name="description"]').content,
                    url: window.location.href
                });
                // console.log('Compartilhado com sucesso!');
            } catch (err) {
                // console.error('Erro ou compartilhamento cancelado:', err);
                // Usuário cancelou ou houve um erro no compartilhamento nativo
                fallbackCopyLink();
            }
        } else {
            fallbackCopyLink();
        }
    });

    function fallbackCopyLink() {
        const dummyInput = document.createElement('textarea');
        document.body.appendChild(dummyInput);
        dummyInput.value = window.location.href;
        dummyInput.select();
        document.execCommand('copy');
        document.body.removeChild(dummyInput);
        alert('Link copiado para a área de transferência! Você pode colar em suas redes sociais.');
    }

    // -----------------------------------------------------------
    // 3. Validação de Formulário com Feedback em Tempo Real
    // -----------------------------------------------------------
    const form = document.getElementById('form-contato');
    const formStatus = document.getElementById('form-status');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const mensagemInput = document.getElementById('mensagem');

    const nameError = document.getElementById('nome-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('mensagem-error');

    function validateField(inputElement, errorElement, validationFn, errorMessage) {
        if (!validationFn(inputElement.value.trim())) {
            inputElement.classList.add('invalid');
            errorElement.textContent = errorMessage;
            return false;
        } else {
            inputElement.classList.remove('invalid');
            errorElement.textContent = '';
            return true;
        }
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function isNotEmpty(value) {
        return value.length > 0;
    }

    nomeInput.addEventListener('input', () => validateField(nomeInput, nameError, isNotEmpty, 'Por favor, digite seu nome.'));
    emailInput.addEventListener('input', () => validateField(emailInput, emailError, isValidEmail, 'Por favor, digite um email válido.'));
    mensagemInput.addEventListener('input', () => validateField(mensagemInput, messageError, isNotEmpty, 'Por favor, digite sua mensagem.'));

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário

        // Valida todos os campos antes de enviar
        const isNameValid = validateField(nomeInput, nameError, isNotEmpty, 'Por favor, digite seu nome.');
        const isEmailValid = validateField(emailInput, emailError, isValidEmail, 'Por favor, digite um email válido.');
        const isMessageValid = validateField(mensagemInput, messageError, isNotEmpty, 'Por favor, digite sua mensagem.');

        if (isNameValid && isEmailValid && isMessageValid) {
            formStatus.textContent = 'Enviando sua mensagem...';
            formStatus.style.color = 'orange'; // Cor temporária de "enviando"
            formStatus.classList.add('visible');

            // Simula o envio do formulário (você substituiria isso por uma chamada AJAX real)
            setTimeout(() => {
                formStatus.textContent = 'Obrigado por entrar em contato! Responderemos em breve.';
                formStatus.style.color = 'var(--cor-primaria)'; // Usa a cor primária do CSS
                formStatus.classList.remove('visible'); // Remove a classe 'visible'
                formStatus.classList.add('success'); // Adiciona classe de sucesso para CSS
                form.reset(); // Limpa o formulário

                // Remove a mensagem de status após alguns segundos
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.classList.remove('success');
                }, 5000);
            }, 1500);
        } else {
            formStatus.textContent = 'Por favor, preencha todos os campos obrigatórios corretamente.';
            formStatus.style.color = 'var(--cor-error-text-escuro)'; // Cor de erro
            formStatus.classList.add('visible', 'error');

            // Remove a mensagem de status após alguns segundos
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.classList.remove('visible', 'error');
            }, 5000);
        }
    });

    // -----------------------------------------------------------
    // 4. Efeito "Fade In" nas Seções ao Scrollar
    // -----------------------------------------------------------
    const sections = document.querySelectorAll('.content-section');
    const observerOptions = {
        root: null, // viewport como root
        threshold: 0.1 // 10% da seção visível para acionar
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Para de observar depois de visível
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // -----------------------------------------------------------
    // 5. Preencher o ano atual no rodapé
    // -----------------------------------------------------------
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

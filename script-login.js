document.addEventListener('DOMContentLoaded', function () {
    const $ = id => document.getElementById(id);

    // Estado do sistema
    const state = {
        usuarios: JSON.parse(localStorage.getItem('usuarios')) || [],
        empresas: JSON.parse(localStorage.getItem('empresas')) || [],
        inatividadeDias: 30 // Dias para considerar cadastro inativo
    };

    // Mostrar/ocultar senha
    const togglePassword = $('togglePassword');
    const passwordInput = $('password');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            this.textContent = isPassword ? 'Ocultar' : 'Mostrar';
        });
    }

    // Validação do formulário de login
    const loginForm = $('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailEl = $('email');
            const pwdEl = $('password');
            const email = emailEl ? emailEl.value.trim() : '';
            const password = pwdEl ? pwdEl.value : '';

            if (!email || !password) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }

            // Verificar se é usuário PF
            let usuario = state.usuarios.find(u => u.email === email && u.senha === password);
            let tipo = 'pf';

            // Se não for PF, verificar se é PJ
            if (!usuario) {
                usuario = state.empresas.find(e => e.email === email && e.senha === password);
                tipo = 'pj';
            }

            if (usuario) {
                // Atualizar último acesso
                usuario.ultimoAcesso = new Date().toISOString();
                
                if (tipo === 'pf') {
                    // Atualizar no array de usuários
                    const index = state.usuarios.findIndex(u => u.id === usuario.id);
                    if (index !== -1) {
                        state.usuarios[index] = usuario;
                        localStorage.setItem('usuarios', JSON.stringify(state.usuarios));
                    }
                } else {
                    // Atualizar no array de empresas
                    const index = state.empresas.findIndex(e => e.id === usuario.id);
                    if (index !== -1) {
                        state.empresas[index] = usuario;
                        localStorage.setItem('empresas', JSON.stringify(state.empresas));
                    }
                }

                // Verificar inatividade
                const ultimoAcesso = new Date(usuario.ultimoAcesso);
                const hoje = new Date();
                const diferencaDias = Math.floor((hoje - ultimoAcesso) / (1000 * 60 * 60 * 24));
                
                if (diferencaDias > state.inatividadeDias) {
                    // Armazenar dados para atualização
                    sessionStorage.setItem('usuarioParaAtualizar', JSON.stringify({
                        id: usuario.id,
                        tipo: tipo,
                        dados: usuario
                    }));
                    
                    // Redirecionar para página de cadastro com aba de atualização
                    window.location.href = 'cadastro.html?atualizacao=true';
                } else {
                    alert(`Login realizado com sucesso!\nBem-vindo, ${usuario.nome || usuario.razaoSocial}`);
                    // Aqui você pode redirecionar para o dashboard
                    // window.location.href = 'dashboard.html';
                }
            } else {
                alert('E-mail ou senha incorretos.');
            }
        });
    }

    // Recuperação de senha
    const forgotPasswordLink = $('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            const emailEl = $('email');
            const provided = (emailEl && emailEl.value) ? emailEl.value.trim() : prompt('Digite seu e-mail para recuperar a senha:');
            if (!provided) return;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(provided)) {
                alert(`Um link para redefinição de senha foi enviado para: ${provided}\n\n(Simulação)`);
            } else {
                alert('Por favor, insira um e-mail válido.');
            }
        });
    }

    // Focar no campo de email ao carregar
    const emailField = $('email');
    if (emailField) {
        emailField.focus();
    }
});

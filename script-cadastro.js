document.addEventListener('DOMContentLoaded', function () {
    const $ = id => document.getElementById(id);
    const urlParams = new URLSearchParams(window.location.search);
    const isAtualizacao = urlParams.get('atualizacao') === 'true';

    // Estado do sistema
    const state = {
        usuarios: JSON.parse(localStorage.getItem('usuarios')) || [],
        empresas: JSON.parse(localStorage.getItem('empresas')) || [],
        inatividadeDias: 30
    };

    // Funções globais usadas pelo HTML
    window.showForm = function (form) {
        const cadastroPFContainer = $('cadastroPFContainer');
        const cadastroPJContainer = $('cadastroPJContainer');
        const atualizacaoContainer = $('atualizacaoContainer');
        const tabCadastroPF = $('tabCadastroPF');
        const tabCadastroPJ = $('tabCadastroPJ');
        const tabAtualizacao = $('tabAtualizacao');

        // Esconder todos
        [cadastroPFContainer, cadastroPJContainer, atualizacaoContainer].forEach(el => {
            if (el) el.style.display = 'none';
        });

        // Remover classe active das tabs
        [tabCadastroPF, tabCadastroPJ, tabAtualizacao].forEach(t => {
            if (t && t.classList) t.classList.remove('active');
        });

        // Mostrar o selecionado e marcar a tab
        if (form === 'pf') {
            if (cadastroPFContainer) {
                cadastroPFContainer.style.display = 'block';
                cadastroPFContainer.classList.add('active');
            }
            if (tabCadastroPF) tabCadastroPF.classList.add('active');
        } else if (form === 'pj') {
            if (cadastroPJContainer) {
                cadastroPJContainer.style.display = 'block';
                cadastroPJContainer.classList.add('active');
            }
            if (tabCadastroPJ) tabCadastroPJ.classList.add('active');
        } else if (form === 'atualizacao') {
            if (atualizacaoContainer) {
                atualizacaoContainer.style.display = 'block';
                atualizacaoContainer.classList.add('active');
                // Carregar dados quando mostrar a aba de atualização
                carregarDadosAtualizacao();
            }
            if (tabAtualizacao) tabAtualizacao.classList.add('active');
        }
    };

    window.limparFormularioPF = function () {
        const form = $('cadastroPessoaFisicaForm');
        if (form) form.reset();
        
        // Resetar campos de estado e cidade
        const ufSelect = $('uf');
        const cidadeSelect = $('cidade');
        if (ufSelect) ufSelect.value = '';
        if (cidadeSelect) {
            cidadeSelect.innerHTML = '<option value="">Primeiro selecione o estado</option>';
            cidadeSelect.disabled = false;
        }
    };

    window.limparFormularioPJ = function () {
        const form = $('cadastroPessoaJuridicaForm');
        if (form) form.reset();
        
        // Resetar campos de estado e cidade
        const ufSelect = $('ufPJ');
        const cidadeSelect = $('cidadePJ');
        if (ufSelect) ufSelect.value = '';
        if (cidadeSelect) {
            cidadeSelect.innerHTML = '<option value="">Primeiro selecione o estado</option>';
            cidadeSelect.disabled = false;
        }
    };

    window.limparAtualizacaoForm = function () {
        const form = $('atualizacaoForm');
        if (form) form.reset();
    };

    // Verificar se é para mostrar atualização
    if (isAtualizacao) {
        // Mostrar a aba de atualização e esconder as outras
        const tabAtualizacao = $('tabAtualizacao');
        if (tabAtualizacao) {
            tabAtualizacao.style.display = 'block';
        }
        showForm('atualizacao');
    }

    // Carregar dados para atualização
    function carregarDadosAtualizacao() {
        const usuarioData = JSON.parse(sessionStorage.getItem('usuarioParaAtualizar'));
        if (!usuarioData) {
            alert('Nenhum usuário encontrado para atualização.');
            window.location.href = 'index.html';
            return;
        }

        const usuario = usuarioData.dados || usuarioData;
        const statusInfo = $('statusInfo');
        
        if (statusInfo && usuario.ultimoAcesso) {
            const ultimoAcesso = new Date(usuario.ultimoAcesso);
            const hoje = new Date();
            const diferencaDias = Math.floor((hoje - ultimoAcesso) / (1000 * 60 * 60 * 24));
            
            statusInfo.innerHTML = `
                <h4>Seu cadastro precisa de atenção</h4>
                <p>• Último acesso: ${formatarData(ultimoAcesso)}</p>
                <p>• ${diferencaDias} dias sem atualização</p>
                <p>• Por favor, atualize suas informações para manter seu cadastro ativo</p>
            `;
        }

        // Preencher campos do formulário
        const campos = [
            { id: 'atualizarNome', value: usuario.nome || usuario.razaoSocial || '' },
            { id: 'atualizarCPF', value: usuario.cpf || usuario.responsavel?.cpf || '' },
            { id: 'atualizarDataNascimento', value: usuario.dataNascimento || '' },
            { id: 'atualizarEmail', value: usuario.email || '' },
            { id: 'atualizarWhatsApp', value: usuario.whatsapp || usuario.telefone || '' }
        ];
        
        campos.forEach(campo => {
            const element = $(campo.id);
            if (element) {
                element.value = campo.value || '';
            }
        });
    }

    // Popula UF e cidades para PF
    const ufSelect = $('uf');
    const cidadeSelect = $('cidade');

    // Popula UF e cidades para PJ
    const ufSelectPJ = $('ufPJ');
    const cidadeSelectPJ = $('cidadePJ');

    const ufs = [
        { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
        { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
        { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, { sigla: 'GO', nome: 'Goiás' },
        { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
        { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' },
        { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
        { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' }, { sigla: 'RS', nome: 'Rio Grande do Sul' },
        { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
        { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' }, { sigla: 'TO', nome: 'Tocantins' }
    ];

    // Função para popular select de UF
    function popularUfSelect(selectElement) {
        if (!selectElement) return;
        
        selectElement.innerHTML = '<option value="">Selecione o estado</option>';
        ufs.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.sigla;
            opt.textContent = `${u.sigla} - ${u.nome}`;
            selectElement.appendChild(opt);
        });
    }

    // Popular selects de UF
    popularUfSelect(ufSelect);
    popularUfSelect(ufSelectPJ);

    const cidadesPorUf = {
        'AC': ['Rio Branco', 'Cruzeiro do Sul', 'Mâncio Lima'],
        'AL': ['Maceió', 'Rio Largo', 'Arapiraca'],
        'AP': ['Macapá', 'Santana', 'Laranjal do Jari'],
        'AM': ['Manaus', 'Itacoatiara', 'Parintins'],
        'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Ilhéus', 'Jequié'],
        'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral'],
        'DF': ['Brasília', 'Taguatinga', 'Ceilândia'],
        'ES': ['Vitória', 'Vila Velha', 'Cariacica', 'Serra'],
        'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde'],
        'MA': ['São Luís', 'Imperatriz', 'Caxias'],
        'MT': ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop'],
        'MS': ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá'],
        'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
        'PA': ['Belém', 'Ananindeua', 'Santarém', 'Marabá'],
        'PB': ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos'],
        'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
        'PE': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina'],
        'PI': ['Teresina', 'Parnaíba', 'Picos', 'Floriano'],
        'RJ': ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'São Gonçalo', 'Petrópolis'],
        'RN': ['Natal', 'Mossoró', 'Parnamirim', 'Assu'],
        'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'],
        'RO': ['Porto Velho', 'Vilhena', 'Ariquemes', 'Ji-Paraná'],
        'RR': ['Boa Vista', 'Rorainópolis', 'Caracaraí'],
        'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'Brusque', 'Chapecó'],
        'SP': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'Sorocaba'],
        'SE': ['Aracaju', 'São Cristóvão', 'Lagarto'],
        'TO': ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional']
    };

    // Função para lidar com mudança de UF
    function configurarUfChange(ufSelectElement, cidadeSelectElement) {
        if (!ufSelectElement || !cidadeSelectElement) return;
        
        ufSelectElement.addEventListener('change', function (e) {
            const sigla = e.target.value;
            cidadeSelectElement.innerHTML = '';
            
            if (sigla && cidadesPorUf[sigla] && cidadesPorUf[sigla].length > 0) {
                cidadeSelectElement.appendChild(new Option('Selecione a cidade', ''));
                cidadesPorUf[sigla].forEach(c => {
                    cidadeSelectElement.appendChild(new Option(c, c));
                });
                cidadeSelectElement.disabled = false;
            } else {
                cidadeSelectElement.appendChild(new Option('Primeiro selecione o estado', ''));
                cidadeSelectElement.disabled = false;
            }
        });
    }

    // Configurar eventos para PF e PJ
    configurarUfChange(ufSelect, cidadeSelect);
    configurarUfChange(ufSelectPJ, cidadeSelectPJ);

    // Formulário de Cadastro Pessoa Física
    const cadastroPessoaFisicaForm = $('cadastroPessoaFisicaForm');
    if (cadastroPessoaFisicaForm) {
        cadastroPessoaFisicaForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Validar campos obrigatórios
            if (!$('uf').value || !$('cidade').value) {
                alert('Por favor, selecione o estado e a cidade.');
                return;
            }

            // Coletar dados do formulário
            const usuario = {
                id: Date.now(),
                tipo: 'pf',
                nome: $('nome').value,
                cpf: $('cpf').value,
                rg: $('rg').value,
                dataNascimento: $('dataNascimento').value,
                genero: $('genero').value,
                email: $('emailPF').value,
                whatsapp: $('whatsapp').value,
                telefone: $('telefone').value,
                uf: $('uf').value,
                cidade: $('cidade').value,
                bairro: $('bairro').value,
                logradouro: $('logradouro').value,
                numero: $('numero').value,
                complemento: $('complemento').value,
                senha: gerarSenhaTemporaria(),
                dataCadastro: new Date().toISOString(),
                ultimoAcesso: new Date().toISOString(),
                status: 'ativo'
            };

            // Validar CPF
            if (!validarCPF(usuario.cpf)) {
                alert('CPF inválido.');
                return;
            }

            // Verificar se CPF já existe
            if (state.usuarios.some(u => u.cpf === usuario.cpf)) {
                alert('CPF já cadastrado.');
                return;
            }

            // Verificar se email já existe
            if (state.usuarios.some(u => u.email === usuario.email) || 
                state.empresas.some(e => e.email === usuario.email)) {
                alert('E-mail já cadastrado.');
                return;
            }

            // Adicionar usuário
            state.usuarios.push(usuario);
            localStorage.setItem('usuarios', JSON.stringify(state.usuarios));
            
            alert(`Cadastro realizado com sucesso!\n\nSua senha temporária é: ${usuario.senha}\n\nPor favor, anote esta senha e faça login para atualizá-la.`);
            
            // Redirecionar para login após 2 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }

    // Formulário de Cadastro Pessoa Jurídica
    const cadastroPessoaJuridicaForm = $('cadastroPessoaJuridicaForm');
    if (cadastroPessoaJuridicaForm) {
        cadastroPessoaJuridicaForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Validar campos obrigatórios
            if (!$('ufPJ').value || !$('cidadePJ').value) {
                alert('Por favor, selecione o estado e a cidade.');
                return;
            }

            // Coletar dados do formulário
            const empresa = {
                id: Date.now(),
                tipo: 'pj',
                razaoSocial: $('razaoSocial').value,
                nomeFantasia: $('nomeFantasia').value,
                cnpj: $('cnpj').value,
                inscricaoEstadual: $('inscricaoEstadual').value,
                ramoAtividade: $('ramoAtividade').value,
                anoFundacao: $('anoFundacao').value,
                email: $('emailPJ').value,
                telefone: $('telefonePJ').value,
                whatsapp: $('whatsappPJ').value,
                site: $('site').value,
                uf: $('ufPJ').value,
                cidade: $('cidadePJ').value,
                bairro: $('bairroPJ').value,
                logradouro: $('logradouroPJ').value,
                numero: $('numeroPJ').value,
                complemento: $('complementoPJ').value,
                responsavel: {
                    nome: $('responsavelNome').value,
                    cpf: $('responsavelCPF').value,
                    cargo: $('responsavelCargo').value,
                    email: $('responsavelEmail').value
                },
                senha: gerarSenhaTemporaria(),
                dataCadastro: new Date().toISOString(),
                ultimoAcesso: new Date().toISOString(),
                status: 'ativo'
            };

            // Validar CNPJ
            if (!validarCNPJ(empresa.cnpj)) {
                alert('CNPJ inválido.');
                return;
            }

            // Validar CPF do responsável
            if (!validarCPF(empresa.responsavel.cpf)) {
                alert('CPF do responsável inválido.');
                return;
            }

            // Verificar se CNPJ já existe
            if (state.empresas.some(e => e.cnpj === empresa.cnpj)) {
                alert('CNPJ já cadastrado.');
                return;
            }

            // Verificar se email já existe
            if (state.empresas.some(e => e.email === empresa.email) || 
                state.usuarios.some(u => u.email === empresa.email)) {
                alert('E-mail já cadastrado.');
                return;
            }

            // Adicionar empresa
            state.empresas.push(empresa);
            localStorage.setItem('empresas', JSON.stringify(state.empresas));
            
            alert(`Cadastro da empresa realizado com sucesso!\n\nSua senha temporária é: ${empresa.senha}\n\nPor favor, anote esta senha e faça login para atualizá-la.`);
            
            // Redirecionar para login após 2 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }

    // Formulário de Atualização de Cadastro
    const atualizacaoForm = $('atualizacaoForm');
    if (atualizacaoForm) {
        atualizacaoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const usuarioData = JSON.parse(sessionStorage.getItem('usuarioParaAtualizar'));
            if (!usuarioData) {
                alert('Nenhum usuário encontrado para atualização.');
                return;
            }

            const usuarioId = usuarioData.id;
            const tipo = usuarioData.tipo;

            if (tipo === 'pf') {
                const index = state.usuarios.findIndex(u => u.id === usuarioId);
                if (index !== -1) {
                    state.usuarios[index] = {
                        ...state.usuarios[index],
                        nome: $('atualizarNome').value,
                        cpf: $('atualizarCPF').value,
                        dataNascimento: $('atualizarDataNascimento').value,
                        email: $('atualizarEmail').value,
                        whatsapp: $('atualizarWhatsApp').value,
                        ultimoAcesso: new Date().toISOString(),
                        status: 'ativo'
                    };
                    
                    localStorage.setItem('usuarios', JSON.stringify(state.usuarios));
                    sessionStorage.removeItem('usuarioParaAtualizar');
                    
                    alert('Cadastro atualizado com sucesso!');
                    window.location.href = 'index.html';
                }
            } else {
                const index = state.empresas.findIndex(e => e.id === usuarioId);
                if (index !== -1) {
                    state.empresas[index] = {
                        ...state.empresas[index],
                        razaoSocial: $('atualizarNome').value,
                        responsavel: {
                            ...state.empresas[index].responsavel,
                            cpf: $('atualizarCPF').value
                        },
                        email: $('atualizarEmail').value,
                        telefone: $('atualizarWhatsApp').value,
                        ultimoAcesso: new Date().toISOString(),
                        status: 'ativo'
                    };
                    
                    localStorage.setItem('empresas', JSON.stringify(state.empresas));
                    sessionStorage.removeItem('usuarioParaAtualizar');
                    
                    alert('Cadastro atualizado com sucesso!');
                    window.location.href = 'index.html';
                }
            }
        });
    }

    // Funções auxiliares
    function gerarSenhaTemporaria() {
        return Math.random().toString(36).slice(-8);
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        if (cpf.length !== 11) return false;
        return true;
    }

    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, '');
        if (cnpj.length !== 14) return false;
        return true;
    }

    function formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    // Máscaras para os campos
    function aplicarMascaraCPF(input) {
        if (!input) return;
        
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            
            e.target.value = value;
        });
    }

    function aplicarMascaraCNPJ(input) {
        if (!input) return;
        
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 14) value = value.substring(0, 14);
            
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
            
            e.target.value = value;
        });
    }

    function aplicarMascaraTelefone(input) {
        if (!input) return;
        
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }

    // Aplicar máscaras para PF
    aplicarMascaraCPF($('cpf'));
    aplicarMascaraTelefone($('whatsapp'));
    aplicarMascaraTelefone($('telefone'));

    // Aplicar máscaras para PJ
    aplicarMascaraCNPJ($('cnpj'));
    aplicarMascaraCPF($('responsavelCPF'));
    aplicarMascaraTelefone($('telefonePJ'));
    aplicarMascaraTelefone($('whatsappPJ'));

    // Aplicar máscaras para atualização
    aplicarMascaraCPF($('atualizarCPF'));
    aplicarMascaraTelefone($('atualizarWhatsApp'));

    // Adicionar listeners das tabs
    const tabPF = $('tabCadastroPF');
    const tabPJ = $('tabCadastroPJ');
    const tabAtual = $('tabAtualizacao');

    if (tabPF) tabPF.addEventListener('click', () => window.showForm('pf'));
    if (tabPJ) tabPJ.addEventListener('click', () => window.showForm('pj'));
    if (tabAtual) tabAtual.addEventListener('click', () => window.showForm('atualizacao'));

    console.log('Página de Cadastro carregada');
    console.log(`Usuários PF: ${state.usuarios.length}`);
    console.log(`Empresas PJ: ${state.empresas.length}`);
});

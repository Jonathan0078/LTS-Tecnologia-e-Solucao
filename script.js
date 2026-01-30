// ==================== MENU MOBILE ==================== 
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    // Toggle menu mobile
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Fechar menu ao clicar fora dele
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });

    // ==================== VALIDAÇÃO E ENVIO DO FORMULÁRIO ====================
    const form = document.getElementById('formOrcamento');
    const formSuccess = document.getElementById('formSuccess');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Limpar mensagens de erro anteriores
        limparErros();

        // Validar campos
        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const servico = document.getElementById('servico').value;
        const mensagem = document.getElementById('mensagem').value.trim();

        let isValido = true;

        // Validar Nome
        if (nome.length < 3) {
            mostrarErro('nome', 'Nome deve ter pelo menos 3 caracteres');
            isValido = false;
        }

        // Validar Telefone
        if (!validarTelefone(telefone)) {
            mostrarErro('telefone', 'Telefone inválido. Use o formato (XX) XXXXX-XXXX');
            isValido = false;
        }

        // Validar Serviço
        if (!servico) {
            mostrarErro('servico', 'Selecione um tipo de serviço');
            isValido = false;
        }

        // Validar Mensagem
        if (mensagem.length < 10) {
            mostrarErro('mensagem', 'Mensagem deve ter pelo menos 10 caracteres');
            isValido = false;
        }

        if (isValido) {
            // Preparar dados para WhatsApp
            enviarViaWhatsApp(nome, telefone, servico, mensagem);
            
            // Mostrar mensagem de sucesso
            formSuccess.textContent = '✓ Sua solicitação foi enviada com sucesso! Você será redirecionado para o WhatsApp.';
            formSuccess.classList.add('show');

            // Resetar formulário
            setTimeout(() => {
                form.reset();
                formSuccess.classList.remove('show');
            }, 3000);
        }
    });

    // Função para validar telefone
    function validarTelefone(telefone) {
        // Remove caracteres não numéricos
        const numeros = telefone.replace(/\D/g, '');
        // Validar se tem pelo menos 10 dígitos (DDD + número)
        return numeros.length >= 10;
    }

    // Função para mostrar erro
    function mostrarErro(fieldId, mensagem) {
        const campo = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        campo.classList.add('error');
        errorElement.textContent = mensagem;
        errorElement.classList.add('show');
    }

    // Função para limpar erros
    function limparErros() {
        const campos = ['nome', 'telefone', 'servico', 'mensagem'];
        campos.forEach(fieldId => {
            const campo = document.getElementById(fieldId);
            const errorElement = document.getElementById(fieldId + 'Error');
            
            campo.classList.remove('error');
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        });
    }

    // Função para enviar via WhatsApp
    function enviarViaWhatsApp(nome, telefone, servico, mensagem) {
        // Mapear IDs de serviço para nomes legíveis
        const servicosMap = {
            'portao-basculante': 'Portão Basculante',
            'portao-deslizante': 'Portão Deslizante',
            'porta-metalica': 'Porta Metálica',
            'janela-metalica': 'Janela Metálica',
            'motor-ppa': 'Motor Eletrônico PPA',
            'instalacao': 'Instalação e Manutenção',
            'outro': 'Outro'
        };

        const nomeServico = servicosMap[servico] || servico;

        // Montar mensagem para WhatsApp
        const mensagemWhatsApp = `Olá! Gostaria de solicitar um orçamento.

*Nome:* ${nome}
*Telefone:* ${telefone}
*Serviço:* ${nomeServico}
*Mensagem:* ${mensagem}`;

        // Codificar mensagem para URL
        const mensagemCodificada = encodeURIComponent(mensagemWhatsApp);

        // Número WhatsApp (sem máscara)
        const numeroWhatsApp = '5554981295175';

        // Construir URL do WhatsApp
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

        // Abrir WhatsApp após 1 segundo
        setTimeout(() => {
            window.open(urlWhatsApp, '_blank');
        }, 500);
    }

    // ==================== VALIDAÇÃO EM TEMPO REAL ====================
    const camposFormulario = ['nome', 'telefone', 'servico', 'mensagem'];

    camposFormulario.forEach(fieldId => {
        const campo = document.getElementById(fieldId);
        
        campo.addEventListener('blur', function() {
            validarCampo(fieldId);
        });

        campo.addEventListener('input', function() {
            if (campo.classList.contains('error')) {
                validarCampo(fieldId);
            }
        });
    });

    // Função para validar campo individual
    function validarCampo(fieldId) {
        const campo = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        let isValido = true;
        let mensagem = '';

        switch(fieldId) {
            case 'nome':
                if (campo.value.trim().length < 3) {
                    isValido = false;
                    mensagem = 'Nome deve ter pelo menos 3 caracteres';
                }
                break;
            case 'telefone':
                if (!validarTelefone(campo.value.trim())) {
                    isValido = false;
                    mensagem = 'Telefone inválido';
                }
                break;
            case 'servico':
                if (!campo.value) {
                    isValido = false;
                    mensagem = 'Selecione um serviço';
                }
                break;
            case 'mensagem':
                if (campo.value.trim().length < 10) {
                    isValido = false;
                    mensagem = 'Mensagem muito curta';
                }
                break;
        }

        if (isValido) {
            campo.classList.remove('error');
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        } else {
            campo.classList.add('error');
            errorElement.textContent = mensagem;
            errorElement.classList.add('show');
        }

        return isValido;
    }

    // ==================== SCROLL SUAVE EM LINKS DE ÂNCORA ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Verificar se é uma âncora válida (não é "#" apenas)
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==================== ANIMAÇÃO DE ENTRADA (Intersection Observer) ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animação a elementos
    const cardsProdutos = document.querySelectorAll('.card-produto');
    const tiposMotor = document.querySelectorAll('.tipo-motor');
    const beneficios = document.querySelectorAll('.beneficios-lista li');

    cardsProdutos.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    tiposMotor.forEach(tipo => {
        tipo.style.opacity = '0';
        tipo.style.transform = 'translateY(20px)';
        tipo.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(tipo);
    });

    beneficios.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // ==================== RASTREAMENTO DE EVENTOS ====================
    // Rastrear cliques no botão WhatsApp flutuante
    const whatsappFloat = document.querySelector('.whatsapp-float');
    whatsappFloat.addEventListener('click', function(e) {
        console.log('Clique no botão WhatsApp flutuante');
    });

    // Rastrear cliques em botões de conversão
    const btnsPrimary = document.querySelectorAll('.btn-primary');
    btnsPrimary.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Clique em botão de conversão: ' + this.textContent.trim());
        });
    });

    // ==================== MELHORIAS DE UX ====================
    // Adicionar feedback visual em cliques de botão
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transition = 'none';
                this.style.transform = '';
                setTimeout(() => {
                    this.style.transition = '';
                }, 10);
            }, 100);
        });
    });
});

// ==================== FUNÇÃO PARA COPIAR TELEFONE ====================
function copiarTelefone() {
    const telefone = '(54) 98129-5175';
    navigator.clipboard.writeText(telefone).then(() => {
        alert('Telefone copiado para a área de transferência!');
    }).catch(() => {
        alert('Erro ao copiar telefone');
    });
}

// ==================== FUNÇÃO PARA FORMATAR TELEFONE EM TEMPO REAL ====================
document.addEventListener('DOMContentLoaded', function() {
    const telefonInput = document.getElementById('telefone');
    
    if (telefonInput) {
        telefonInput.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            
            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }
            
            // Formatar: (XX) XXXXX-XXXX
            if (valor.length >= 10) {
                valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7, 11)}`;
            } else if (valor.length >= 6) {
                valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
            } else if (valor.length >= 2) {
                valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
            } else if (valor.length > 0) {
                valor = `(${valor}`;
            }
            
            e.target.value = valor;
        });
    }
});

// ==================== DETECÇÃO DE DISPOSITIVO ====================
function ehDispositivoMovel() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ==================== LOG DE INICIALIZAÇÃO ====================
console.log('%cSerralheria - Site Iniciado', 'color: #ff6b35; font-size: 16px; font-weight: bold;');
console.log('%cTodos os sistemas funcionando normalmente', 'color: #27ae60; font-size: 12px;');
if (ehDispositivoMovel()) {
    console.log('%cDispositivo móvel detectado', 'color: #004e89; font-size: 12px;');
}

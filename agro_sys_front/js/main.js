/**
 * Módulo principal do sistema
 * Gerencia navegação, menus e funcionalidades do dashboard
 */

// 5. Feedback visual nas ações
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white; padding: 12px 20px; border-radius: 4px; z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 31. Utils para formatação
const FormatUtils = {
    currency: (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    },
    date: (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    },
    capitalize: (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
};
// Dados mockados para demonstração
const mockData = {
    produtores: [
        { id: 1, nome: 'João Silva', propriedade: 'Fazenda Verde', certificacoes: 'Orgânico', contato: '(11) 99999-9999' },
        { id: 2, nome: 'Maria Santos', propriedade: 'Sítio Esperança', certificacoes: 'BPA, Orgânico', contato: '(11) 88888-8888' },
        { id: 3, nome: 'Pedro Oliveira', propriedade: 'Chácara São José', certificacoes: 'BPA', contato: '(11) 77777-7777' }
    ],
    produtos: [
        { id: 1, nome: 'Alface Crespa', categoria: 'Folhas', produtor: 'João Silva', preco: 'R$ 3,50', estoque: '120' },
        { id: 2, nome: 'Tomate Italiano', categoria: 'Frutas', produtor: 'Maria Santos', preco: 'R$ 8,90', estoque: '85' },
        { id: 3, nome: 'Cenoura', categoria: 'Raízes', produtor: 'Pedro Oliveira', preco: 'R$ 4,20', estoque: '150' },
        { id: 4, nome: 'Couve', categoria: 'Folhas', produtor: 'João Silva', preco: 'R$ 2,80', estoque: '90' }
    ],
    clientes: [
        { id: 1, nome: 'Restaurante Sabor Natural', email: 'contato@sabornatural.com', telefone: '(11) 3333-3333', endereco: 'Rua das Flores, 123' },
        { id: 2, nome: 'Mercado Orgânico', email: 'vendas@mercadoorganico.com', telefone: '(11) 4444-4444', endereco: 'Av. Principal, 456' },
        { id: 3, nome: 'Hortifruti Vida Saudável', email: 'pedidos@vidasaudavel.com', telefone: '(11) 5555-5555', endereco: 'Praça Central, 789' }
    ],
    pedidos: [
        { id: 1, cliente: 'Restaurante Sabor Natural', data: '15/10/2023', valor: 'R$ 245,00', status: 'Entregue' },
        { id: 2, cliente: 'Mercado Orgânico', data: '18/10/2023', valor: 'R$ 320,50', status: 'Processando' },
        { id: 3, cliente: 'Hortifruti Vida Saudável', data: '20/10/2023', valor: 'R$ 180,75', status: 'Pendente' }
    ],
    pagamentos: [
        { id: 1, pedido: '001', cliente: 'Restaurante Sabor Natural', valor: 'R$ 245,00', vencimento: '10/10/2023', status: 'Pago' },
        { id: 2, pedido: '002', cliente: 'Mercado Orgânico', valor: 'R$ 320,50', vencimento: '15/10/2023', status: 'Pendente' },
        { id: 3, pedido: '003', cliente: 'Hortifruti Vida Saudável', valor: 'R$ 180,75', vencimento: '20/10/2023', status: 'Pendente' }
    ]
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Só inicializar se estivermos no dashboard
    if (!window.location.pathname.endsWith('dashboard.html')) {
        return;
    }
    
    initNavigation();
    initDashboard();
    initProdutores();
    initProdutos();
    initClientes();
    initPedidos();
    initPagamentos();
    initRelatorios();
});

/**
 * Inicializa a navegação entre seções
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');
    const toggleSidebar = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    
    // Configurar eventos de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Obter a seção alvo
            const targetSection = this.getAttribute('data-section');
            
            // Esconder todas as seções
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar a seção alvo
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                
                // Atualizar título da página
                pageTitle.textContent = this.textContent;
            }
            
            // Fechar sidebar em dispositivos móveis
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Configurar toggle do sidebar
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Fechar sidebar ao clicar fora (em dispositivos móveis)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            e.target !== toggleSidebar) {
            sidebar.classList.remove('active');
        }
    });
}

/**
 * Inicializa o dashboard com dados e funcionalidades
 */
function initDashboard() {
    // Atualizar contadores
    document.getElementById('produtoresCount').textContent = mockData.produtores.length;
    document.getElementById('produtosCount').textContent = mockData.produtos.length;
    document.getElementById('clientesCount').textContent = mockData.clientes.length;
    document.getElementById('pedidosCount').textContent = mockData.pedidos.length;
}

/**
 * Inicializa a seção de produtores
 */
function initProdutores() {
    const tableBody = document.getElementById('produtoresTable');
    const addButton = document.getElementById('addProdutor');
    
    // Preencher tabela com dados mockados
    renderProdutoresTable();
    
    // Configurar botão de adicionar
    if (addButton) {
        addButton.addEventListener('click', function() {
            alert('Funcionalidade de cadastrar produtor seria implementada aqui');
            // Em um sistema real, abriria um modal ou formulário
        });
    }
    
    function renderProdutoresTable() {
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        mockData.produtores.forEach(produtor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${produtor.nome}</td>
                <td>${produtor.propriedade}</td>
                <td>${produtor.certificacoes}</td>
                <td>${produtor.contato}</td>
                <td class="table-actions">
                    <button class="btn-action btn-edit" data-id="${produtor.id}">✏️</button>
                    <button class="btn-action btn-delete" data-id="${produtor.id}">🗑️</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Configurar eventos dos botões de ação
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                alert(`Editar produtor ID: ${id}`);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este produtor?')) {
                    alert(`Produtor ID: ${id} excluído (simulação)`);
                }
            });
        });
    }
}

/**
 * Inicializa a seção de produtos
 */
function initProdutos() {
    const tableBody = document.getElementById('produtosTable');
    const addButton = document.getElementById('addProduto');
    
    // Preencher tabela com dados mockados
    renderProdutosTable();
    
    // Configurar botão de adicionar
    if (addButton) {
        addButton.addEventListener('click', function() {
            alert('Funcionalidade de cadastrar produto seria implementada aqui');
        });
    }
    
    function renderProdutosTable() {
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        mockData.produtos.forEach(produto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>${produto.produtor}</td>
                <td>${produto.preco}</td>
                <td>${produto.estoque}</td>
                <td class="table-actions">
                    <button class="btn-action btn-edit" data-id="${produto.id}">✏️</button>
                    <button class="btn-action btn-delete" data-id="${produto.id}">🗑️</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Configurar eventos dos botões de ação
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                alert(`Editar produto ID: ${id}`);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este produto?')) {
                    alert(`Produto ID: ${id} excluído (simulação)`);
                }
            });
        });
    }
}

/**
 * Inicializa a seção de clientes
 */
function initClientes() {
    const tableBody = document.getElementById('clientesTable');
    const addButton = document.getElementById('addCliente');
    
    // Preencher tabela com dados mockados
    renderClientesTable();
    
    // Configurar botão de adicionar
    if (addButton) {
        addButton.addEventListener('click', function() {
            alert('Funcionalidade de cadastrar cliente seria implementada aqui');
        });
    }
    
    function renderClientesTable() {
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        mockData.clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.endereco}</td>
                <td class="table-actions">
                    <button class="btn-action btn-edit" data-id="${cliente.id}">✏️</button>
                    <button class="btn-action btn-delete" data-id="${cliente.id}">🗑️</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Configurar eventos dos botões de ação
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                alert(`Editar cliente ID: ${id}`);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este cliente?')) {
                    alert(`Cliente ID: ${id} excluído (simulação)`);
                }
            });
        });
    }
}

/**
 * Inicializa a seção de pedidos
 */
function initPedidos() {
    const tableBody = document.getElementById('pedidosTable');
    const addButton = document.getElementById('addPedido');
    
    // Preencher tabela com dados mockados
    renderPedidosTable();
    
    // Configurar botão de adicionar
    if (addButton) {
        addButton.addEventListener('click', function() {
            alert('Funcionalidade de criar novo pedido seria implementada aqui');
        });
    }
    
    function renderPedidosTable() {
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        mockData.pedidos.forEach(pedido => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${pedido.id.toString().padStart(3, '0')}</td>
                <td>${pedido.cliente}</td>
                <td>${pedido.data}</td>
                <td>${pedido.valor}</td>
                <td><span class="status-${pedido.status.toLowerCase()}">${pedido.status}</span></td>
                <td class="table-actions">
                    <button class="btn-action btn-edit" data-id="${pedido.id}">✏️</button>
                    <button class="btn-action btn-delete" data-id="${pedido.id}">🗑️</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Configurar eventos dos botões de ação
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                alert(`Editar pedido ID: ${id}`);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este pedido?')) {
                    alert(`Pedido ID: ${id} excluído (simulação)`);
                }
            });
        });
    }
}

/**
 * Inicializa a seção de pagamentos
 */
function initPagamentos() {
    const tableBody = document.getElementById('pagamentosTable');
    const addButton = document.getElementById('addPagamento');
    
    // Preencher tabela com dados mockados
    renderPagamentosTable();
    
    // Configurar botão de adicionar
    if (addButton) {
        addButton.addEventListener('click', function() {
            alert('Funcionalidade de registrar pagamento seria implementada aqui');
        });
    }
    
    function renderPagamentosTable() {
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        mockData.pagamentos.forEach(pagamento => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${pagamento.pedido}</td>
                <td>${pagamento.cliente}</td>
                <td>${pagamento.valor}</td>
                <td>${pagamento.vencimento}</td>
                <td><span class="status-${pagamento.status.toLowerCase()}">${pagamento.status}</span></td>
                <td class="table-actions">
                    <button class="btn-action btn-edit" data-id="${pagamento.id}">✏️</button>
                    <button class="btn-action" data-id="${pagamento.id}">💰</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Configurar eventos dos botões de ação
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                alert(`Editar pagamento ID: ${id}`);
            });
        });
        
        document.querySelectorAll('.btn-action:not(.btn-edit)').forEach(btn => {
            if (!btn.classList.contains('btn-delete')) {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    alert(`Registrar pagamento ID: ${id}`);
                });
            }
        });
    }
}

/**
 * Inicializa a seção de relatórios
 */
function initRelatorios() {
    const relVendasBtn = document.getElementById('relVendas');
    const relEstoqueBtn = document.getElementById('relEstoque');
    const relEntregasBtn = document.getElementById('relEntregas');
    const gerarRelatorioBtn = document.getElementById('gerarRelatorio');
    
    // Configurar botões de relatórios
    if (relVendasBtn) {
        relVendasBtn.addEventListener('click', function() {
            alert('Gerando relatório de vendas...');
        });
    }
    
    if (relEstoqueBtn) {
        relEstoqueBtn.addEventListener('click', function() {
            alert('Gerando relatório de estoque...');
        });
    }
    
    if (relEntregasBtn) {
        relEntregasBtn.addEventListener('click', function() {
            alert('Gerando relatório de entregas...');
        });
    }
    
    // Configurar botão de gerar relatório
    if (gerarRelatorioBtn) {
        gerarRelatorioBtn.addEventListener('click', function() {
            const dataInicio = document.getElementById('dataInicio').value;
            const dataFim = document.getElementById('dataFim').value;
            
            if (!dataInicio || !dataFim) {
                alert('Por favor, selecione as datas de início e fim');
                return;
            }
            
            alert(`Relatório gerado para o período: ${dataInicio} a ${dataFim}`);
        });
    }
}

// 32. Detecção de inatividade
function initInactivityTimer() {
    let timeout;
    
    function resetTimer() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (confirm('Sua sessão expirou por inatividade. Deseja continuar?')) {
                resetTimer();
            } else {
                handleLogout();
            }
        }, 30 * 60 * 1000);
    }
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
        document.addEventListener(event, resetTimer, false);
    });
    
    resetTimer();
}

// 33. Persistência de estado da UI
function saveUIState() {
    const state = {
        sidebarCollapsed: document.getElementById('sidebar').classList.contains('collapsed'),
        activeSection: document.querySelector('.nav-link.active')?.dataset.section
    };
    localStorage.setItem('agroUIState', JSON.stringify(state));
}

function loadUIState() {
    const state = JSON.parse(localStorage.getItem('agroUIState') || '{}');
    
    if (state.sidebarCollapsed) {
        document.getElementById('sidebar').classList.add('collapsed');
    }
    
    if (state.activeSection) {
        const link = document.querySelector(`[data-section="${state.activeSection}"]`);
        link?.click();
    }
}

// No DOMContentLoaded existente, ADICIONAR:
initInactivityTimer();
loadUIState();
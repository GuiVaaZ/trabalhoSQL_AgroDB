/**
 * Módulo de autenticação simulada
 * Gerencia login, logout e verificação de sessão
 */

// Verificar se o usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Se estamos na página de login
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        // Se já está logado, redirecionar para o dashboard
        if (isLoggedIn()) {
            window.location.href = 'dashboard.html';
        }
        
        // Configurar o formulário de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    } 
    // Se estamos no dashboard
    else if (window.location.pathname.endsWith('dashboard.html')) {
        // Se não está logado, redirecionar para o login
        if (!isLoggedIn()) {
            window.location.href = 'index.html';
            return;
        }
        
        // Configurar o botão de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        
        // Exibir nome do usuário
        const userWelcome = document.getElementById('userWelcome');
        if (userWelcome) {
            const user = getUser();
            userWelcome.textContent = `Bem-vindo, ${user.username}`;
        }
    }
});

/**
 * Verifica se o usuário está logado
 * @returns {boolean} True se estiver logado, false caso contrário
 */
function isLoggedIn() {
    return localStorage.getItem('agroUser') !== null;
}

/**
 * Obtém os dados do usuário logado
 * @returns {object|null} Dados do usuário ou null se não estiver logado
 */
function getUser() {
    const userData = localStorage.getItem('agroUser');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Processa o formulário de login
 * @param {Event} event - Evento de submissão do formulário
 */
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Credenciais fixas para demonstração
    if (username === 'admin' && password === 'admin') {
        // Salvar dados do usuário no localStorage
        const userData = {
            username: username,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('agroUser', JSON.stringify(userData));
        
        // Redirecionar para o dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('Usuário ou senha incorretos. Use admin/admin');
    }
}

/**
 * Processa o logout do usuário
 */
function handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('agroUser');
        window.location.href = 'index.html';
    }
}
/* ===== MELHORIAS ADICIONAIS ===== */

// 4. Validação de formulários em tempo real
function validateLoginForm() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const submitBtn = document.querySelector('.btn-primary');
    
    if (!username || !password || !submitBtn) return;
    
    function checkForm() {
        const isValid = username.value.length > 0 && password.value.length > 0;
        submitBtn.disabled = !isValid;
        submitBtn.style.opacity = isValid ? 1 : 0.6;
        submitBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
    }
    
    username.addEventListener('input', checkForm);
    password.addEventListener('input', checkForm);
    checkForm();
}

//No DOMContentLoaded existente, ADICIONAR:
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
     validateLoginForm();
 }
// Gerenciamento de autenticação usando localStorage

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário já está logado
    const isLoggedIn = checkLoggedIn();
    
    // Se estiver na página de login ou cadastro e já estiver logado, redirecionar para o perfil
    if ((window.location.pathname.includes('login.html') || window.location.pathname.includes('cadastro.html')) && isLoggedIn) {
        window.location.href = 'perfil.html';
    }
    
    // Mostrar/ocultar senha
    setupPasswordToggle();
    
    // Setup do formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Setup do formulário de cadastro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Verificação de força da senha
        const passwordInput = document.getElementById('register-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', checkPasswordStrength);
        }
    }
});

// Função para verificar se o usuário está logado
function checkLoggedIn() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser !== null;
}

// Função para mostrar/ocultar senha
function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Função para verificar a força da senha
function checkPasswordStrength(event) {
    const password = event.target.value;
    const strengthMeter = document.querySelector('.strength-meter-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthMeter || !strengthText) return;
    
    let strength = 0;
    
    // Verificações para determinar a força da senha
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    
    // Atualizar o medidor
    strengthMeter.setAttribute('data-strength', strength);
    
    // Atualizar o texto
    switch (strength) {
        case 0:
            strengthText.textContent = 'Senha fraca';
            break;
        case 1:
            strengthText.textContent = 'Senha fraca';
            break;
        case 2:
            strengthText.textContent = 'Senha média';
            break;
        case 3:
            strengthText.textContent = 'Senha forte';
            break;
        case 4:
            strengthText.textContent = 'Senha muito forte';
            break;
    }
}

// Função para lidar com o login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me')?.checked || false;
    const errorElement = document.getElementById('login-error');
    
    // Verificar se os campos foram preenchidos
    if (!email || !password) {
        errorElement.textContent = 'Por favor, preencha todos os campos.';
        return;
    }
    
    // Buscar usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Procurar o usuário com o email fornecido
    const user = users.find(user => user.email === email);
    
    // Verificar se o usuário existe e a senha está correta
    if (!user || user.password !== password) {
        errorElement.textContent = 'E-mail ou senha incorretos.';
        return;
    }
    
    // Login bem-sucedido
    localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        rememberMe: rememberMe
    }));
    
    // Redirecionar para a página de perfil
    window.location.href = 'perfil.html';
}

// Função para lidar com o cadastro
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const termsAgreed = document.getElementById('terms-agree')?.checked || false;
    const errorElement = document.getElementById('register-error');
    
    // Verificar se os campos foram preenchidos
    if (!name || !email || !password || !confirmPassword) {
        errorElement.textContent = 'Por favor, preencha todos os campos.';
        return;
    }
    
    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
        errorElement.textContent = 'As senhas não coincidem.';
        return;
    }
    
    // Verificar se aceitou os termos
    if (!termsAgreed) {
        errorElement.textContent = 'Você precisa aceitar os Termos de Serviço.';
        return;
    }
    
    // Buscar usuários existentes
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar se o e-mail já está em uso
    if (users.some(user => user.email === email)) {
        errorElement.textContent = 'Este e-mail já está em uso.';
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: Date.now(), // Usar timestamp como ID
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    // Adicionar ao array de usuários
    users.push(newUser);
    
    // Salvar no localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Login automático
    localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        rememberMe: false
    }));
    
    // Redirecionar para a página de perfil
    window.location.href = 'perfil.html';
}

// Função para fazer logout (pode ser chamada de outros scripts)
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
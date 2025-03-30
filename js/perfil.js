// Gerenciamento da página de perfil do usuário

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Se não estiver logado, redirecionar para a página de login
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Preencher informações do usuário
    fillUserInfo(currentUser);
    
    // Configurar navegação entre as seções
    setupNavigation();
    
    // Verifica se a URL contém um fragmento (hash) para carregar uma seção específica
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1); // Remove o # do início
        const targetLink = document.querySelector(`.perfil-nav-link[data-target="perfil-${targetId}"]`);
        if (targetLink) {
            targetLink.click(); // Simula um clique no link correspondente
        }
    }
    
    // Configurar botões de logout
    const logoutButton = document.getElementById('logout-button');
    const logoutButtonMobile = document.getElementById('logout-button-mobile');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    if (logoutButtonMobile) {
        logoutButtonMobile.addEventListener('click', handleLogout);
    }
    
    // Carregar jogos comprados para a biblioteca
    loadPurchasedGames();
    
    // Configurar os filtros da biblioteca
    setupLibraryFilters();
    
    // Configurar formulário de configurações
    const perfilForm = document.getElementById('perfil-form');
    if (perfilForm) {
        perfilForm.addEventListener('submit', handleProfileUpdate);
        
        // Preencher os campos do formulário
        document.getElementById('perfil-name').value = currentUser.name;
        document.getElementById('perfil-email').value = currentUser.email;
    }
    
    // Configurar a visualização/ocultação de senha
    setupPasswordToggle();
    
    // Configurar menu móvel
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        // Inicialmente oculto
        mobileMenu.style.display = 'none';
        
        mobileMenuButton.addEventListener('click', function() {
            if (mobileMenu.style.display === 'none') {
                mobileMenu.style.display = 'block';
            } else {
                mobileMenu.style.display = 'none';
            }
        });
    }
});

// Função para preencher as informações do usuário
function fillUserInfo(user) {
    // Header
    const headerUsername = document.getElementById('header-username');
    if (headerUsername) {
        headerUsername.textContent = user.name.split(' ')[0]; // Apenas o primeiro nome
    }
    
    // Sidebar
    const sidebarUsername = document.getElementById('sidebar-username');
    const sidebarEmail = document.getElementById('sidebar-email');
    
    if (sidebarUsername) {
        sidebarUsername.textContent = user.name;
    }
    
    if (sidebarEmail) {
        sidebarEmail.textContent = user.email;
    }
    
    // Seção de visão geral
    const welcomeUsername = document.getElementById('welcome-username');
    if (welcomeUsername) {
        welcomeUsername.textContent = user.name.split(' ')[0];
    }
}

// Função para configurar a navegação entre as seções
function setupNavigation() {
    const navLinks = document.querySelectorAll('.perfil-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe ativa de todos os links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // Adicionar classe ativa ao link atual
            this.classList.add('active');
            
            // Ocultar todas as seções
            const sections = document.querySelectorAll('.perfil-section');
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar a seção correspondente
            const targetSection = document.getElementById(this.getAttribute('data-target'));
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Função para lidar com o logout
function handleLogout(event) {
    event.preventDefault();
    
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Função para lidar com a atualização do perfil
function handleProfileUpdate(event) {
    event.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    const name = document.getElementById('perfil-name').value;
    const password = document.getElementById('perfil-password').value;
    const confirmPassword = document.getElementById('perfil-confirm-password').value;
    
    // Verificar se os campos obrigatórios foram preenchidos
    if (!name) {
        alert('Por favor, preencha o campo Nome.');
        return;
    }
    
    // Verificar se a nova senha foi preenchida e as senhas coincidem
    if (password && password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }
    
    // Encontrar o usuário no array
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex !== -1) {
        // Atualizar o nome
        users[userIndex].name = name;
        
        // Atualizar a senha, se fornecida
        if (password) {
            users[userIndex].password = password;
        }
        
        // Salvar as alterações
        localStorage.setItem('users', JSON.stringify(users));
        
        // Atualizar o objeto currentUser
        currentUser.name = name;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Atualizar as informações exibidas
        fillUserInfo(currentUser);
        
        // Feedback visual
        alert('Perfil atualizado com sucesso!');
    }
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

// Função para carregar jogos comprados
function loadPurchasedGames() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    const userPurchases = purchases.filter(purchase => purchase.userId === currentUser.id);
    
    // Atualizar contador de jogos na visão geral
    const gameCountElement = document.querySelector('.stat-value');
    if (gameCountElement) {
        gameCountElement.textContent = userPurchases.length.toString();
    }
    
    // Verificar se o usuário tem jogos comprados
    const gamesLibraryContainer = document.getElementById('games-library');
    const gameLibraryEmpty = document.getElementById('game-library-empty');
    
    if (userPurchases.length === 0) {
        // Não há jogos, mostrar mensagem
        if (gamesLibraryContainer) gamesLibraryContainer.style.display = 'none';
        if (gameLibraryEmpty) gameLibraryEmpty.style.display = 'flex';
        return;
    }
    
    // Há jogos, ocultar mensagem e mostrar grid
    if (gamesLibraryContainer) gamesLibraryContainer.style.display = 'grid';
    if (gameLibraryEmpty) gameLibraryEmpty.style.display = 'none';
    
    // Limpar o container antes de adicionar novos jogos
    if (gamesLibraryContainer) {
        gamesLibraryContainer.innerHTML = '';
        
        // Adicionar cada jogo comprado à biblioteca
        userPurchases.forEach(purchase => {
            const gameCards = createGameLibraryCard(purchase.game);
            gamesLibraryContainer.appendChild(gameCards);
        });
    }
}

// Função para criar um card de jogo na biblioteca
function createGameLibraryCard(game) {
    const card = document.createElement('div');
    card.className = 'library-game-card';
    card.setAttribute('data-game-id', game.id);
    
    const purchaseDate = new Date();
    const formattedDate = formatDate(purchaseDate);
    const hoursPlayed = Math.floor(Math.random() * 10); // Simular horas jogadas para demonstração
    
    card.innerHTML = `
        <div class="library-game-image">
            <img src="${game.imageUrl}" alt="${game.title}">
        </div>
        <div class="library-game-content">
            <h3>${game.title}</h3>
            <div class="library-game-details">
                <p>Comprado em: ${formattedDate}</p>
                <p>Horas jogadas: ${hoursPlayed}h</p>
            </div>
            <div class="library-game-actions">
                <a href="#" class="play-button">Jogar</a>
            </div>
        </div>
    `;
    
    return card;
}

// Configurar a funcionalidade de filtro e pesquisa na biblioteca
function setupLibraryFilters() {
    const searchInput = document.getElementById('library-search-input');
    const sortSelect = document.getElementById('library-sort');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterGames);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', sortGames);
    }
}

// Filtrar jogos por nome
function filterGames() {
    const searchInput = document.getElementById('library-search-input');
    const gameCards = document.querySelectorAll('.library-game-card');
    
    if (!searchInput || !gameCards.length) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    gameCards.forEach(card => {
        const gameTitle = card.querySelector('h3').textContent.toLowerCase();
        if (gameTitle.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Ordenar jogos
function sortGames() {
    const sortSelect = document.getElementById('library-sort');
    const gamesContainer = document.getElementById('games-library');
    const gameCards = Array.from(document.querySelectorAll('.library-game-card'));
    
    if (!sortSelect || !gamesContainer || !gameCards.length) return;
    
    const sortOption = sortSelect.value;
    
    gameCards.sort((a, b) => {
        if (sortOption === 'name') {
            const titleA = a.querySelector('h3').textContent;
            const titleB = b.querySelector('h3').textContent;
            return titleA.localeCompare(titleB);
        } else if (sortOption === 'hoursPlayed') {
            const hoursA = parseInt(a.querySelector('.library-game-details p:nth-child(2)').textContent.match(/\d+/)[0]);
            const hoursB = parseInt(b.querySelector('.library-game-details p:nth-child(2)').textContent.match(/\d+/)[0]);
            return hoursB - hoursA; // Ordem decrescente
        } else {
            // Por padrão, ordenar por data de compra mais recente (já que todos são comprados agora, não será muito visível)
            return 0;
        }
    });
    
    // Remover todos os cards atuais
    gameCards.forEach(card => card.remove());
    
    // Adicionar os cards na nova ordem
    gameCards.forEach(card => {
        gamesContainer.appendChild(card);
    });
}

// Formatar data
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}
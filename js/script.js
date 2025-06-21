// Funções para a página inicial do Press Play

// Função para garantir visibilidade dos cards
function ensureCardsVisible() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Garantir que os cards sejam visíveis
    ensureCardsVisible();
    // Inicializar o carrossel
    initCarousel();

    // Configurar os cards de jogos
    setupGameCards();

    // Configurar o modal de detalhes do jogo
    setupModal();

    // Configurar botões de adicionar ao carrinho
    setupCartButtons();

    // Atualizar contador do carrinho
    updateCartCount();

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

// Função para formatar preços em reais
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para calcular preço com desconto
function calculateDiscountedPrice(price, discountPercentage) {
    return price - (price * (discountPercentage / 100));
}

// Função para formatar datas
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Função para calcular classificação em estrelas
function getRatingStars(rating) {
    // Arredonda para o 0.5 mais próximo
    const roundedRating = Math.round(rating * 2) / 2;

    // Calcula a quantidade de cada tipo de estrela
    const fullStars = Math.floor(roundedRating);
    const halfStars = roundedRating % 1 === 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return { full: fullStars, half: halfStars, empty: emptyStars };
}

// Inicializar o carrossel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    let currentIndex = 0;
    let intervalId;

    // Função para atualizar o carrossel
    function updateCarousel(index) {
        // Remover classe active de todos os slides e indicadores
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Adicionar classe active ao slide e indicador atual
        slides[index].classList.add('active');
        indicators[index].classList.add('active');

        // Atualizar o índice atual
        currentIndex = index;
    }

    // Função para avançar para o próximo slide
    function nextSlide() {
        const newIndex = (currentIndex + 1) % slides.length;
        updateCarousel(newIndex);
    }

    // Função para retornar ao slide anterior
    function prevSlide() {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel(newIndex);
    }

    // Resetar o intervalo de autoplay
    function resetInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(nextSlide, 5000);
    }

    // Adicionar eventos de clique para os botões de navegação
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
    }

    // Adicionar eventos de clique para os indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            updateCarousel(index);
            resetInterval();
        });
    });

    // Iniciar o autoplay
    resetInterval();
}

// Configurar os cards de jogos
function setupGameCards() {
    const gameCards = document.querySelectorAll('.game-card');

    gameCards.forEach(card => {
        // Adicionar evento de clique para abrir o modal de detalhes
        card.addEventListener('click', function() {
            // Obter informações do jogo a partir do card
            const img = this.querySelector('img').src;
            const title = this.querySelector('h3').textContent;

            // Preparar objeto com dados do jogo
            const gameData = {
                id: Math.floor(Math.random() * 1000), // ID aleatório para exemplo
                title: title,
                imageUrl: img,
                description: "Neste emocionante jogo de mundo aberto, você embarca em uma jornada épica cheia de aventuras, desafios e mistérios para resolver. Explore vastos territórios, enfrente inimigos poderosos e forje alianças estratégicas em sua busca por glória.",
                price: parseFloat(this.querySelector('.current-price').textContent.replace('R$', '').replace(',', '.')),
                developer: "Estúdio de Desenvolvimento Exemplo",
                publisher: "Publicadora Exemplo",
                releaseDate: "2023-06-15",
                categories: Array.from(this.querySelectorAll('.game-categories span')).map(span => span.textContent),
                rating: 4.5,
                reviewCount: 1250,
                screenshots: [
                    "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_bac60bacbf5da8945103648c08d27d5e202444ca.jpg",
                    "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_ff2aa4d989a9f5068ebd65c418024211d0a1d7e0.jpg",
                    "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_c5d5341fd69478f62d55dd200e8ba38a2d9b3e0a.jpg",
                    "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_12a3e5d8d6654b8ab64d9392c56ee05df741122d.jpg"
                ]
            };

            // Abrir o modal com os dados do jogo
            openGameModal(gameData);
        });
    });

    // Evitar propagação de clique para botões dentro dos cards
    const cardButtons = document.querySelectorAll('.game-card button');
    cardButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

// Configurar o modal de detalhes do jogo
function setupModal() {
    const modal = document.getElementById('game-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Evitar o fechamento do modal ao clicar em seu conteúdo
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Adicionar evento de tecla Escape para fechar o modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Função para abrir o modal com os detalhes do jogo
function openGameModal(game) {
    const modal = document.getElementById('game-modal');

    // Preencher os dados do jogo no modal
    document.getElementById('modal-game-img').src = game.imageUrl;
    document.getElementById('modal-game-title').textContent = game.title;
    document.getElementById('modal-game-developer').textContent = game.developer;
    document.getElementById('modal-game-publisher').textContent = game.publisher;
    document.getElementById('modal-game-release').textContent = formatDate(game.releaseDate);

    // Preencher categorias
    const categoriesContainer = document.getElementById('modal-game-categories');
    categoriesContainer.innerHTML = '';
    game.categories.forEach(category => {
        const span = document.createElement('span');
        span.textContent = category;
        categoriesContainer.appendChild(span);
    });

    // Preencher avaliação
    document.getElementById('modal-game-rating').textContent = game.rating.toFixed(1);
    document.getElementById('modal-reviews-count').textContent = `(${game.reviewCount} avaliações)`;

    // Preencher estrelas de avaliação
    const stars = getRatingStars(game.rating);
    const ratingStarsContainer = document.getElementById('modal-rating-stars');
    ratingStarsContainer.innerHTML = '';

    // Adicionar estrelas cheias
    for (let i = 0; i < stars.full; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        ratingStarsContainer.appendChild(star);
    }

    // Adicionar meia estrela, se houver
    if (stars.half > 0) {
        const star = document.createElement('i');
        star.className = 'fas fa-star-half-alt';
        ratingStarsContainer.appendChild(star);
    }

    // Adicionar estrelas vazias
    for (let i = 0; i < stars.empty; i++) {
        const star = document.createElement('i');
        star.className = 'far fa-star';
        ratingStarsContainer.appendChild(star);
    }

    // Preencher preço
    const hasDiscount = game.discountPercentage && game.discountPercentage > 0;
    const priceContainer = document.getElementById('modal-price-container');

    if (hasDiscount) {
        document.getElementById('modal-old-price').textContent = formatCurrency(game.price);
        document.getElementById('modal-discount').textContent = `-${game.discountPercentage}%`;
        document.getElementById('modal-current-price').textContent = formatCurrency(calculateDiscountedPrice(game.price, game.discountPercentage));

        document.getElementById('modal-old-price').style.display = 'inline';
        document.getElementById('modal-discount').style.display = 'inline';
    } else {
        document.getElementById('modal-current-price').textContent = formatCurrency(game.price);

        document.getElementById('modal-old-price').style.display = 'none';
        document.getElementById('modal-discount').style.display = 'none';
    }

    // Preencher descrição
    document.getElementById('modal-game-description').textContent = game.description;

    // Preencher screenshots
    const screenshotsContainer = document.getElementById('modal-screenshots');
    screenshotsContainer.innerHTML = '';

    game.screenshots.forEach(screenshot => {
        const div = document.createElement('div');
        div.className = 'screenshot';

        const img = document.createElement('img');
        img.src = screenshot;
        img.alt = 'Screenshot do jogo';

        div.appendChild(img);
        screenshotsContainer.appendChild(div);
    });

    // Configurar botão de adicionar ao carrinho no modal
    const addToCartButton = document.querySelector('.add-to-cart-modal');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            addToCart(game);
            modal.style.display = 'none';
        });
    }

    // Mostrar o modal
    modal.style.display = 'block';
}

// Configurar os botões de adicionar ao carrinho
function setupCartButtons() {
    // Botões nos cards de jogos
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que o modal abra

            // Obter informações do jogo a partir do card pai
            const card = this.closest('.game-card');
            const title = card.querySelector('h3').textContent;
            const imageUrl = card.querySelector('img').src;

            // Determinar se há desconto
            const oldPriceElement = card.querySelector('.old-price');
            const currentPriceElement = card.querySelector('.current-price');

            let price, discountPercentage;

            if (oldPriceElement) {
                // Se há desconto
                const oldPrice = parseFloat(oldPriceElement.textContent.replace('R$', '').replace('.', '').replace(',', '.'));
                const currentPrice = parseFloat(currentPriceElement.textContent.replace('R$', '').replace('.', '').replace(',', '.'));

                price = oldPrice;
                // Calcular percentual de desconto
                discountPercentage = Math.round((1 - currentPrice / oldPrice) * 100);
            } else {
                // Se não há desconto
                price = parseFloat(currentPriceElement.textContent.replace('R$', '').replace('.', '').replace(',', '.'));
                discountPercentage = 0;
            }

            // Criar objeto do jogo
            const game = {
                id: Math.floor(Math.random() * 10000), // ID aleatório para exemplo
                title: title,
                imageUrl: imageUrl,
                price: price,
                discountPercentage: discountPercentage,
                developer: "Estúdio Exemplo",
                publisher: "Publicadora Exemplo",
                categories: Array.from(card.querySelectorAll('.game-categories span')).map(span => span.textContent)
            };

            // Adicionar ao carrinho
            addToCart(game);

            // Mostrar mensagem de confirmação
            this.textContent = 'Adicionado ✓';
            this.classList.add('added');

            // Restaurar texto original após 2 segundos
            setTimeout(() => {
                this.textContent = 'Adicionar ao Carrinho';
                this.classList.remove('added');
            }, 2000);
        });
    });

    // Botões de compra rápida no carrossel
    const buyButtons = document.querySelectorAll('.buy-button');

    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Obter informações do jogo a partir do slide
            const slide = this.closest('.carousel-slide');
            const title = slide.querySelector('h2').textContent;
            const imageUrl = slide.querySelector('.carousel-image').style.backgroundImage.replace('url("', '').replace('")', '');

            // Determinar se há desconto
            const discountElement = slide.querySelector('.discount');
            const oldPriceElement = slide.querySelector('.old-price');
            const currentPriceElement = slide.querySelector('.current-price');

            let price, discountPercentage;

            if (discountElement && oldPriceElement) {
                // Se há desconto
                price = parseFloat(oldPriceElement.textContent.replace('R$', '').replace('.', '').replace(',', '.'));
                discountPercentage = parseInt(discountElement.textContent.replace('-', '').replace('%', ''));
            } else if (currentPriceElement) {
                // Se não há desconto
                price = parseFloat(currentPriceElement.textContent.replace('R$', '').replace('.', '').replace(',', '.'));
                discountPercentage = 0;
            }

            // Criar objeto do jogo
            const game = {
                id: Math.floor(Math.random() * 10000), // ID aleatório para exemplo
                title: title,
                imageUrl: imageUrl,
                price: price,
                discountPercentage: discountPercentage,
                developer: "Estúdio Exemplo",
                publisher: "Publicadora Exemplo",
                categories: ["Ação", "Aventura"]
            };

            // Adicionar ao carrinho e redirecionar para a página de carrinho
            addToCart(game);
            window.location.href = 'carrinho.html';
        });
    });
}

// Função para adicionar um jogo ao carrinho
function addToCart(game) {
    // Obter itens atuais do carrinho
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Verificar se o jogo já está no carrinho
    const existingItem = cartItems.find(item => item.id === game.id);

    if (!existingItem) {
        // Adicionar ao carrinho
        cartItems.push(game);

        // Salvar no localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Atualizar o contador do carrinho
        updateCartCount();
    }
}

// Função para atualizar o contador de itens no carrinho
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const count = cartItems.length;

    // Atualizar contador no ícone do carrinho
    const cartCount = document.getElementById('cart-count');
    const cartBadgeMobile = document.getElementById('cart-badge-mobile');

    if (cartCount) cartCount.textContent = count;
    if (cartBadgeMobile) cartBadgeMobile.textContent = count;

    // Mostrar ou ocultar os contadores
    if (cartCount) cartCount.style.display = count > 0 ? 'flex' : 'none';
    if (cartBadgeMobile) cartBadgeMobile.style.display = count > 0 ? 'inline-flex' : 'none';
}
// Lista de jogos disponíveis
const games = [
    {
        id: 1,
        title: "Cyberpunk 2077",
        price: 199.90,
        oldPrice: 299.90,
        discount: 33,
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg?t=1621944801",
        description: "Cyberpunk 2077 é um RPG de ação e aventura de mundo aberto ambientado na megalópole de Night City, onde você joga como um mercenário cyberpunk envolvido em uma intensa luta pela sobrevivência.",
        categories: ["RPG", "Cyberpunk", "Mundo Aberto"],
        developer: "CD PROJEKT RED",
        publisher: "CD PROJEKT RED",
        releaseDate: "10 de dezembro de 2020",
        rating: 4.2,
        screenshots: [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_bac60bacbf5da8945103648c08d27d5e202444ca.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_ff2aa4d989a9f5068ebd65c418024211d0a1d7e9.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_c5d5341fd69478f62d55dd200e8ba38a2d9b3e0a.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_12a3e5d8d6654b8ab64d9392c56ee05df741122d.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_d71ce9e8d8a7a8cebed5fdf70523207ce5065631.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_e3ad7eae38e4f2bc64c94b7ab7a9b8b7d9e3c6f0.jpg"
        ]
    },
    {
        id: 2,
        title: "The Witcher 3: Wild Hunt",
        price: 38.97,
        oldPrice: 129.90,
        discount: 70,
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg?t=1621939214",
        description: "Em The Witcher 3: Wild Hunt, você joga como Geralt de Rivia, um caçador de monstros profissional em busca de uma criança da profecia num vasto mundo aberto rico em cidades mercantes, ilhas piratas, passagens montanhosas perigosas e cavernas esquecidas.",
        categories: ["RPG", "Fantasia", "Mundo Aberto"],
        developer: "CD PROJEKT RED",
        publisher: "CD PROJEKT RED",
        releaseDate: "19 de maio de 2015",
        rating: 4.8,
        screenshots: [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_d4adc8972c4133ce2b0d3b5f1b5c2c5e1c08b1f7.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_b8b42c7a9ef155c85c1c6e8a0e0d8e9c8e2e2e8d.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_1a6f71c57b5c4a2d9b7a5e3f0c7e8b4c8e7a5e3f.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_e8b4c8e7a5e3f0c7e8b4c8e7a5e3f0c7e8b4c8e7.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_7a5e3f0c7e8b4c8e7a5e3f0c7e8b4c8e7a5e3f0c.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_5e3f0c7e8b4c8e7a5e3f0c7e8b4c8e7a5e3f0c7e.jpg"
        ]
    },
    {
        id: 3,
        title: "Fallout 4",
        price: 49.95,
        oldPrice: 99.90,
        discount: 50,
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/377160/header.jpg?t=1619788192",
        description: "Bethesda Game Studios, os criadores premiados de Fallout 3 e The Elder Scrolls V: Skyrim, dão as boas-vindas a você ao mundo de Fallout 4 – o jogo mais ambicioso deles até agora, e a próxima geração de jogos de mundo aberto.",
        categories: ["RPG", "Pós-Apocalíptico", "Mundo Aberto"],
        developer: "Bethesda Game Studios",
        publisher: "Bethesda Softworks",
        releaseDate: "10 de novembro de 2015",
        rating: 4.5,
        screenshots: [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/377160/ss_c1e8cf15b1ac5ddbc36fb95b3ee62d07f92fa5fb.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/377160/ss_4e5b0a9e0e2e8c7a6f5d4c3b2a1e0f9e8d7c6b5a.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/377160/ss_f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/377160/ss_9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/377160/ss_7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/377160/ss_5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a.jpg"
        ]
    },
    {
        id: 4,
        title: "Grand Theft Auto V",
        price: 89.95,
        oldPrice: 149.90,
        discount: 40,
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg?t=1618856191",
        description: "Grand Theft Auto V para PC oferece aos jogadores a opção de explorar o mundo massivo e diversificado de Los Santos e Blaine County com resoluções de até 4K e além, assim como a chance de experimentar o jogo rodando a 60 quadros por segundo.",
        categories: ["Ação", "Aventura", "Mundo Aberto"],
        developer: "Rockstar North",
        publisher: "Rockstar Games",
        releaseDate: "14 de abril de 2015",
        rating: 4.6,
        screenshots: [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_d1a43ad9c0e6dcacf5fcdcea6b718b87bb95a36b.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_e6f5d4c3b2a1e0f9e8d7c6b5a4f3e2d1c0b9a8f7.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1.jpg"
        ]
    },
    {
        id: 5,
        title: "Red Dead Redemption 2",
        price: 149.90,
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg?t=1620142502",
        description: "Red Dead Redemption 2 é a sequência épica do aclamado Red Dead Redemption de 2010. Ambientado em 1899, no coração dos Estados Unidos, conta a história de Arthur Morgan e da gangue Van der Linde.",
        categories: ["Ação", "Aventura", "Western"],
        developer: "Rockstar Games",
        publisher: "Rockstar Games",
        releaseDate: "5 de dezembro de 2019",
        rating: 4.7,
        isNew: true,
        screenshots: [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_668dafe477743f8b50b818d5bbfaad3909e94492.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_aa1c0d4dc20ceaa5a90b82b4df5e5c86c54f93c4.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_35b44b02b3d88f86d8e5b8d6f7a8b9c0d1e2f3a4.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_44b02b3d88f86d8e5b8d6f7a8b9c0d1e2f3a4b5c6.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_02b3d88f86d8e5b8d6f7a8b9c0d1e2f3a4b5c6d7.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_b3d88f86d8e5b8d6f7a8b9c0d1e2f3a4b5c6d7e8.jpg"
        ]
    },
    {
        id: 6,
        title: "Fortnite",
        price: 0,
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg?t=1631901890",
        description: "Fortnite é um jogo gratuito de sobrevivência que combina exploração, coleta de recursos, combate PvP e construção em um ambiente cartunesco e dinâmico.",
        categories: ["Battle Royale", "Tiro", "Multijogador"],
        developer: "Epic Games",
        publisher: "Epic Games",
        releaseDate: "21 de julho de 2017",
        rating: 4.3,
        isFree: true,
        screenshots: [
            "https://cdn2.unrealengine.com/fortnite-screenshot-01-3840x2160-77b17f2f9fa4.jpg",
            "https://cdn2.unrealengine.com/fortnite-screenshot-02-3840x2160-b5e3c8d4a1f2.jpg",
            "https://cdn2.unrealengine.com/fortnite-screenshot-03-3840x2160-f6a7e4d2c3b1.jpg",
            "https://cdn2.unrealengine.com/fortnite-screenshot-04-3840x2160-c8d5a2f3e6b9.jpg",
            "https://cdn2.unrealengine.com/fortnite-screenshot-05-3840x2160-a1e4b7d0c3f6.jpg",
            "https://cdn2.unrealengine.com/fortnite-screenshot-06-3840x2160-d2f5c8b1e4a7.jpg"
        ]
    },
    {
        id: 7,
        title: "Hogwarts Legacy",
        price: 199.90,
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg?t=1618863534",
        description: "Hogwarts Legacy é um RPG de ação e aventura imersivo e de mundo aberto ambientado no mundo apresentado pela primeira vez nos livros do Harry Potter.",
        categories: ["RPG", "Aventura", "Mundo Aberto"],
        developer: "Avalanche Software",
        publisher: "Warner Bros. Games",
        releaseDate: "10 de fevereiro de 2023",
        rating: 4.4,
        isNew: true,
        screenshots: [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_79b9b9b8c8e1a7f6e5d4c3b2a1f0e9d8c7b6a5f4.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_b8c8e1a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_e1a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3.jpg"
        ]
    },
    {
        id: 8,
        title: "Elden Ring",
        price: 179.90,
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg?t=1654259241",
        description: "O NOVO RPG DE AÇÃO E FANTASIA. Erga-se, Maculado, e seja guiado pela graça para portar o poder do Anel Prístino e se tornar um Lorde Prístino nas Terras Intermédias.",
        categories: ["RPG", "Souls-like", "Fantasia"],
        developer: "FromSoftware",
        publisher: "Bandai Namco Entertainment",
        releaseDate: "25 de fevereiro de 2022",
        rating: 4.5,
        isNew: true,
        screenshots: [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_615455299355eaf552c638c7ea5b24a8b46e02dd.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_8a2506dbc22ac8b73cbf4e30cd0f36a84dcee5db.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_1c3ff9a91ca68dde2f7dc46c5e4cfaae7a65e6d7.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_4e5b0a9e0e2e8c7a6f5d4c3b2a1e0f9e8d7c6b5a.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c.jpg"
        ]
    }
];

// Função para carregar jogos em destaque
function loadFeaturedGames() {
    const featuredGamesContainer = document.querySelector('.featured-games');
    if (featuredGamesContainer) {
        // Limpar conteúdo existente
        featuredGamesContainer.innerHTML = '';

        // Filtrar jogos em destaque (pode ser uma propriedade 'featured' no objeto do jogo)
        const featuredGames = games.filter(game => game.isFeatured); // Ajuste conforme necessário

        // Criar elementos para cada jogo em destaque
        featuredGames.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.className = 'featured-game';

            gameElement.innerHTML = `
                <img src="${game.image}" alt="${game.title}">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <button>Comprar</button>
            `;

            featuredGamesContainer.appendChild(gameElement);
        });
    }
}

// Função para carregar ofertas especiais
function loadSpecialOffers() {
    const specialOffersContainer = document.querySelector('.special-offers');
    if (specialOffersContainer) {
        // Limpar conteúdo existente
        specialOffersContainer.innerHTML = '';

        // Filtrar jogos com desconto
        const specialOffers = games.filter(game => game.discount > 0);

        // Criar elementos para cada oferta especial
        specialOffers.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.className = 'special-offer';

            gameElement.innerHTML = `
                <img src="${game.image}" alt="${game.title}">
                <h3>${game.title}</h3>
                <p>Desconto: ${game.discount}%</p>
                <button>Ver Detalhes</button>
            `;

            specialOffersContainer.appendChild(gameElement);
        });
    }
}

// Função para carregar lançamentos recentes
function loadNewReleases() {
    const newReleasesContainer = document.querySelector('.new-releases');
    if (newReleasesContainer) {
        // Limpar conteúdo existente
        newReleasesContainer.innerHTML = '';

        // Filtrar jogos marcados como novos
        const newReleases = games.filter(game => game.isNew);

        // Criar elementos para cada lançamento recente
        newReleases.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.className = 'new-release';

            gameElement.innerHTML = `
                <img src="${game.image}" alt="${game.title}">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <button>Saiba Mais</button>
            `;

            newReleasesContainer.appendChild(gameElement);
        });
    }
}

// Função para carregar categorias
function loadCategories() {
    const categoriesContainer = document.querySelector('.categories');
    if (categoriesContainer) {
        // Limpar conteúdo existente
        categoriesContainer.innerHTML = '';

        // Obter todas as categorias únicas
        const allCategories = games.reduce((acc, game) => {
            game.categories.forEach(category => {
                if (!acc.includes(category)) {
                    acc.push(category);
                }
            });
            return acc;
        }, []);

        // Criar elementos para cada categoria
        allCategories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';
            categoryElement.textContent = category;
            categoriesContainer.appendChild(categoryElement);
        });
    }
}

// Função para carregar jogos recomendados
function loadRecommendedGames() {
    const recommendedGamesContainer = document.querySelector('.recommended-games');
    if (recommendedGamesContainer) {
        // Limpar conteúdo existente
        recommendedGamesContainer.innerHTML = '';

        // Lógica para recomendar jogos (pode ser aleatória ou com base no histórico do usuário)
        const recommendedGames = games.slice(0, 3); // Exemplo: recomendar os três primeiros jogos

        // Criar elementos para cada jogo recomendado
        recommendedGames.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.className = 'recommended-game';

            gameElement.innerHTML = `
                <img src="${game.image}" alt="${game.title}">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <button>Explorar</button>
            `;

            recommendedGamesContainer.appendChild(gameElement);
        });
    }
}

// Função para configurar a pesquisa
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            // Lógica para filtrar jogos com base no termo de pesquisa
            const filteredGames = games.filter(game =>
                game.title.toLowerCase().includes(searchTerm) ||
                game.categories.some(category => category.toLowerCase().includes(searchTerm))
            );

            // Exibir jogos filtrados (substitua esta parte com a lógica de exibição real)
            console.log('Jogos filtrados:', filteredGames);
        });
    }
}

// Função para atualizar a exibição do carrinho
function updateCartDisplay() {
    // Lógica para obter itens do carrinho (do localStorage, por exemplo)
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Atualizar a exibição do carrinho (substitua esta parte com a lógica de exibição real)
    console.log('Itens no carrinho:', cartItems);
}

// Função para inicializar o modal do jogo
function initGameModal() {
    // Lógica para inicializar o modal do jogo (se necessário)
    console.log('Modal do jogo inicializado');
}
// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initCarousel();
    loadFeaturedGames();
    loadSpecialOffers();
    loadNewReleases();
    loadCategories();
    loadRecommendedGames();
    setupSearch();
    updateCartDisplay();
    initGameModal();
});
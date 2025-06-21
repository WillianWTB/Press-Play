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
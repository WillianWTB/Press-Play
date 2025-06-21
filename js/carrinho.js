// Gerenciamento do carrinho de compras usando localStorage

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Debug - verificar localStorage
    console.log('localStorage cartItems:', localStorage.getItem('cartItems'));
    
    // Aguardar um pequeno delay para garantir que DOM está totalmente carregado
    setTimeout(() => {
        // Carregar os itens do carrinho
        loadCartItems();
        
        // Atualizar contador do carrinho
        updateCartCount();
    }, 100);
    
    // Configurar o botão de checkout
    const checkoutButton = document.getElementById('checkout-button');
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (!currentUser) {
                // Redirecionar para a página de login se não estiver logado
                window.location.href = 'login.html?redirect=carrinho.html';
                return;
            }
            
            // Mostrar o modal de checkout
            const checkoutModal = document.getElementById('checkout-modal');
            if (checkoutModal) {
                checkoutModal.style.display = 'block';
                
                // Atualizar o total no checkout
                const totalElement = document.getElementById('checkout-total');
                const cartTotal = document.getElementById('total');
                
                if (totalElement && cartTotal) {
                    totalElement.textContent = cartTotal.textContent;
                }
            }
        });
    }
    
    // Configurar fechamento do modal
    const closeModal = document.querySelector('.checkout-modal .close-modal');
    const modalOverlay = document.querySelector('.checkout-modal .modal-overlay');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            const checkoutModal = document.getElementById('checkout-modal');
            if (checkoutModal) {
                checkoutModal.style.display = 'none';
            }
        });
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function() {
            const checkoutModal = document.getElementById('checkout-modal');
            if (checkoutModal) {
                checkoutModal.style.display = 'none';
            }
        });
    }
    
    // Evitar fechamento do modal ao clicar em seu conteúdo
    const modalContent = document.querySelector('.checkout-modal .modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Configurar formulário de pagamento
    const paymentForm = document.getElementById('payment-form');
    
    if (paymentForm) {
        // Formatação dos campos do cartão
        const cardNumber = document.getElementById('card-number');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCvv = document.getElementById('card-cvv');
        
        if (cardNumber) {
            cardNumber.addEventListener('input', function(e) {
                // Remover qualquer caractere que não seja número
                let value = e.target.value.replace(/\D/g, '');
                
                // Adicionar espaços a cada 4 dígitos
                if (value.length > 0) {
                    value = value.match(/.{1,4}/g).join(' ');
                }
                
                // Limitar a 19 caracteres (16 dígitos + 3 espaços)
                e.target.value = value.substring(0, 19);
            });
        }
        
        if (cardExpiry) {
            cardExpiry.addEventListener('input', function(e) {
                // Remover qualquer caractere que não seja número
                let value = e.target.value.replace(/\D/g, '');
                
                // Adicionar barra após os primeiros 2 dígitos
                if (value.length > 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2);
                }
                
                // Limitar a 5 caracteres (MM/YY)
                e.target.value = value.substring(0, 5);
            });
        }
        
        if (cardCvv) {
            cardCvv.addEventListener('input', function(e) {
                // Remover qualquer caractere que não seja número
                let value = e.target.value.replace(/\D/g, '');
                
                // Limitar a 4 dígitos
                e.target.value = value.substring(0, 4);
            });
        }
        
        // Submissão do formulário
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar os campos
            const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            const cardName = document.getElementById('card-name').value;
            
            if (cardNumber.length < 16) {
                alert('Por favor, insira um número de cartão válido.');
                return;
            }
            
            if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
                alert('Por favor, insira uma data de validade válida (MM/AA).');
                return;
            }
            
            if (cardCvv.length < 3) {
                alert('Por favor, insira um código CVV válido.');
                return;
            }
            
            if (cardName.trim() === '') {
                alert('Por favor, insira o nome como está no cartão.');
                return;
            }
            
            // Processar o pagamento (simulação)
            processPayment();
        });
    }
    
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

// Função para carregar os itens do carrinho
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const summaryElement = document.getElementById('cart-summary');
    const checkoutButton = document.getElementById('checkout-button');
    
    // Obter itens do carrinho do localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    console.log('Carregando itens do carrinho:', cartItems); // Debug
    
    // Verificar se o carrinho está vazio
    if (cartItems.length === 0) {
        if (emptyCart) emptyCart.style.display = 'flex';
        if (summaryElement) summaryElement.style.opacity = '0.5';
        if (checkoutButton) checkoutButton.disabled = true;
        // Limpar container para mostrar apenas mensagem vazia
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '<div class="empty-cart" id="empty-cart" style="display: flex;"><i class="fas fa-shopping-cart"></i><h3>Seu carrinho está vazio</h3><p>Adicione itens à sua cesta para começar as compras.</p><a href="index.html" class="continue-shopping">Continuar Comprando</a></div>';
        }
        return;
    }
    
    // Ocultar a mensagem de carrinho vazio
    if (emptyCart) emptyCart.style.display = 'none';
    if (summaryElement) summaryElement.style.opacity = '1';
    if (checkoutButton) checkoutButton.disabled = false;
    
    // Limpar container e adicionar itens
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        
        // Adicionar cada item ao container
        let subtotal = 0;
        let discount = 0;
        
        cartItems.forEach((item, index) => {
            const itemElement = createCartItemElement(item);
            // Adicionar animação com delay
            itemElement.style.animationDelay = `${index * 0.1}s`;
            cartItemsContainer.appendChild(itemElement);
            
            // Calcular subtotal e desconto
            const originalPrice = item.price || 0;
            const finalPrice = item.discountPercentage ? calculateDiscountedPrice(item.price, item.discountPercentage) : item.price;
            
            subtotal += originalPrice;
            discount += (originalPrice - finalPrice);
        });
        
        // Atualizar o resumo da compra
        updateOrderSummary(subtotal, discount);
    }
}

// Função para criar um elemento de item do carrinho
function createCartItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.dataset.id = item.id;
    
    // Garantir que temos valores válidos
    const price = item.price || 0;
    const discountPercentage = item.discountPercentage || 0;
    const finalPrice = discountPercentage > 0 ? calculateDiscountedPrice(price, discountPercentage) : price;
    const title = item.title || 'Jogo sem título';
    const developer = item.developer || 'Desenvolvedor desconhecido';
    const imageUrl = item.imageUrl || 'https://via.placeholder.com/150x100?text=No+Image';
    
    itemElement.innerHTML = `
        <div class="item-image">
            <img src="${imageUrl}" alt="${title}" onerror="this.src='https://via.placeholder.com/150x100?text=No+Image'">
        </div>
        <div class="item-details">
            <h3 class="item-title">${title}</h3>
            <p class="item-developer">${developer}</p>
        </div>
        <div class="item-price">
            ${discountPercentage > 0 ? `<span class="item-old-price">${formatCurrency(price)}</span>` : ''}
            <span class="item-current-price">${formatCurrency(finalPrice)}</span>
        </div>
        <div class="item-actions">
            <button class="remove-item" data-id="${item.id}" title="Remover item">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
    
    // Adicionar evento para remover o item
    const removeButton = itemElement.querySelector('.remove-item');
    if (removeButton) {
        removeButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            removeFromCart(item.id);
        });
    }
    
    return itemElement;
}

// Função para atualizar o resumo do pedido
function updateOrderSummary(subtotal, discount) {
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
    if (discountElement) discountElement.textContent = `-${formatCurrency(discount)}`;
    if (totalElement) totalElement.textContent = formatCurrency(subtotal - discount);
}

// Função para remover um item do carrinho
function removeFromCart(itemId) {
    // Obter itens atuais do carrinho
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Filtrar o item a ser removido
    cartItems = cartItems.filter(item => item.id !== itemId);
    
    // Atualizar o localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Recarregar os itens do carrinho
    loadCartItems();
    
    // Atualizar o contador do carrinho
    updateCartCount();
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

// Função para processar o pagamento (simulação)
function processPayment() {
    // Esconder o passo de pagamento
    const paymentStep = document.getElementById('payment-step');
    if (paymentStep) paymentStep.style.display = 'none';
    
    // Mostrar o passo de confirmação
    const confirmationStep = document.getElementById('confirmation-step');
    if (confirmationStep) confirmationStep.style.display = 'block';
    
    // Gerar um número de pedido aleatório
    const orderId = 'PP' + Math.floor(10000000 + Math.random() * 90000000);
    const orderIdElement = document.getElementById('order-id');
    if (orderIdElement) orderIdElement.textContent = orderId;
    
    // Definir a data do pedido
    const today = new Date();
    const orderDate = today.toLocaleDateString('pt-BR');
    const orderDateElement = document.getElementById('order-date');
    if (orderDateElement) orderDateElement.textContent = orderDate;
    
    // Obter o usuário atual
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Obter itens do carrinho
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Salvar a compra no histórico de compras
    if (currentUser) {
        // Obter histórico de compras existente
        const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
        
        // Adicionar cada jogo do carrinho como uma compra separada
        cartItems.forEach(game => {
            purchases.push({
                id: Date.now() + Math.floor(Math.random() * 1000), // ID único para a compra
                userId: currentUser.id,
                game: game,
                date: new Date().toISOString(),
                orderId: orderId
            });
        });
        
        // Salvar as compras atualizadas
        localStorage.setItem('purchases', JSON.stringify(purchases));
    }
    
    // Limpar o carrinho
    localStorage.removeItem('cartItems');
    
    // Atualizar o contador do carrinho
    updateCartCount();
}

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
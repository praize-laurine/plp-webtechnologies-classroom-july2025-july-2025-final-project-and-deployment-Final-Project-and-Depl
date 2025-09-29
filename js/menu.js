/**
 * Menu Page JavaScript - Brew Café Coffee Shop
 * Handles menu filtering, interactions, and dynamic content loading
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MENU FILTERING FUNCTIONALITY =====
    
    /**
     * Initialize menu filtering system
     * Allows users to filter menu items by category
     */
    function initMenuFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const menuCards = document.querySelectorAll('.menu-card');
        
        if (filterButtons.length === 0 || menuCards.length === 0) return;
        
        // Add click event to each filter button
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter menu items with animation
                filterMenuItems(filterValue, menuCards);
            });
        });
    }
    
    /**
     * Filter menu items based on selected category
     * @param {string} filterValue - Category to filter by ('all' or specific category)
     * @param {NodeList} menuCards - All menu card elements
     */
    function filterMenuItems(filterValue, menuCards) {
        menuCards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');
            const shouldShow = filterValue === 'all' || cardCategory === filterValue;
            
            if (shouldShow) {
                // Show card with staggered animation
                setTimeout(() => {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    
                    // Animate in
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 50);
            } else {
                // Hide card with fade out
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Update URL hash for bookmarking
        if (filterValue !== 'all') {
            history.replaceState(null, null, `#${filterValue}`);
        } else {
            history.replaceState(null, null, ' ');
        }
    }
    
    // ===== ADD TO CART FUNCTIONALITY =====
    
    /**
     * Initialize add to cart functionality
     * Simulates adding items to a shopping cart
     */
    function initAddToCart() {
        const addButtons = document.querySelectorAll('.add-btn');
        let cart = getCartFromStorage();
        
        addButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const menuCard = this.closest('.menu-card');
                const itemData = extractItemData(menuCard);
                
                if (itemData) {
                    addToCart(itemData);
                    animateAddToCart(this, itemData);
                }
            });
        });
    }
    
    /**
     * Extract item data from menu card
     * @param {Element} menuCard - Menu card element
     * @returns {Object} Item data object
     */
    function extractItemData(menuCard) {
        try {
            const title = menuCard.querySelector('h3').textContent.trim();
            const description = menuCard.querySelector('p').textContent.trim();
            const price = menuCard.querySelector('.price').textContent.trim();
            const image = menuCard.querySelector('img').src;
            const category = menuCard.getAttribute('data-category');
            
            return {
                id: generateItemId(title),
                title,
                description,
                price,
                image,
                category,
                quantity: 1
            };
        } catch (error) {
            console.error('Error extracting item data:', error);
            return null;
        }
    }
    
    /**
     * Generate unique ID for menu item
     * @param {string} title - Item title
     * @returns {string} Unique ID
     */
    function generateItemId(title) {
        return title.toLowerCase()
                   .replace(/[^a-z0-9]/g, '-')
                   .replace(/-+/g, '-')
                   .replace(/^-|-$/g, '');
    }
    
    /**
     * Add item to cart
     * @param {Object} itemData - Item to add to cart
     */
    function addToCart(itemData) {
        let cart = getCartFromStorage();
        const existingItemIndex = cart.findIndex(item => item.id === itemData.id);
        
        if (existingItemIndex > -1) {
            // Item already in cart, increment quantity
            cart[existingItemIndex].quantity += 1;
        } else {
            // New item, add to cart
            cart.push(itemData);
        }
        
        saveCartToStorage(cart);
        updateCartUI();
        
        // Show success notification
        showNotification(`${itemData.title} added to cart!`, 'success');
    }
    
    /**
     * Animate add to cart button
     * @param {Element} button - Button that was clicked
     * @param {Object} itemData - Item data
     */
    function animateAddToCart(button, itemData) {
        // Store original button state
        const originalText = button.textContent;
        const originalBackground = button.style.backgroundColor;
        
        // Change button appearance
        button.textContent = 'Added!';
        button.style.backgroundColor = 'var(--success)';
        button.style.transform = 'scale(1.05)';
        
        // Disable button temporarily
        button.disabled = true;
        
        // Reset button after animation
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalBackground;
            button.style.transform = 'scale(1)';
            button.disabled = false;
        }, 1500);
        
        // Create floating price animation
        createFloatingPrice(button, itemData.price);
    }
    
    /**
     * Create floating price animation
     * @param {Element} button - Reference button for positioning
     * @param {string} price - Item price
     */
    function createFloatingPrice(button, price) {
        const floatingPrice = document.createElement('div');
        floatingPrice.textContent = price;
        
        // Style floating price
        Object.assign(floatingPrice.style, {
            position: 'absolute',
            color: 'var(--success)',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            pointerEvents: 'none',
            zIndex: '1000',
            opacity: '1',
            transition: 'all 2s ease-out'
        });
        
        // Position relative to button
        const buttonRect = button.getBoundingClientRect();
        floatingPrice.style.left = `${buttonRect.left}px`;
        floatingPrice.style.top = `${buttonRect.top}px`;
        
        document.body.appendChild(floatingPrice);
        
        // Animate floating effect
        setTimeout(() => {
            floatingPrice.style.transform = 'translateY(-50px)';
            floatingPrice.style.opacity = '0';
        }, 100);
        
        // Remove element after animation
        setTimeout(() => {
            if (floatingPrice.parentNode) {
                floatingPrice.parentNode.removeChild(floatingPrice);
            }
        }, 2100);
    }
    
    // ===== CART STORAGE FUNCTIONS =====
    
    /**
     * Get cart data from localStorage
     * @returns {Array} Cart items array
     */
    function getCartFromStorage() {
        try {
            const cartData = localStorage.getItem('brewAndBeanCart');
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error reading cart from storage:', error);
            return [];
        }
    }
    
    /**
     * Save cart data to localStorage
     * @param {Array} cart - Cart items array
     */
    function saveCartToStorage(cart) {
        try {
            localStorage.setItem('brewAndBeanCart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }
    
    /**
     * Update cart UI elements (if they exist on the page)
     */
    function updateCartUI() {
        const cart = getCartFromStorage();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return sum + (price * item.quantity);
        }, 0);
        
        // Update cart counter if it exists
        const cartCounter = document.querySelector('.cart-counter');
        if (cartCounter) {
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'block' : 'none';
        }
        
        // Update cart total if it exists
        const cartTotal = document.querySelector('.cart-total');
        if (cartTotal) {
            cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
        }
    }
    
    // ===== MENU SEARCH FUNCTIONALITY =====
    
    /**
     * Initialize menu search functionality
     */
    function initMenuSearch() {
        const searchInput = document.querySelector('.menu-search');
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            // Debounce search to improve performance
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchMenuItems(searchTerm);
            }, 300);
        });
    }
    
    /**
     * Search menu items by title or description
     * @param {string} searchTerm - Search term
     */
    function searchMenuItems(searchTerm) {
        const menuCards = document.querySelectorAll('.menu-card');
        let visibleCount = 0;
        
        menuCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const isMatch = title.includes(searchTerm) || description.includes(searchTerm);
            
            if (searchTerm === '' || isMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show no results message if needed
        showNoResultsMessage(visibleCount === 0 && searchTerm !== '');
    }
    
    /**
     * Show/hide no results message
     * @param {boolean} show - Whether to show the message
     */
    function showNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div class="text-center" style="padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--light-brown); margin-bottom: 20px;"></i>
                    <h3>No items found</h3>
                    <p>Try adjusting your search terms or browse our categories above.</p>
                </div>
            `;
            
            const menuGrid = document.querySelector('.menu-grid');
            if (menuGrid) {
                menuGrid.parentNode.insertBefore(noResultsMsg, menuGrid.nextSibling);
            }
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }
    
    // ===== LOAD URL FILTER =====
    
    /**
     * Load filter from URL hash on page load
     */
    function loadFilterFromURL() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const filterButton = document.querySelector(`[data-filter="${hash}"]`);
            if (filterButton) {
                filterButton.click();
            }
        }
    }
    
    // ===== MENU ITEM MODAL/QUICK VIEW =====
    
    /**
     * Initialize menu item quick view functionality
     */
    function initMenuQuickView() {
        const menuCards = document.querySelectorAll('.menu-card');
        
        menuCards.forEach(card => {
            const overlay = card.querySelector('.menu-overlay');
            if (overlay) {
                overlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    const itemData = extractItemData(card);
                    if (itemData) {
                        showItemModal(itemData);
                    }
                });
            }
        });
    }
    
    /**
     * Show item modal with detailed information
     * @param {Object} itemData - Item data
     */
    function showItemModal(itemData) {
        // Create modal HTML
        const modalHTML = `
            <div class="item-modal" id="itemModal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body">
                        <div class="modal-image">
                            <img src="${itemData.image}" alt="${itemData.title}">
                        </div>
                        <div class="modal-info">
                            <h2>${itemData.title}</h2>
                            <p class="modal-description">${itemData.description}</p>
                            <div class="modal-price">${itemData.price}</div>
                            <div class="modal-actions">
                                <button class="btn btn-primary modal-add-btn">Add to Cart</button>
                                <button class="btn btn-secondary modal-close-btn">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Style modal
        const modal = document.getElementById('itemModal');
        addModalStyles(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', closeItemModal);
        modal.querySelector('.modal-overlay').addEventListener('click', closeItemModal);
        modal.querySelector('.modal-close-btn').addEventListener('click', closeItemModal);
        modal.querySelector('.modal-add-btn').addEventListener('click', function() {
            addToCart(itemData);
            closeItemModal();
        });
        
        // Show modal
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    /**
     * Close item modal
     */
    function closeItemModal() {
        const modal = document.getElementById('itemModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    /**
     * Add styles to modal
     * @param {Element} modal - Modal element
     */
    function addModalStyles(modal) {
        const style = document.createElement('style');
        style.textContent = `
            .item-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            .item-modal.active {
                opacity: 1;
                visibility: visible;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
            }
            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 90%;
                overflow: auto;
            }
            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                z-index: 1;
            }
            .modal-body {
                padding: 0;
            }
            .modal-image {
                height: 300px;
                overflow: hidden;
                border-radius: 12px 12px 0 0;
            }
            .modal-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .modal-info {
                padding: 30px;
            }
            .modal-info h2 {
                margin-bottom: 15px;
                color: var(--primary-brown);
            }
            .modal-description {
                margin-bottom: 20px;
                font-size: 1.1rem;
                line-height: 1.6;
            }
            .modal-price {
                font-size: 2rem;
                font-weight: bold;
                color: var(--accent-gold);
                margin-bottom: 30px;
            }
            .modal-actions {
                display: flex;
                gap: 15px;
            }
            @media (max-width: 768px) {
                .modal-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== INITIALIZE ALL MENU FUNCTIONS =====
    
    /**
     * Initialize all menu functionality
     */
    function initMenu() {
        try {
            initMenuFiltering();
            initAddToCart();
            initMenuSearch();
            initMenuQuickView();
            loadFilterFromURL();
            updateCartUI(); // Update UI on page load
            
            console.log('Menu functionality initialized successfully');
        } catch (error) {
            console.error('Error initializing menu functionality:', error);
        }
    }
    
    // Start menu initialization
    initMenu();
    
});
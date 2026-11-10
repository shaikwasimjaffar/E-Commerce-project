
const products = [
    {
        id: 1,
        name: "Classic Sneakers",
        category: "Shoes",
        price: 2499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },
    {
        id: 2,
        name: "Luxury Watch",
        category: "Watches",
        price: 3499,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"
    },
    {
        id: 3,
        name: "Casual Jacket",
        category: "Clothing",
        price: 1999,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"
    },
    {
        id: 4,
        name: "Leather Bag",
        category: "Accessories",
        price: 1599,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"
    },
    {
        id: 5,
        name: "Running Shoes",
        category: "Shoes",
        price: 2899,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },
    {
        id: 6,
        name: "Minimal Watch",
        category: "Watches",
        price: 2799,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    },
    {
        id: 7,
        name: "Premium T-Shirt",
        category: "Clothing",
        price: 999,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
    },
    {
        id: 8,
        name: "Classic Sunglasses",
        category: "Accessories",
        price: 1299,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
    }
];

let cart = [];

let selectedCategory = "All";

// Display products
function displayProducts(list) {

    const productList = document.getElementById("productList");

    if (list.length === 0) {
        productList.innerHTML = "<p>No products found.</p>";
        return;
    }

    productList.innerHTML = list.map(product => `
        <div class="product-card">

            <div class="product-image">
                <img src="${product.image}" alt="${product.name}"
                     onerror="this.src='https://placehold.co/400x400?text=Product'">
            </div>

            <div class="product-info">

                <p class="product-category">${product.category}</p>

                <h3>${product.name}</h3>

                <p class="product-price">
                    ₹${product.price.toLocaleString("en-IN")}
                </p>

                <button class="add-btn"
                    onclick="addToCart(${product.id})">
                    ADD TO BAG +
                </button>

            </div>

        </div>
    `).join("");
}

// Add product to cart
function addToCart(id) {

    const product = products.find(p => p.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();

    alert(product.name + " added to your bag!");
}

// Update cart
function updateCart() {

    const cartItems = document.getElementById("cartItems");

    let total = 0;
    let count = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = "Your bag is empty.";

    } else {

        cartItems.innerHTML = cart.map(item => {

            total += item.price * item.quantity;
            count += item.quantity;

            return `
                <div class="cart-item">

                    <h4>${item.name}</h4>

                    <p>₹${item.price.toLocaleString("en-IN")}</p>

                    <div class="quantity-controls">

                        <button onclick="changeQuantity(${item.id}, -1)">-</button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${item.id}, 1)">+</button>

                        <span>
                            ₹${(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>

                    </div>

                </div>
            `;

        }).join("");
    }

    document.getElementById("cartTotal").textContent =
        "₹" + total.toLocaleString("en-IN");

    document.getElementById("cartCount").textContent = count;
}

// Change quantity
function changeQuantity(id, amount) {

    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    updateCart();
}

// Open and close cart
function toggleCart() {

    document.getElementById("cartSidebar")
        .classList.toggle("open");

    document.getElementById("cartOverlay")
        .classList.toggle("show");
}

// Filter products
function filterProducts(category, button) {

    selectedCategory = category;

    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    applyFilters();
}

// Search products
document.getElementById("searchInput")
    .addEventListener("input", applyFilters);

function applyFilters() {

    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    const filtered = products.filter(product => {

        const categoryMatch =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const searchMatch =
            product.name.toLowerCase().includes(search);

        return categoryMatch && searchMatch;
    });

    displayProducts(filtered);
}

// Checkout
async function checkout() {

    if (cart.length === 0) {
        alert("Your shopping bag is empty!");
        return;
    }

    const customer = prompt("Enter your name:");

    if (!customer || !customer.trim()) {
        alert("Please enter your name.");
        return;
    }

    const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    try {

        const response = await fetch("/api/orders", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                customer: customer.trim(),
                items: cart,
                total: total
            })

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert(
            result.message +
            "\nOrder ID: " + result.orderId
        );

        cart = [];

        updateCart();

        toggleCart();

    } catch (error) {

        alert("Order failed: " + error.message);

    }
}

// Initial display
displayProducts(products);
updateCart();

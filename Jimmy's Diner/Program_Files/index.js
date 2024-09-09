import { menuArray } from './data.js';

const app = document.getElementById("app");
let order = [];

// Function to add an item to the order or increase its quantity
window.addToOrder = function addToOrder(itemId) {
    const itemInOrder = order.find(i => i.id === itemId);

    if (itemInOrder) {
        itemInOrder.quantity += 1;
    } else {
        const item = menuArray.find(i => i.id === itemId);
        order.push({ ...item, quantity: 1 });
    }

    renderOrderSummary();
    hideEmptyCartMessage();
}

// Function to remove an item from the order
window.removeFromOrder = function removeFromOrder(itemId) {
    const itemInOrder = order.find(i => i.id === itemId);

    if (itemInOrder) {
        itemInOrder.quantity -= 1;
        if (itemInOrder.quantity === 0) {
            order = order.filter(i => i.id !== itemId);
        }
        renderOrderSummary();
    }
}

// Function to complete the order
window.completeOrder = function completeOrder() {
    if (order.length === 0) {
        showEmptyCartMessage();
    } else {
        showPaymentModal();
    }
}

// Function to render the menu
function renderMenu() {
    let menuHtml = '';
    menuArray.forEach(item => {
        menuHtml += `
            <div class="menu-item">
                <div class="emoji">${item.emoji}</div>
                <div>
                    <div>${item.name}</div>
                    <small>${item.ingredients.join(", ")}</small>
                </div>
                <div class="price-button-container">
                    <div class="price">$${item.price}</div>
                    <button onclick="addToOrder(${item.id})">+</button>
                </div>
            </div>
        `;
    });

    app.innerHTML = `
        <div>${menuHtml}</div>
        <div class="order-summary">
            <div id="order-list"></div>
            <div>Total: $<span id="total-price">0</span></div>
            <div class="complete-order" onclick="completeOrder()">Complete order</div>
        </div>
        <div id="confirmation-message" class="hidden"></div>
        <div id="empty-cart-message" class="hidden"></div>
    `;
}

// Function to render the order summary
function renderOrderSummary() {
    let total = 0;
    let orderHtml = '';

    order.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderHtml += `
            <div class="order-item">
                <div>${item.name} (${item.quantity})</div>
                <div>$${itemTotal}</div>
                <button class="remove-button" onclick="removeFromOrder(${item.id})">REMOVE</button>
            </div>
        `;
    });

    document.getElementById('order-list').innerHTML = orderHtml;
    document.getElementById('total-price').innerText = total;
}

// Payment Modal Functions
const paymentModal = document.getElementById("payment-modal");
const modalCloseBtn = document.getElementById('modal-close-btn');  // Added close button
const overlay = document.createElement("div");
overlay.classList.add("overlay");

// Show payment modal
window.showPaymentModal = function showPaymentModal() {
    document.body.appendChild(overlay);
    paymentModal.classList.remove("hidden");
}

// Close payment modal when clicking the close button
window.closePaymentModal = function closePaymentModal() {
    paymentModal.classList.add("hidden");
    document.body.removeChild(overlay);
}

// Close the modal when the close button is clicked
modalCloseBtn.addEventListener('click', function() {
    closePaymentModal();
});

// Handle Payment Form Submission
document.getElementById("payment-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const cardNumber = document.getElementById("card-number").value;
    const cvv = document.getElementById("cvv").value;

    if (name && cardNumber.length === 16 && cvv.length === 3) {
        displayConfirmationMessage(name);
        closePaymentModal();
        order = [];
        renderOrderSummary();
    } else {
        alert("Please fill in all fields with valid information.");
    }
});

// Function to display confirmation message
function displayConfirmationMessage(name) {
    const confirmationMessage = document.getElementById("confirmation-message");
    confirmationMessage.innerHTML = `Thanks, ${name}! Your order is on its way!`;
    confirmationMessage.classList.remove("hidden");
}

// Function to display empty cart message
function showEmptyCartMessage() {
    const emptyCartMessage = document.getElementById("empty-cart-message");
    emptyCartMessage.innerHTML = "Your cart is empty!";
    emptyCartMessage.classList.remove("hidden");
}

// Function to hide empty cart message
function hideEmptyCartMessage() {
    const emptyCartMessage = document.getElementById("empty-cart-message");
    emptyCartMessage.classList.add("hidden");
}

// Initial Render
renderMenu();

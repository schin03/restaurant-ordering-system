let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = "";

    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name + " - $" + item.price;
        cartList.appendChild(li);
    });
}

function checkout() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    fetch("http://localhost:8080/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items: cart.map(item => item.name),
            total: total
        })
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        cart = [];
        renderCart();
    });
}
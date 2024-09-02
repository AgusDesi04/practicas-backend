const socket = io();

function renderProducts(products) {
    const productList = document.getElementById("product-list")
    productList.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.id = `product-${product.id}`;
        li.innerHTML = `
        ${product.title}-$${product.price}
        <button onclick="deleteProduct('${product.id}')">Delete Product</button>
        `;
        productList.appendChild(li);
    });
};


document.getElementById("product-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
    };

    socket.emit("createProduct", newProduct);

    document.getElementById('product-form').reset();
});

document.getElementById("product-list").addEventListener("click", (e) => {
    console.log('boton!!!')
    if (e.target.classList.contains("delete-buton")) {
        const id = e.target.getAttribute("data-id")
        socket.emit("deleteProduct", id)
    }
})

window.deleteProduct = function (id) {
    socket.emit("deleteProduct", id)
}

socket.on('products', (products) => {
    renderProducts(products)
})

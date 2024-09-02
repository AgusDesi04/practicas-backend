const socket = io();

socket.on('updateProducts', (products) => {
    console.log("Received updated products:", products);
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productItem = document.createElement('li');
        productItem.id = `product-${product.id}`;
        productItem.textContent = `${product.name} - ${product.price}`;
        productList.appendChild(productItem);
    });
});
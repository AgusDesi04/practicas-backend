document.getElementById("product-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("addToCart-button")) {
    const productId = e.target.getAttribute("data-id")
    fetch(`/api/carts/66f19528cc3f3eec0ea11fe1/products/${productId}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(`producto agregado al carrito:${data}`)
      })
      .catch(error => {
        console.error(`error al agregar el producto al carrito:${error}`)
      })

  }
})

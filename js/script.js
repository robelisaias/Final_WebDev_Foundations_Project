const container = document.getElementById("product-container");

let products = [];

// Render products
function renderProducts(productList) {
  container.innerHTML = "";

  productList.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="product-img">
        <img src="${product.image}" alt="${product.title}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <button onclick="viewProduct(${product.id})">View Product</button>
    `;

    container.appendChild(card);
  });
}

// Fetch data
async function loadProducts() {
  try {
    const response = await fetch("assets/products.json");

    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    products = await response.json();
    renderProducts(products);

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Failed to load products.</p>";
  }
}

loadProducts();

// Navigate to product page
function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}
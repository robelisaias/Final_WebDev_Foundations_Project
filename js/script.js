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



// PRODUCT DETAILS PAGE LOGIC

const detailsContainer = document.getElementById("product-details-container");

if (detailsContainer) {

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  async function loadProductDetails() {
    try {
      const response = await fetch("assets/products.json");

      if (!response.ok) {
        throw new Error("Failed to load product");
      }

      const products = await response.json();

      const product = products.find(p => p.id == productId);

      if (!product) {
        detailsContainer.innerHTML = "<p>Product not found.</p>";
        return;
      }

      detailsContainer.innerHTML = `
        <div class="product-box">
          <img src="${product.image}" alt="${product.title}">
          
          <div class="product-info">
            <h1>${product.title}</h1>
            <p>${product.description}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
          </div>
        </div>
      `;

    } catch (error) {
      console.error(error);
      detailsContainer.innerHTML = "<p>Error loading product.</p>";
    }
  }

  loadProductDetails();
}


const container = document.getElementById("product-container");

let products = [];
let currentFilter = "all";
let currentSearch = "";
let currentSort = "default";
let filteredProducts = [];

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

    // initial render
    filteredProducts = products;
    applyFilters();

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


//search functionality
function handleSearch(value) {
  currentSearch = value.toLowerCase();
  applyFilters();
}


//filter functionality
function setFilter(category, btn) {
  currentFilter = category;

  document.querySelectorAll(".filters button").forEach(b => {
    b.classList.remove("active");
  });

  btn.classList.add("active");

  applyFilters();
}

//sort functionality
function handleSort(value) {
  currentSort = value;
  applyFilters();
}

document.getElementById("sortSelect").addEventListener("change", (e) => {
  handleSort(e.target.value);
});

//Core function to apply search, filter, and sort
function applyFilters() {
  let result = [...products];

  // SEARCH
  if (currentSearch) {
    result = result.filter(p =>
      p.title.toLowerCase().includes(currentSearch)
    );
  }

  // FILTER
  if (currentFilter !== "all") {
    result = result.filter(p =>
  p.category?.toLowerCase() === currentFilter.toLowerCase()
);
  }

  // SORT
  if (currentSort === "low-high") {
    result.sort((a, b) => a.price - b.price);
  }

  if (currentSort === "high-low") {
    result.sort((a, b) => b.price - a.price);
  }

  filteredProducts = result;
  renderProducts(filteredProducts);
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

//Api implementation section below

async function loadcurrenty(){

  try{
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    
    const data = await response.json();

    document.getElementById('currencyResult').textContent = `1 USD = ${data.rates.CAD} CAD`;
  }
  catch(error){
    document.getElementById('currencyResult').textContent = "Failed to load currency data.";}
}


async function loadCountry(){

  try{
    const response = await fetch("https://restcountries.com/v3.1/region/africa");
    const data = await response.json();

    const random = data[Math.floor(Math.random() * data.length)];

    document.getElementById("countryInfo").textContent =
      `${random.name.common} — Capital: ${random.capital}`;
  }
  catch(error){
    document.getElementById("countryInfo").textContent = "Failed to load country data.";}
}


//loadCountry();
//loadcurrenty();
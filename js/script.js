const container = document.getElementById("product-container");

let products = [];
let filteredProducts = [];

let currentFilter = "all";
let currentSearch = "";
let currentSort = "default";


const popup = document.getElementById("successPopup");

function showPopup() {
  if (popup) popup.classList.remove("hidden");
}

function closePopup() {
  if (popup) popup.classList.add("hidden");
}

// make available for inline HTML onclick=""
window.closePopup = closePopup;
window.showPopup = showPopup;

/* render products */

function renderProducts(productList) {
  if (!container) return;

  container.innerHTML = "";

  if (!productList.length) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  productList.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="product-img">
        <img 
          src="${product.image?.trim()}" 
          alt="${product.title}" 
          onerror="this.src='assets/fallback.jpg'"
          style="width:100%; height:100%; object-fit:cover;"
        >
      </div>

      <h3>${product.title}</h3>
      <p>$${product.price}</p>

      <button onclick="viewProduct(${product.id})">
        View Product
      </button>
    `;

    container.appendChild(card);
  });
}

/* load products */
async function loadProducts() {
  if (!container) return;

  try {
    const response = await fetch("assets/products.json");

    if (!response.ok) throw new Error("Failed to load products");

    products = await response.json();

    filteredProducts = products;
    applyFilters();

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Failed to load products.</p>";
  }
}

loadProducts();

/* navigation*/
function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

/* search */
function handleSearch(value) {
  currentSearch = value.toLowerCase();
  applyFilters();
}

/* filter */
function setFilter(category, btn) {
  currentFilter = category;

  document.querySelectorAll(".filters button").forEach(b => {
    b.classList.remove("active");
  });

  if (btn) btn.classList.add("active");

  applyFilters();
}

/* sort */
function handleSort(value) {
  currentSort = value;
  applyFilters();
}

const sortSelect = document.getElementById("sortSelect");

if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    handleSort(e.target.value);
  });
}

/* Core filter engine */
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

/*Product details page  */

const detailsContainer = document.getElementById("product-details-container");

if (detailsContainer) {

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  async function loadProductDetails() {
    try {
      const response = await fetch("assets/products.json");

      if (!response.ok) throw new Error("Failed to load product");

      const data = await response.json();

      const product = data.find(p =>
        String(p.id) === String(productId)
      );

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

            <button onclick="addToCart(${product.id})">
              Add to Cart
            </button>
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

/* Contacts form validation */
const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");

    if (nameError) nameError.textContent = "";
    if (emailError) emailError.textContent = "";
    if (messageError) messageError.textContent = "";

    if (name.value.trim() === "") {
  nameError.textContent = "Name is required";
  name.classList.add("error");
  isValid = false;
} else {
  name.classList.remove("error");
  name.classList.add("success");
}

    if (email.value.trim() === "") {
      emailError.textContent = "Email is required";
      isValid = false;
    } else if (!email.value.includes("@")) {
      emailError.textContent = "Please enter a valid email";
      isValid = false;
    }

    if (message.value.trim() === "") {
      messageError.textContent = "Message cannot be empty";
      isValid = false;
    } else if (message.value.trim().length < 10) {
      messageError.textContent = "Message must be at least 10 characters";
      isValid = false;
    }

    if (isValid) {
      showPopup();
      form.reset();
    }
  });
}

/* Api */
async function loadCurrency() {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await response.json();

    const el = document.getElementById("currencyResult");
    if (el) el.textContent = `1 USD = ${data.rates.CAD} CAD`;

  } catch {
    const el = document.getElementById("currencyResult");
    if (el) el.textContent = "Failed to load currency data.";
  }
}

async function loadCountry() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/region/africa");
    const data = await response.json();

    const random = data[Math.floor(Math.random() * data.length)];

    const el = document.getElementById("countryInfo");
    if (el) el.textContent = `${random.name.common} — Capital: ${random.capital}`;

  } catch {
    const el = document.getElementById("countryInfo");
    if (el) el.textContent = "Failed to load country data.";
  }
}


loadCurrency();
loadCountry();
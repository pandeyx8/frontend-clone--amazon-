import { cart, addToCart, calculateCartQuantity } from "../data/cart.js";
import { products, loadProductsFetch } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

loadProductsFetch().then(() => {
  renderProductsGrid(products, '');
  initSearch();
});

function renderProductsGrid(list, query=''){
  let productHTML = '';
  const q = (query || '').toLowerCase();
  if(!list || list.length === 0){
    document.querySelector('.js-product-grid').innerHTML = `
      <div class="no-results">
        No products found for "${escapeHTML(query)}".
      </div>
    `;
    return;
  }
  list.forEach((product) => {
    const name = product.name || '';
    const highlightedName = q && name.toLowerCase().includes(q)
      ? highlightText(name, q)
      : name;
    productHTML += `
        <div class="product-container">
            <div class="product-image-container">
              <img class="product-image"
                src="${product.image}">
            </div>
  
            <div class="product-name limit-text-to-2-lines">
              ${highlightedName}
            </div>
  
            <div class="product-rating-container">
              <img class="product-rating-stars"
                src="${product.getStarsUrl()}">
              <div class="product-rating-count link-primary">
                ${product.rating.count}
              </div>
            </div>
  
            <div class="product-price">
              ${product.getPrice()}
            </div>
  
            <div class="product-quantity-container">
              <select>
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
  
            ${product.extraInfoHTML()}
  
            <div class="product-spacer"></div>
  
            <div class="added-to-cart">
              <img src="images/icons/checkmark.png">
              Added
            </div>
  
            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id = "${product.id}" data-product-name ="${product.name}">
              Add to Cart
            </button>
        </div>
    `;
  });
  document.querySelector('.js-product-grid')
   .innerHTML = productHTML;
   
  updateCartQuantity();
  function updateCartQuantity(){
    let cartQauntity = calculateCartQuantity();
    if(cartQauntity) document.querySelector('.js-cart-quantity')
       .innerHTML = cartQauntity;
  }
  
  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      button.addEventListener('click', () =>{
        const productId = button.dataset.productId;
        addToCart(productId);
        updateCartQuantity();
      })
  });
}

function initSearch(){
  const input = document.querySelector('.search-bar');
  const button = document.querySelector('.search-button');
  if(!input || !button) return;

  let suggestions = document.querySelector('.js-search-suggestions');
  if(!suggestions){
    suggestions = document.createElement('div');
    suggestions.className = 'search-suggestions js-search-suggestions';
    const middle = input.parentElement;
    middle.appendChild(suggestions);
  }

  let clearBtn = document.querySelector('.js-search-clear');
  if(!clearBtn){
    clearBtn = document.createElement('button');
    clearBtn.className = 'search-clear js-search-clear';
    clearBtn.type = 'button';
    clearBtn.title = 'Clear search';
    clearBtn.textContent = '×';
    const middle = input.parentElement;
    middle.appendChild(clearBtn);
  }
  clearBtn.style.display = 'none';

  const positionOverlay = () => {
    const rect = input.getBoundingClientRect();
    const middle = input.parentElement;
    const parentRect = middle.getBoundingClientRect();
    const left = rect.left - parentRect.left;
    const top = rect.top - parentRect.top;
    suggestions.style.left = `${left}px`;
    suggestions.style.top = `${top + rect.height}px`;
    suggestions.style.width = `${rect.width}px`;
    clearBtn.style.top = `${top + 8}px`;
    clearBtn.style.right = '55px';
  };
  positionOverlay();
  window.addEventListener('resize', positionOverlay);

  const showSuggestions = (items) => {
    if(!items || items.length === 0){
      suggestions.innerHTML = '';
      suggestions.style.display = 'none';
      return;
    }
    positionOverlay();
    const html = items.map(item => `<div class="suggestion-item" data-name="${item}">${item}</div>`).join('');
    suggestions.innerHTML = html;
    suggestions.style.display = 'block';

    Array.from(suggestions.querySelectorAll('.suggestion-item')).forEach(el => {
      el.addEventListener('mousedown', (e) => {
        const name = e.currentTarget.dataset.name;
        input.value = name;
        applySearch(name);
        hideSuggestionsSoon();
      });
    });
  };

  const hideSuggestionsSoon = () => {
    setTimeout(() => {
      suggestions.style.display = 'none';
    }, 0);
  };

  const getSuggestions = (q) => {
    const query = (q || '').trim().toLowerCase();
    if(!query) return [];
    const names = new Set();
    products.forEach(p => {
      const name = (p.name || '').toLowerCase();
      const keywords = Array.isArray(p.keywords) ? p.keywords.map(k => (k||'').toLowerCase()) : [];
      const hay = [name, ...keywords];
      if(hay.some(h => h.includes(query))){
        names.add(p.name);
      }
    });
    const all = Array.from(names);
    const starts = all.filter(n => n.toLowerCase().startsWith(query));
    const contains = all.filter(n => !n.toLowerCase().startsWith(query));
    return [...starts, ...contains].slice(0, 6);
  };

  const applySearch = (q) => {
    const query = (q || '').trim().toLowerCase();
    if(!query){
      renderProductsGrid(products, '');
      clearBtn.style.display = 'none';
      return;
    }
    const filtered = products.filter(p => {
      const name = (p.name || '').toLowerCase();
      const keywords = Array.isArray(p.keywords) ? p.keywords.map(k => (k||'').toLowerCase()) : [];
      return name.includes(query) || keywords.some(k => k.includes(query));
    });
    renderProductsGrid(filtered, q);
    clearBtn.style.display = 'inline-block';
  };

  let lastVal = '';
  let activeIndex = -1;
  const updateActiveSuggestion = () => {
    Array.from(suggestions.querySelectorAll('.suggestion-item')).forEach((el, idx) => {
      el.classList.toggle('active', idx === activeIndex);
    });
  };

  input.addEventListener('input', () => {
    const val = input.value;
    if(val === lastVal) return;
    lastVal = val;
    activeIndex = -1;
    updateActiveSuggestion();
    showSuggestions(getSuggestions(val));
  });

  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      if(activeIndex >= 0){
        const el = suggestions.querySelectorAll('.suggestion-item')[activeIndex];
        if(el){
          input.value = el.dataset.name;
          applySearch(el.dataset.name);
        }
      } else {
        applySearch(input.value);
      }
      hideSuggestionsSoon();
    } else if(e.key === 'Escape'){
      input.value = '';
      applySearch('');
      hideSuggestionsSoon();
    } else if(e.key === 'ArrowDown'){
      const items = suggestions.querySelectorAll('.suggestion-item');
      if(items.length){
        activeIndex = Math.min(items.length - 1, activeIndex + 1);
        updateActiveSuggestion();
      }
      e.preventDefault();
    } else if(e.key === 'ArrowUp'){
      const items = suggestions.querySelectorAll('.suggestion-item');
      if(items.length){
        activeIndex = Math.max(0, activeIndex - 1);
        updateActiveSuggestion();
      }
      e.preventDefault();
    }
  });

  input.addEventListener('blur', hideSuggestionsSoon);
  button.addEventListener('click', () => {
    applySearch(input.value);
    hideSuggestionsSoon();
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    applySearch('');
    hideSuggestionsSoon();
  });
}

function escapeHTML(str){
  return String(str).replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}

function highlightText(text, query){
  const i = text.toLowerCase().indexOf(query);
  if(i === -1) return escapeHTML(text);
  const before = escapeHTML(text.slice(0, i));
  const match = escapeHTML(text.slice(i, i + query.length));
  const after = escapeHTML(text.slice(i + query.length));
  return `${before}<mark>${match}</mark>${after}`;
}


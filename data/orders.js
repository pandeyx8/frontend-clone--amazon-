import { formatCurrency } from "../scripts/utils/money.js";
import { getProduct, loadProductsFetch, products } from "./products.js";

export const orders = JSON.parse(localStorage.getItem('orders')) || [] ;

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
  console.log(orders);
}
function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function renderPlaceOrderGrid(){
  let orderContainerHTML = '';
  orders.forEach((order) =>{
  
    orderContainerHTML += `
          <div class="order-container">
            
            <div class="order-header">
              <div class="order-header-left-section">
                <div class="order-date">
                  <div class="order-header-label">Order Placed:</div>
                  <div>${formatDate(order.orderTime)}</div>
                </div>
                <div class="order-total">
                  <div class="order-header-label">Total:</div>
                  <div>${formatCurrency(order.totalCostCents)}</div>
                </div>
              </div>
  
              <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
              </div>
            </div>
  
            <div class="order-details-grid ">
              ${returnOrderDetailsGrid(order.products)}
            </div>
          </div>
    `;
  });
  document.querySelector('.js-order-container').innerHTML = orderContainerHTML;
}

function returnOrderDetailsGrid(orderProducts){

  let orderDetailsGridHTML ='';
  orderProducts.forEach((orderProduct) =>{
    let matchingProduct = getProduct(orderProduct.productId);

    orderDetailsGridHTML += `
        <div class="product-image-container">
          <img src=${matchingProduct.image}>
        </div>

        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${formatDate(orderProduct.estimatedDeliveryTime)}
          </div>
          <div class="product-quantity">
            Quantity: ${orderProduct.quantity}
          </div>
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
    `;
  });
  return orderDetailsGridHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long'
  });
}

async function initOrderPage() {
  const container = document.querySelector('.js-order-container');
  if (!container) return; 
  await loadProductsFetch();
  renderPlaceOrderGrid();
}
initOrderPage();

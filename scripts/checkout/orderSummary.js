import {cart, deleteItemFromCart, calculateCartQuantity, updateItemQuantity, updateDeliveryOption} from '../../data/cart.js';
import { getProduct, products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary(){

  let cartSummaryHTML ='';
  
  cart.forEach((cartItem) => {
  
    const productId = cartItem.productId;
    let matchingItem = getProduct(productId);
  
    let deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    
  
    cartSummaryHTML +=  `
      <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
        <div class="delivery-date">
          Delivery date: ${dayjs().add(deliveryOption.deliveryDays, 'day').format("dddd, MMMM D")}
        </div>
  
        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingItem.image}">
  
          <div class="cart-item-details">
            <div class="product-name">
              ${matchingItem.name}
            </div>
            <div class="product-price">
              $${matchingItem.getPrice()}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id = "${matchingItem.id}">
                Update
              </span>
              <input type ="number" class = "quantity-input js-quantity-input-${matchingItem.id}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id = "${matchingItem.id}">Save</span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${matchingItem.id}">
                Delete
              </span>
            </div>
          </div>
  
          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryHTML(matchingItem.id, deliveryOption.id)}
          </div>
        </div>
      </div>
    `;
  });
  
  function deliveryHTML(matchingItemId, deliveryOptionId){
    let HTML= '';
    deliveryOptions.forEach((deliveryOption) => {
        let isChecked = deliveryOption.id === deliveryOptionId;
        let deliveryDate = dayjs().add(deliveryOption.deliveryDays, 'day').format("dddd, MMMM D");
  
        let deliveryPriceString = deliveryOption.priceCents === 0 ? 'FREE' :  `${formatCurrency(deliveryOption.priceCents)}-`;
  
        HTML += `
        <div class="delivery-option js-delivery-option" data-product-id = "${matchingItemId}" data-delivery-option-id = "${deliveryOption.id}">
          <input type="radio" ${isChecked ? 'checked' : ''}
            class="delivery-option-input" 
            name="delivery-option-${matchingItemId}">
          <div>
            <div class="delivery-option-date">
              ${deliveryDate}
            </div>
            <div class="delivery-option-price">
              ${deliveryPriceString} Shipping
            </div>
          </div>
        </div>
         `;
      })
    return HTML;
  }
  updateCheckoutQuantity();
  
  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;
  
  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () =>{
        const productId = link.dataset.productId;
        deleteItemFromCart(productId);
  
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();
        renderPaymentSummary();
        updateCheckoutQuantity();
      })
    });
    
  
  
  function updateCheckoutQuantity(){
    document.querySelector('.js-chekout-quantity')
      .innerHTML = calculateCartQuantity();
  }
  
  document.querySelectorAll('.js-update-link')
   .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      document.querySelector(`.js-cart-item-container-${productId}`).classList.add("is-editing-quantity");
    })
   })
  
   document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () =>{
        const productId = link.dataset.productId;
        const input = document.querySelector(`.js-quantity-input-${productId}`);
  
        const newQuantity = Number(input.value);
  
        if(!Number.isInteger(newQuantity) || newQuantity < 0 || input.value === ''){
          alert("Please enter a valid quantity (1 or more).");
          return;
        }
        updateItemQuantity(newQuantity, productId);
        document.querySelector(`.js-cart-item-container-${productId}`)
          .classList.remove('is-editing-quantity');
        
          updateCheckoutQuantity();

          renderOrderSummary();
          renderPaymentSummary();
      })
    });
  
  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () =>{
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      })
    });
}


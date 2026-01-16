import {renderOrderSummary} from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import {loadProductsFetch } from '../data/products.js';

//import '../data/cart-class.js'
//import '../data/backend-practice.js';

async function loadPage() {
  try {
    await loadProductsFetch();
    
  } catch(error) {
    console.log('unexpected error. Please try again later');
  }
  
  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();

/*
loadProductsFetch().then(() => {
  renderOrderSummary();
  renderPaymentSummary();
});
*/

/*
loadProducts(() => {
  renderOrderSummary();
  renderPaymentSummary();
});
*/

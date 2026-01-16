 export let cart;
 
 loadFromStorage();
 export function loadFromStorage(){
   cart = JSON.parse(localStorage.getItem('cart')) || [];
   /*
     cart =  [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId : '1'
      }, {
       productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
       quantity: 1,
       deliveryOptionId : '2'
       }];
   */
 }
 export function clearCart() {
  cart.length = 0; // clear array in-place
  localStorage.removeItem('cart');
 }
 
function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function deleteItemFromCart(productId){
  cart.forEach((cartItem, idx) => {
    if(cartItem.productId === productId){
      cart.splice(idx, 1);
    }
  });
  saveToStorage();
};

 export function addToCart(productId){
  let matchingItem;
  cart.forEach((cartItem) => {
    if(cartItem.productId === productId){
      matchingItem = cartItem;
    }
  });

  if(matchingItem){
    matchingItem.quantity += 1;
  }else{
    cart.push({
      productId : productId,
      quantity : 1,
      deliveryOptionId : '1'
    });
  }
  saveToStorage();
}

export function calculateCartQuantity(){
  let cartQauntity = 0;
  cart.forEach((cartItem) => {
    cartQauntity += cartItem.quantity;
  })
  return cartQauntity;
}

export function updateItemQuantity(newQuantity, productId){
  cart.forEach((cartItem) => {
    if(cartItem.productId === productId) cartItem.quantity = newQuantity;
    saveToStorage();
  })
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if(cartItem.productId === productId){
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}
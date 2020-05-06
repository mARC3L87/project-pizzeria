import {select} from '../settings.js';
import AmountWidget from './AmountWidget.js';

class CartProduct{
  constructor(menuProduct, element){
    const thisCartProduct = this;
      
    thisCartProduct.id = menuProduct.id;
    //console.log('cart product id:', thisCartProduct.id);
    thisCartProduct.name = menuProduct.name;
    //console.log('cart product name:', thisCartProduct.name);
    thisCartProduct.price = menuProduct.defaultPrice;
    //console.log('cart product price:', thisCartProduct.price);
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    //console.log('cart product single price:', thisCartProduct.priceSingle);
    thisCartProduct.amount = menuProduct.amount;
    //console.log('cart product amount:', thisCartProduct.amount);
    thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
    //console.log('this cart params:', thisCartProduct.params);
     
    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
    console.log('cartProduct:', thisCartProduct);
    //console.log('productData:', menuProduct);
  }
  getElements(element){
    const thisCartProduct = this;
    thisCartProduct.dom = {};
    thisCartProduct.dom.wrapper = element;
    //console.log('thisCartProduct.dom.wrapper', thisCartProduct.dom.wrapper);
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    //console.log('thisCartProduct.dom.amountWidget:', thisCartProduct.dom.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    //console.log('thisCartProduct.dom.price:', thisCartProduct.dom.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    //console.log('thisCartProduct.dom.edit:', thisCartProduct.dom.edit)
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    //console.log('thisCartProduct.dom.remove:', thisCartProduct.dom.remove);
  }
  initAmountWidget(){
    const thisCartProduct = this;
    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
    //console.log('init amount:', thisCartProduct.amountWidget);
    thisCartProduct.dom.amountWidget.addEventListener('updated', function(){
      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      //console.log('thisCartProduct.amount:', thisCartProduct.amount);
      thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
      //console.log('thisCartProduct price:', thisCartProduct.price); 
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price; 
    //console.log('thisCartProduct.dom.price.innerHTML:', thisCartProduct.dom.price);
    });
  }
  remove(){
    const thisCartProduct = this;
    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      }, 
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }
  initActions(){
    const thisCartProduct = this;
    thisCartProduct.dom.edit.addEventListener('click', function(){});
    thisCartProduct.dom.remove.addEventListener('click', function(){
      thisCartProduct.remove();
      //console.log('remove:', thisCartProduct.remove());
    });
  }
  getData(){
    const thisCartProduct = this;
    const productData = {
      id: thisCartProduct.id,
      name: thisCartProduct.name,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      amount: thisCartProduct.amount,
      params: thisCartProduct.params,
    };
    console.log('product data: ', productData);
    return productData;
  }
}

export default CartProduct;
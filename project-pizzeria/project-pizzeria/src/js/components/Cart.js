import {select, settings, templates} from '../settings.js';
import {utils} from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = [];
      
    thisCart.getElements(element);
    thisCart.initActions();
    //console.log('init actions:', thisCart.initActions());
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    //console.log('delivery fee:', thisCart.deliveryFee);
    console.log('new Cart:', thisCart);
  }
  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    //console.log('thisCart wrapper:', thisCart.dom.wrapper);
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    //console.log('thisCart trigger:', thisCart.dom.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    //console.log('cart product list:', thisCart.dom.productList);
    thisCart.renderTotalKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
    for(let key of thisCart.renderTotalKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    //console.log('car form:', thisCart.dom.form);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    //console.log('cart address:', thisCart.dom.address);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    //console.log('cart phone:', thisCart.dom.phone);
  }
  initActions(){
    const thisCart = this;
    //console.log('action cart:', thisCart);
    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle('active');
    });
    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(){
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  add(menuProduct){
    const thisCart = this;
    //console.log('adding product:', menuProduct);
    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);
    //console.log('generateHTML: ', generatedHTML);
    /* create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    //console.log('generated dom:', generatedDOM);
    /* add element to cart */
    thisCart.dom.productList.appendChild(generatedDOM);
    //console.log('cart add:', thisCart.dom.productList.appendChild(generatedDOM));
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    //console.log('thisCart.products:', thisCart.products);
    thisCart.update();
  }
  update(){
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
      
    for(let product of thisCart.products){
      console.log('product:', product);
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    //console.log('total number:', thisCart.totalNumber);
    //console.log('subtotal price:', thisCart.subtotalPrice);
    //console.log('total price:', thisCart.totalPrice);
    for(let key of thisCart.renderTotalKeys){
      for(let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }
  }
  remove(cartProduct){
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
    console.log('index', index);
    thisCart.products.splice(index, 1);
    console.log('splice:', thisCart.products);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }
  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      products: [],
      address: thisCart.dom.address,
      phone: thisCart.dom.phone,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee, 
      totalPrice: thisCart.totalPrice,
    };
    for(let products of thisCart.products){
      console.log('products', products);
      products.getData();
      payload.products.push(products);
    }


    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
}
export default Cart;
/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();

      //console.log('new Product: ', thisProduct);
      //console.log('this product data:', thisProduct.data);
    }
    renderInMenu(){
      const thisProduct = this;

      /* generate HTML based on template */
      const generateHTML = templates.menuProduct(thisProduct.data);
      //console.log('generateHTML: ', generateHTML);
      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generateHTML);
      //console.log(thisProduct.element);
      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      //console.log('menuContainer: ', menuContainer);
      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
      //console.log(menuContainer.appendChild(thisProduct.element));

    }

    getElements(){
      const thisProduct = this;
      
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      //console.log('this form: ', thisProduct.form);
      thisProduct.formInputs = thisProduct.element.querySelectorAll(select.all.formInputs);
      //console.log('this form inputs: ', thisProduct.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      //console.log('cart:', thisProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      //console.log('price:', thisProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      //console.log('image: ', thisProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
      //console.log('widget:', thisProduct.amountWidgetElem);
    }
    initAccordion(){
      const thisProduct = this;
      //console.log('this product:', thisProduct);
      /* find the clickable trigger (the element that should react to clicking */
      const accordionTrigger = thisProduct.accordionTrigger;
      //console.log('accordion trigger: ', accordionTrigger);
      /* START: click event listener to trigger */
      accordionTrigger.addEventListener('click', function(event){
        /* prevent default action for event */
        event.preventDefault();
        /* toggle active class on elememt of thisProduct */
        thisProduct.element.classList.toggle('active');
        /* find all active products */
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
        //console.log('active products: ', activeProducts);
        /* START LOOP: for each active product */
        for(let activeProduct of activeProducts){
          //console.log('active product:', activeProduct);
          /* START: if the active product isn't the element of thisProduct */
          if(activeProduct != thisProduct.element){
            //console.log('activeProduct: ', activeProduct);
            //console.log('this element:', thisProduct.element);
            /* remove class active for the active product */
            activeProduct.classList.remove('active');
          /* END: if the active product isn't the element of thisProduct */
          }
        /* END LOOP: for each active product */
        }
      /* END: click event listener to trigger */
      });
    }
    initOrderForm(){
      const thisProduct = this;
      //console.log('order form:', thisProduct);
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });

      for(let input of thisProduct.formInputs){
        //console.log('input:', input);
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }
    processOrder(){
      const thisProduct = this;
      //console.log('process order:', thisProduct);
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData:', formData);
      thisProduct.params = {};
      /* create variable with default price */
      let defaultPrice = thisProduct.data.price;
      //console.log('defaultPrice: ', defaultPrice);
      /*START LOOP: for each paramId in thisProduct.data.params */
      for(let paramId in thisProduct.data.params){
        //console.log('paramId:', paramId);
        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId];
        //console.log('param:', param);
        /*START LOOP: for each optionId in param.options */
        for(let optionId in param.options){
          //console.log('option Id:', optionId);
          /* save the element in param.options with key optionId as a const option */
          const option = param.options[optionId];
          //console.log('option:', option);
          /* START IF: if option is selected and option is not default */
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          //console.log('optionSelected:', optionSelected);
          if(optionSelected && !option.default){
            /* add price of option to variable price */
            defaultPrice += option.price;
            /* END IF: if option is selected and option is not default */
          }
          /* START ELSE IF: if option is not selected and option is default */
          else if(!optionSelected && option.default){
            /* deduct price of option from price */
            defaultPrice -= option.price;
            /* END ELSE IF: if option is not selected and option is default */
          }
          /* create new const imageSelected with all img */
          const imageVisibility = classNames.menuProduct.imageVisible;
          //console.log('image visibility: ', imageVisibility);
          const imageSelected = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
          //console.log('imageSelected:', imageSelected);
          /* START IF: if option is selected */
          if(optionSelected){
            if(!thisProduct.params[paramId]){
              thisProduct.params[paramId] = {
                label: param.label,
                options: {},
              };
            }
            thisProduct.params[paramId].options[optionId] = option.label;
            /* START LOOP: for each image */
            for(let image of imageSelected){
              //console.log('image:', image);
              image.classList.add(imageVisibility);
              /* END LOOP: for each image */
            }
            /* END IF: if option is selected */
          }
          /* START ELSE: if option is not selected */
          else {
            /* START LOOP: for each image */
            for(let image of imageSelected){
              image.classList.remove(imageVisibility);
              /*END LOOP: for each image */
            }
            /* END ELSE: if option is not selected */
          }
        /* END LOOP: for each optionId in param.options */
        }
      /*END LOOP: for each paramId in thisProduct.data.params */
      }
      /* multiply price by amount */
      //defaultPrice *= thisProduct.amountWidget.value;
      thisProduct.priceSingle = defaultPrice;
      //console.log('thisProduct Single:', thisProduct.priceSingle);
      thisProduct.defaultPrice = thisProduct.priceSingle * thisProduct.amountWidget.value;
      //console.log('thisProduckt default price:', thisProduct.defaultPrice);
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem.innerHTML = thisProduct.defaultPrice;
      //console.log('price elem html:', thisProduct.priceElem.innerHTML);
      //console.log('thisProduct params:', thisProduct.params);
    }
    initAmountWidget(){
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      //console.log('init amount:', thisProduct.amountWidget);
      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      });
    }
    addToCart(){
      const thisProduct = this;
      thisProduct.name = thisProduct.data.name;
      //console.log('product name:', thisProduct.name);
      thisProduct.amount = thisProduct.amountWidget.value;
      //console.log('product amount:', thisProduct.amount);
      thisProduct.price = thisProduct.defaultPrice;
      //console.log('product price:', thisProduct.price);
      app.cart.add(thisProduct);
    }
  }
  class AmountWidget{
    constructor(element){
      const thisWidget = this;
      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();
      //console.log('AmountWidget:', thisWidget);
      //console.log('constructor arguments: ', element);
    }
    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      //console.log('widgetelement: ', thisWidget.element);
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      //console.log('widget input:', thisWidget.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      //console.log('widget decrease:', thisWidget.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
      //console.log('widget increase:', thisWidget.linkIncrease);
    }
    setValue(value){
      const thisWidget = this;

      const newValue = parseInt(value);
      //console.log('new value:', newValue);
      /* TODO: Add validation */
      if(newValue != thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax){
        thisWidget.value = newValue;
        thisWidget.announce();
      }
      thisWidget.input.value = thisWidget.value;
      //console.log(' widget input value:', thisWidget .input.value);
    }
    initActions(){
      const thisWidget = this;
      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.input.value);
      });
      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });

    }
    announce(){
      const thisWidget = this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      //console.log('event:', event);
      thisWidget.element.dispatchEvent(event);
    }
  
  }
  class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];
      
      thisCart.getElements(element);
      thisCart.initActions();
      //console.log('init actions:', thisCart.initActions());
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      console.log('delivery fee:', thisCart.deliveryFee);
      //console.log('new Cart:', thisCart);
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
      console.log('total number:', thisCart.totalNumber);
      console.log('subtotal price:', thisCart.subtotalPrice);
      console.log('total price:', thisCart.totalPrice);
      for(let key of thisCart.renderTotalKeys){
        for(let elem of thisCart.dom[key]){
          elem.innerHTML = thisCart[key];
        }
      }
    }
  }
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
      //console.log('cartProduct:', thisCartProduct);
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
   
  }
  const app = {
    initMenu: function(){
      const thisApp = this;
      //console.log('thisApp.data:', thisApp.data);
      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
        //console.log('product data:', thisApp.data.products[productData]);
      }
      //const testProduct = new Product();
      //console.log('test Product: ', testProduct);
      //console.log('this app data:', thisApp.data);
    },
    initData: function(){
      const thisApp = this;
      //console.log('thisApp:', thisApp);
      thisApp.data = dataSource;
    },
    initCart: function(){
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      //console.log('cartElem:', cartElem);
      thisApp.cart = new Cart(cartElem);
      //console.log('thisApp cart:', thisApp.cart);
    },
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };

  app.init();
}

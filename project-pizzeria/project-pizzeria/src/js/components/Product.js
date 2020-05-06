import {select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';

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
    //app.cart.add(thisProduct);
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;
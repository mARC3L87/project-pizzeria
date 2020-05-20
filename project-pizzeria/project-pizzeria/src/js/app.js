import {settings, select, classNames, templates} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initPages: function(){
    const thisApp = this;
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    thisApp.orderLink = document.getElementById('order-link');
    thisApp.bookLink = document.getElementById('book-link');
    const idFromHash = window.location.hash.replace('#', '');
    let pageMatchingHash = thisApp.pages[0].id;
    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);
    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');
        /*run thisApp.activatePage with that id */ 
        thisApp.activatePage(id);
        /*change URL hash */
        window.location.hash = '#/' + id;
      });
    }
    thisApp.orderLink.addEventListener('click', function(event){
      const clickedElement = this;
      event.preventDefault();
      const id = clickedElement.getAttribute('href').replace('#', '');
      thisApp.activatePage(id);
      window.location.hash = '#/' + id;
    });
    thisApp.bookLink.addEventListener('click', function(event){
      const clickedElement = this;
      event.preventDefault();
      const id = clickedElement.getAttribute('href').replace('#', '');
      thisApp.activatePage(id);
      window.location.hash = '#/' + id;
    });
  },
  activatePage: function(pageId){
    const thisApp= this;
    /* add class 'active' to matching pages, remove from non-matching */
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /* add class 'active' to matching links, remove from non-matching */
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },
  initMenu: function(){
    const thisApp = this;
    //console.log('thisApp.data:', thisApp.data);
    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      //console.log('product data:', thisApp.data.products[productData]);
    }
    //const testProduct = new Product();
    //console.log('test Product: ', testProduct);
    //console.log('this app data:', thisApp.data);
  },
  initData: function(){
    const thisApp = this;
    //console.log('thisApp:', thisApp);
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  initCart: function(){
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
  initBooking: function(){
    const thisApp = this;
    const bookingContainer = document.querySelector(select.containerOf.booking);
    console.log('booking container:', bookingContainer);
    thisApp.booking = new Booking(bookingContainer);
  },
  initCarousel: function(){
    let currentSlide = 0; 
    // eslint-disable-next-line no-undef
    carouselReviewSlides();
    function carouselReviewSlides() {
      let i;
      const reviewSlides = document.querySelectorAll(classNames.slider.sliderReview);
      const dots = document.querySelectorAll(classNames.slider.dots);
      //console.log(dots);
      for (i = 0; i < reviewSlides.length; i++) {
        reviewSlides[i].style.display = 'none';
      }
      
      if (currentSlide < reviewSlides.length) {
        currentSlide++;
      } else {
        currentSlide = 1;
      }
      for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active'); 
       
      }
      reviewSlides[currentSlide - 1].style.display = 'block';
      dots[currentSlide - 1].classList.add('active'); 
      setTimeout(carouselReviewSlides, 3000);
    } 
    
  },
  init: function(){
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initCarousel();
  },
};

app.init();


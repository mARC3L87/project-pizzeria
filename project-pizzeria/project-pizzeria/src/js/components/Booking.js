import {templates, select} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';
class Booking{
  constructor(bookingContainer){
    const thisBooking = this;
    thisBooking.render(bookingContainer);
    thisBooking.initWidgets();
  }
  render(bookingContainer){
    const thisBooking = this;
    /* generate HTML based on template */
    const generatedHTML = templates.bookingWidget();
    /*create empty object thisBooking.dom */
    thisBooking.dom = {};
    /* add value 'wrapper' to thisBooking.dom equal to the argument */
    thisBooking.dom.wrapper = bookingContainer;
    //console.log('thisBooking wrapper:', thisBooking.dom.wrapper);
    /* create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    /* change wrapper content to HTML generated from template */
    thisBooking.dom.wrapper.appendChild(generatedDOM);
    //console.log('this booking HTML:', thisBooking.dom.wrapper.appendChild(generatedDOM));
    /* in thisBooking.dom.peopleAmount save single element from wrapper */
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    //console.log('thisBooking people amount:', thisBooking.dom.peopleAmount);
    /* in thisBooking.dom.hoursAmount save single element from wrapper */
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    //console.log('booking hours:', thisBooking.dom.hoursAmount);
  }
  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount)
    //console.log('people amount:', thisBooking.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    //console.log('hours amount:', thisBooking.hoursAmount);
  }
}
export default Booking;
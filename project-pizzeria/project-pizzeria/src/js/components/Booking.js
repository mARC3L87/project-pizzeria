import {templates, select} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
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
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    //console.log('booking date:', thisBooking.dom.datePicker);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    //console.log('hour picker:', thisBooking.dom.hourPicker);
  }
  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    //console.log('people amount:', thisBooking.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    //console.log('hours amount:', thisBooking.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    //console.log('date picker:', thisBooking.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    //console.log('hour:', thisBooking.hourPicker);
  }
}
export default Booking;
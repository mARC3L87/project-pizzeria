import {templates, select, settings, classNames} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking{
  constructor(bookingContainer){
    const thisBooking = this;
    thisBooking.render(bookingContainer);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.selectTable();
  }
  getData(){
    const thisBooking = this;
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);


    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };
    //console.log('params:', params);
    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event   + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event   + '?' + params.eventsRepeat.join('&'),
    };
    //console.log('urls:', urls);
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        console.log(bookings);
        console.log(eventsCurrent);
        console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }
  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;
    thisBooking.booked = {};

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.date, item.hour, item.duration, item.table);
        }
      }
    }
    //console.log('thisBooking.booked', thisBooking.booked);
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table){
    const thisBooking = this;
    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour); 
    //console.log('startHour:', hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      //console.log('loop', hourBlock);
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  updateDOM(){
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value;
    //const parsedHour = thisBooking.hourPicker.parseValue(thisBooking.hourPicker.value);
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    let allAvailable = false;
    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }
    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }
      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) > -1
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
    thisBooking.rangeSlider();
  }
  render(bookingContainer){
    const thisBooking = this;
    /* generate HTML based on template */
    const generatedHTML = templates.bookingWidget();
    /*create empty object thisBooking.dom */
    thisBooking.dom = {};
    /* add value 'wrapper' to thisBooking.dom equal to the argument */
    thisBooking.dom.wrapper = bookingContainer;
    /* create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    /* change wrapper content to HTML generated from template */
    thisBooking.dom.wrapper.appendChild(generatedDOM);
    /* in thisBooking.dom.peopleAmount save single element from wrapper */
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    /* in thisBooking.dom.hoursAmount save single element from wrapper */
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.bookTable = thisBooking.dom.wrapper.querySelector(select.booking.bookTable);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
  }
  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
   
    thisBooking.dom.bookTable.addEventListener('click', function(event){
      event.preventDefault();
      thisBooking.sendBooking();
      thisBooking.getData();
    });
    
  }
  selectTable() {
    const thisBooking = this;
    
    for(let table of thisBooking.dom.tables){
      table.addEventListener('click',function(){
        let selectedTable = table.classList.contains(classNames.booking.tableBooked);
        if(!selectedTable){
          table.classList.add(classNames.booking.tableBooked);
          thisBooking.selectTableId = table.getAttribute(settings.booking.tableIdAttribute);
          thisBooking.selectTableId = parseInt(thisBooking.selectTableId );
        }
      });
    }
  }
  sendBooking(){
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;

    const sendPayload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.selectTableId,
      duration: thisBooking.hoursAmount.value,
      ppl: thisBooking.peopleAmount.value,
      starters: [],
      address: thisBooking.dom.address.value,
      phone: thisBooking.dom.phone.value,
    };
    for(let starter of thisBooking.dom.starters){
      if(starter.checked == true){    
        sendPayload.starters.push(starter.value);
      }
    }
    console.log('sendPayload', sendPayload);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendPayload),
    };
    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
        //thisBooking.makeBooked(sendPayload.date, sendPayload.hour, sendPayload.duration, sendPayload.table);
      });
  }
  rangeSlider(){
    const thisBooking = this;
    const bookedRange = thisBooking.booked[thisBooking.date];
    const colors = [];

    const rangeSlider  = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.rangeSlider);

    for (let bookedTime in bookedRange) {
      
      const min = 12;
      const max = 24;
      const step = 0.5;
      const startValue = (((bookedTime - min) * 100) / (max - min)); 
      const endValue = (((bookedTime - min) + step ) * 100) / (max - min); 

      if (bookedTime < max) {

        if (bookedRange[bookedTime].length <=  1 ) {
          colors.push ('/*' + bookedTime + '*/green ' + startValue + '%, green ' + endValue + '%');
        } else if (bookedRange[bookedTime].length === 2) {
          colors.push ('/*' + bookedTime + '*/orange ' + startValue + '%, orange ' + endValue + '%');
        } else if (bookedRange[bookedTime].length === 3) {
          colors.push ('/*' + bookedTime + '*/red ' + startValue + '%, red ' + endValue + '%'); 
        }
      }
    }
    
    colors.sort();
    const pushedColors = colors.join();
    rangeSlider.style.background = 'linear-gradient(to right, ' + pushedColors + ')';
  }
}

export default Booking;
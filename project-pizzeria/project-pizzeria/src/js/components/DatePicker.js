import BaseWidget from './BaseWidget.js';
import {select, settings} from '../settings.js';
import {utils} from '../utils.js';

class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    //console.log('date input:', thisWidget.dom.input);
    thisWidget.initPlugin(); 

  }
  initPlugin(){
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);
    //console.log('thisWidget.minDate:', thisWidget.minDate);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    //console.log('thisWidget.maxDate:', thisWidget.maxDate);
    
    // eslint-disable-next-line no-undef
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      locale: {
        'firstDayOfWeek': 1
      },
      disable: [
        function(date){
          return (date.getDay() === 1);
        }
      ],
      onChange: function(dateStr){
        thisWidget.value = dateStr;
        //console.log('on change:', thisWidget.value);
      },
      dateFormat: 'Y-m-d',
    });
  }
  parseValue(value){
    return value;

  }
  isValid(){
    return true;

  }
  renderValue(){

  }
}
export default DatePicker;


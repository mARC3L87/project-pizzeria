import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';
class AmountWidget extends BaseWidget{
  constructor(element){
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;
    thisWidget.getElements(element);
    //thisWidget.value = settings.amountWidget.defaultValue;
    //thisWidget.setValue(thisWidget.dom.input.value);
    thisWidget.initActions();
    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments: ', element);
  }
  getElements(){
    const thisWidget = this;

    //thisWidget.dom.wrapper = element;
    //console.log('widgetelement: ', thisWidget.dom.wrapper);
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    //console.log('widget input:', thisWidget.dom.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    //console.log('widget decrease:', thisWidget.dom.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    //console.log('widget increase:', thisWidget.dom.linkIncrease);
  }
 
  isValid(value){
    return !isNaN(value) 
     && value >= settings.amountWidget.defaultMin
     && value <= settings.amountWidget.defaultMax;
  }
  renderValue(){
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
    //console.log(' widget input value:', thisWidget .input.value);
  }
  initActions(){
    const thisWidget = this;
    thisWidget.dom.input.addEventListener('change', function(){
      //thisWidget.setValue(thisWidget.dom.input.value);
      thisWidget.value = thisWidget.dom.input.value;
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
}
export default AmountWidget;
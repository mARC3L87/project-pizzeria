import {settings, select} from '../settings.js';

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
export default AmountWidget;
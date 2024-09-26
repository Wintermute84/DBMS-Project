import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { getDeliveryOption } from '../deliveryOptions.js';

export function isWeekend(date){
  const day = date.format('dddd');
  if(day === 'Saturday'){
    return date.add(2,'days');
  }
  else if(day === 'Sunday'){
    return date.add(1,'days');
  }
  else return date;
}


export function calculateDeliveryDate(today, deliveryOption){
  let date = today;
  let deliveryDays = deliveryOption.deliveryDays;
  while(deliveryDays > 0){
    date = date.add(1,'days');
    date = isWeekend(date);
    deliveryDays--;
  }
  return date;
}

export function calculateDate(deliveryOption){
      const today = dayjs();
      const deliveryDate = calculateDeliveryDate(today, deliveryOption);
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );
      return dateString;
}

export function calculateFormattedDate(deliveryOptionId){
  const today = dayjs();
  const deliveryOption = getDeliveryOption(deliveryOptionId);
  console.log(deliveryOption);
  const deliveryDate = calculateDeliveryDate(today, deliveryOption);
  const formattedDate = deliveryDate.format('DD-MM-YYYY');
  return formattedDate;
}

export function FormattedDate(){
  const today = dayjs();
  const formattedDate = today.format('DD-MM-YYYY');
  return formattedDate;
}


export function OrderFormattedDate(orderDate){     //converts date in dd-mm-yyyy format to Month Month-day format
  // Original date string in 'DD-MM-YYYY' format
let dateStr = orderDate;

// Split the date string into day, month, and year
let [day, month, year] = dateStr.split('-');

// Create a Date object (month is 0-indexed in JS, so subtract 1 from the month)
let date = new Date(year, month - 1, day);

// Options for formatting the date to 'Month Day' format
let options = { month: 'long', day: 'numeric' };

// Format the date
let formattedDate = date.toLocaleDateString('en-US', options);

console.log(formattedDate); // Outputs: 'September 25'

return formattedDate;
}


//calculate product status
// Function to convert 'dd-mm-yyyy' to a Date object
export function parseDate(dateString) {
  const [day, month, year] = dateString.split('-');
  return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript
}

export function calculateStatus(arrivalDate){
      // Two date strings in 'dd-mm-yyyy' format
      const date1 = arrivalDate;
      const date2 = FormattedDate();

      // Convert the date strings to Date objects
      const d1 = parseDate(date1);
      const d2 = parseDate(date2);

      // Compare the dates
      if (d1 > d2) {
        return 'Delivering on : ';
      } else{
        return 'Arrived on : ';
      } 
}
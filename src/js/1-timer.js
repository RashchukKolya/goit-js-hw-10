import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputDate = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

startBtn.addEventListener('click', startTimer);

let intervalID = null;
let currentDate = null;
let userSelectedDate = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    checkDate(selectedDates);
  },
};

function checkDate(selectedDates) {
  userSelectedDate = selectedDates[0].getTime();
  currentDate = new Date().getTime();
  if (userSelectedDate > currentDate) {
    startBtn.disabled = false;
  } else {
    iziToast.show({
      message: 'Please choose a date in the future',
    });
  }
}

function startTimer() {
  intervalID = setInterval(() => {
    currentDate = new Date().getTime();
    if (userSelectedDate - currentDate > 1000) {
      startBtn.disabled = true;
      inputDate.disabled = true;
      currentDate += 1000;
      convertMs(Math.floor(userSelectedDate - currentDate));
    } else {
      clearInterval(intervalID);
      inputDate.disabled = false;
    }
  }, 1000);
}

function addLeadingZero(value) {
  return `${value}`.padStart('2', '0');
}

function createMarkup({ days, hours, minutes, seconds }) {
  daysValue.textContent = days;
  hoursValue.textContent = hours;
  minutesValue.textContent = minutes;
  secondsValue.textContent = seconds;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );
  createMarkup({ days, hours, minutes, seconds });
  return { days, hours, minutes, seconds };
}

flatpickr('#datetime-picker', options);

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const inputElem = document.querySelector('#datetime-picker')
const btnElem = document.querySelector('[data-start]')
btnElem.setAttribute('disabled', true)

let userDate;
let timerId;

const boxTime = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    userDate = selectedDates[0].getTime();
    if (userDate < Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: "topRight"
      });
      btnElem.setAttribute('disabled', true);
    } else {
      btnElem.removeAttribute('disabled')
    }
  },
};

flatpickr(inputElem, options)

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(time) {
  return {
    days: String(time.days).padStart(2, "0"),
    hours: String(time.hours).padStart(2, "0"),
    minutes: String(time.minutes).padStart(2, "0"),
    seconds: String(time.seconds).padStart(2, "0"),
  }
}

function updateTimer(time, htmlObj) {
  Object.keys(htmlObj).forEach((key) => {
    htmlObj[key].textContent = time[key]
  });
}

function resetTimer() {
  updateTimer({ days: '00', hours: '00', minutes: '00', seconds: '00' }, boxTime);
  btnElem.removeAttribute('disabled');
  inputElem.removeAttribute('disabled');
}

btnElem.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId);
  }

  timerId = startTimer();

  function startTimer() {
    return setInterval(() => {
      let defTime = userDate - Date.now();
      let time = convertMs(defTime);

      if (defTime <= 0) {
        clearInterval(timerId);
        resetTimer();
        return;
      }
      
      let valueTimer = addLeadingZero(time);
      updateTimer(valueTimer, boxTime);
    }, 1000);
  }

  btnElem.setAttribute('disabled', true);
  inputElem.setAttribute('disabled', true);
});
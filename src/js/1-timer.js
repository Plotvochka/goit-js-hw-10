import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const elements = {
  input: document.querySelector('#datetime-picker'),
  btn: document.querySelector('[data-start]'),
  daysValue: document.querySelector('[data-days]'),
  hoursValue: document.querySelector('[data-hours]'),
  minutesValue: document.querySelector('[data-minutes]'),
  secondsValue: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let countdownInterval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      elements.btn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      elements.btn.disabled = false;
    }
  },
};

flatpickr(elements.input, options);

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

const addLeadingZero = value => String(value).padStart(2, '0');

const updateTimerDisplay = ({ days, hours, minutes, seconds }) => {
  elements.daysValue.textContent = addLeadingZero(days);
  elements.hoursValue.textContent = addLeadingZero(hours);
  elements.minutesValue.textContent = addLeadingZero(minutes);
  elements.secondsValue.textContent = addLeadingZero(seconds);
};
const startTimer = () => {
  countdownInterval = setInterval(() => {
    const now = new Date();
    const timeLeft = userSelectedDate - now;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      dateTimePicker.disabled = false;
      return;
    }

    const timeComponents = convertMs(timeLeft);
    updateTimerDisplay(timeComponents);
  }, 1000);
};

elements.btn.addEventListener('click', () => {
  if (!userSelectedDate) {
    return;
  }

  elements.btn.disabled = true;
  elements.input.disabled = true;
  startTimer();
});

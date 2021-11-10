const registration = document.querySelector('.registration');
const form = registration.querySelector('.main-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  registration.classList.toggle('registration_ended', true);
});
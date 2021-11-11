const registration = document.querySelector('.registration');
const form = registration.querySelector('.main-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  window.location.href = 'http://localhost/task1/end';
});
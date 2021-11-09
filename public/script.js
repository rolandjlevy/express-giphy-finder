const $ = (el) => document.querySelector(el);
const submitButton = $('button[type=submit]');

const validate = (e) => {
  submitButton.disabled = !e.value.length
}
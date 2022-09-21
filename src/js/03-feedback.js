import throttle from 'lodash.throttle';

const form = document.querySelector('.feedback-form');
const saveFormKey = 'feedback-form-state';

const handleSubmit = event => {
  event.preventDefault();
  console.log(getFormData(event));
  localStorage.removeItem(saveFormKey);
  event.currentTarget.reset();
};

const getFormData = event => {
  if (event.currentTarget) {
    const { email, message } = event.currentTarget.elements;
    const formData = {
      email: email.value,
      message: message.value,
    };
    return formData;
  }
};

const save = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error('Set state error: ', error.message);
  }
};

const load = key => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch (error) {
    console.error('Get state error: ', error.message);
  }
};

const setInputValue = () => {
  const formData = load(saveFormKey);
  if (formData !== undefined) {
    const { email, message } = form.elements;
    email.value = formData.email;
    message.value = formData.message;
  }
};

setInputValue();
form.addEventListener('submit', handleSubmit);
form.addEventListener(
  'input',
  throttle(event => {
    const formData = getFormData(event);

    if (formData !== undefined) {
      save(saveFormKey, formData);
    }
  }, 500)
);

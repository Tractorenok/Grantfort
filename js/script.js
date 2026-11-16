const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const menuClose = menu.querySelector('.menu__close');

function openMenu() {
  menu.classList.add('is-open');
  burger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  menuClose.focus();
}

function closeMenu() {
  if (!menu.classList.contains('is-open')) {
    return;
  }
  menu.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

burger.addEventListener('click', openMenu);
menuClose.addEventListener('click', () => {
  closeMenu();
  burger.focus();
});
menu.querySelector('.menu__overlay').addEventListener('click', closeMenu);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});


const page = document.querySelector('.page');
const header = document.querySelector('.header');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const TRANSITION_TIME = 420;

function setPageOrigin() {
  const rect = page.getBoundingClientRect();
  page.style.transformOrigin = `50% ${window.innerHeight / 2 - rect.top}px`;
}

function scrollToSection(target) {
  const top = target.id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
  window.scrollTo({ top, behavior: 'instant' });
}

function goToSection(target, x, y) {
  closeMenu();

  if (reduceMotion.matches) {
    scrollToSection(target);
    return;
  }

  document.body.style.setProperty('--x', `${x}px`);
  document.body.style.setProperty('--y', `${y}px`);
  setPageOrigin();
  document.body.classList.add('is-leaving');

  setTimeout(() => {
    document.body.classList.remove('is-leaving');
    scrollToSection(target);
    setPageOrigin();
    document.body.classList.add('is-arriving');

    target.classList.remove('arrive');
    void target.offsetWidth;
    target.classList.add('arrive');

    setTimeout(() => {
      document.body.classList.remove('is-arriving');
    }, TRANSITION_TIME * 1.4);
  }, TRANSITION_TIME);
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) {
    return;
  }

  const target = document.getElementById(link.getAttribute('href').slice(1));
  if (!target) {
    return;
  }

  event.preventDefault();
  const x = event.clientX || window.innerWidth / 2;
  const y = event.clientY || window.innerHeight / 2;
  goToSection(target, x, y);
});


const models = document.querySelectorAll('.model');
const mobileQuery = window.matchMedia('(max-width: 1100px)');

models.forEach((model) => {
  model.addEventListener('click', () => {
    if (mobileQuery.matches || model.classList.contains('is-active')) {
      return;
    }
    models.forEach((item) => item.classList.toggle('is-active', item === model));
  });
});


const materials = {
  steel: { title: 'AISI 304, зеркальная полировка', formValue: 'AISI 304' },
  powder: { title: 'Чёрный металл, порошковое покрытие', formValue: 'Порошок' },
};

const kits = {
  t9: {
    name: 'JAC T9',
    time: '5–7 дней',
    prices: { steel: '28 500', powder: '39 900' },
    photos: {
      steel: ['img/kits/jac-t9-steel-front.jpg', 'img/kits/jac-t9-steel-rear.jpg'],
      powder: ['img/kits/jac-t9-black-front.jpg', 'img/kits/jac-t9-black-rear.jpg'],
    },
  },
  h3: {
    name: 'Haval H3',
    time: '5–7 дней',
    prices: { steel: '34 900', powder: '49 900' },
    photos: {
      steel: ['img/kits/haval-h3-steel-front.jpg', 'img/kits/haval-h3-steel-rear.jpg'],
      powder: ['img/kits/haval-h3-black-front.jpg', 'img/kits/haval-h3-black-rear.jpg'],
    },
  },
};

const modal = document.querySelector('.modal');
const modalTitle = modal.querySelector('.modal__title');
const modalPhoto = modal.querySelector('.modal__photo img');
const modalThumbs = modal.querySelector('.modal__thumbs');
const modalOrderLink = modal.querySelector('.modal__bottom .btn');
const modalMaterialButtons = modal.querySelectorAll('.modal__switch .switch__btn');
const modalMaterial = modal.querySelector('.modal__material');
const modalTime = modal.querySelector('.modal__time');
const modalPrice = modal.querySelector('.modal__price');

let currentKit = null;
let currentMaterial = 'steel';

function setMaterial(material) {
  currentMaterial = material;

  modalMaterialButtons.forEach((button) => {
    const isActive = button.dataset.material === material;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  modalMaterial.textContent = materials[material].title;
  modalPrice.textContent = currentKit.prices[material];
  showPhotos(currentKit.photos[material]);
}

modalMaterialButtons.forEach((button) => {
  button.addEventListener('click', () => setMaterial(button.dataset.material));
});

function setModalPhoto(src) {
  modalPhoto.src = src;
  modalThumbs.querySelectorAll('.modal__thumb').forEach((thumb) => {
    thumb.classList.toggle('is-active', thumb.dataset.src === src);
  });
}

function showPhotos(photos) {
  modalThumbs.innerHTML = '';
  photos.forEach((src, index) => {
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'modal__thumb';
    thumb.dataset.src = src;
    thumb.setAttribute('aria-label', `Фото ${index + 1}`);
    thumb.innerHTML = `<img src="${src}" alt="">`;
    thumb.addEventListener('click', () => setModalPhoto(src));
    modalThumbs.append(thumb);
  });

  setModalPhoto(photos[0]);
}

function openKit(id) {
  const kit = kits[id];
  currentKit = kit;

  modalTitle.textContent = kit.name;
  modalPhoto.alt = kit.name;
  modalTime.textContent = kit.time;
  modalOrderLink.dataset.car = kit.name;
  setMaterial('steel');
  modal.showModal();
}

document.querySelectorAll('[data-kit]').forEach((button) => {
  button.addEventListener('click', () => openKit(button.dataset.kit));
});

modal.querySelector('.modal__close').addEventListener('click', () => modal.close());
modalOrderLink.addEventListener('click', () => {
  form.elements.car.value = currentKit.name;
  form.elements.material.value = materials[currentMaterial].formValue;
  updatePreview();
  modal.close();
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.close();
  }
});


const form = document.querySelector('.form');
const success = document.querySelector('.success');
const phoneInput = form.elements.phone;
const phoneField = phoneInput.closest('.field');
const phoneError = phoneField.querySelector('.field__error');
const submitButton = form.querySelector('[type="submit"]');
const formNote = form.querySelector('.form__note');
const noteText = formNote.textContent;

const previewPhotos = {
  'JAC T9': {
    steel: {
      front: 'img/order/jac-t9-steel-front.webp',
      rear: 'img/order/jac-t9-steel-rear.webp',
      both: 'img/order/jac-t9-steel-front.webp',
    },
    powder: {
      front: 'img/order/jac-t9-black-front.webp',
      rear: 'img/order/jac-t9-black-rear.webp',
      both: 'img/order/jac-t9-black-front.webp',
    },
  },
  'Haval H3': {
    steel: {
      front: 'img/order/haval-h3-steel-front.webp',
      rear: 'img/order/haval-h3-steel-rear.webp',
      both: 'img/order/haval-h3-steel-front.webp',
    },
    powder: {
      front: 'img/order/haval-h3-black-front.webp',
      rear: 'img/order/haval-h3-black-rear.webp',
      both: 'img/order/haval-h3-black-front.webp',
    },
  },
};

const otherCarPhoto = 'img/shop.jpg';
const partKeys = { 'Передняя': 'front', 'Задняя': 'rear', 'Обе': 'both' };
const partNames = { 'Передняя': 'передняя защита', 'Задняя': 'задняя защита', 'Обе': 'передняя и задняя защита' };
const materialKeys = { 'AISI 304': 'steel', 'Порошок': 'powder', 'Не знаю': 'steel' };
const materialNames = { 'AISI 304': 'AISI 304', 'Порошок': 'чёрный металл', 'Не знаю': 'материал подберём' };

const previewImg = document.querySelector('.preview__img');
const previewCaption = document.querySelector('.preview__caption');

function updatePreview() {
  const car = form.elements.car.value;
  const part = form.elements.need.value;
  const material = form.elements.material.value;

  const photos = previewPhotos[car];
  const src = photos ? photos[materialKeys[material]][partKeys[part]] : otherCarPhoto;
  const carName = photos ? car : 'Ваша модель';
  const caption = `${carName} · ${partNames[part]} · ${materialNames[material]}`;

  previewCaption.textContent = caption;
  previewImg.alt = caption;

  if (previewImg.getAttribute('src') === src) {
    return;
  }

  previewImg.classList.add('is-hidden');
  setTimeout(() => {
    previewImg.src = src;
  }, 200);
}

previewImg.addEventListener('load', () => {
  previewImg.classList.remove('is-hidden');
});

form.addEventListener('change', updatePreview);

document.querySelectorAll('[data-car]').forEach((link) => {
  link.addEventListener('click', () => {
    form.elements.car.value = link.dataset.car;
    updatePreview();
  });
});

updatePreview();

function getDigits(value) {
  let digits = value.replace(/\D/g, '');

  if (value.trim().startsWith('+7') || (digits.length > 10 && /^[78]/.test(digits))) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
}

function formatPhone(digits) {
  if (!digits) {
    return '';
  }

  let result = '+7 (' + digits.slice(0, 3);
  if (digits.length > 3) result += ') ' + digits.slice(3, 6);
  if (digits.length > 6) result += '-' + digits.slice(6, 8);
  if (digits.length > 8) result += '-' + digits.slice(8, 10);
  return result;
}

function showPhoneError(text) {
  phoneField.classList.add('field--error');
  phoneError.textContent = text;
}

function hidePhoneError() {
  phoneField.classList.remove('field--error');
  phoneError.textContent = '';
}

phoneInput.addEventListener('focus', () => {
  if (!phoneInput.value) {
    phoneInput.value = '+7 (';
  }
});

phoneInput.addEventListener('blur', () => {
  if (!getDigits(phoneInput.value)) {
    phoneInput.value = '';
  }
});

phoneInput.addEventListener('input', () => {
  phoneInput.value = formatPhone(getDigits(phoneInput.value)) || '+7 (';
  hidePhoneError();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (getDigits(phoneInput.value).length !== 10) {
    showPhoneError('Номер неполный. Введите 10 цифр после +7, например +7 900 123-45-67');
    phoneInput.focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  data.install = form.elements.install.checked;

  submitButton.disabled = true;
  formNote.textContent = noteText;
  formNote.classList.remove('form__note--error');

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка ' + response.status);
    }

    form.hidden = true;
    success.hidden = false;
  } catch (error) {
    formNote.textContent = 'Не получилось отправить заявку. Позвоните нам: +7 (000) 000-00-00';
    formNote.classList.add('form__note--error');
  } finally {
    submitButton.disabled = false;
  }
});

success.querySelector('.success__again').addEventListener('click', () => {
  form.reset();
  updatePreview();
  hidePhoneError();
  success.hidden = true;
  form.hidden = false;
  phoneInput.focus();
});

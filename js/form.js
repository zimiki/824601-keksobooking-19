'use strict';

// Модуль, который работает с формой объявления

(function () {
  var mapFilter = document.querySelector('.map__filters'); // Форма №1 .map__filters
  var adForm = document.querySelector('.ad-form'); // Форма №2 .ad-form
  var typeSelect = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var roomSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var adFormTime = adForm.querySelector('.ad-form__element--time');
  var inputAddress = adForm.querySelector('#address');

  // Функция, которая УСТАНАВЛИВАЕТ неактивное состояние на <input> и <select> формы с помощью атрибута disabled
  var inactiveFormInput = function (form) {
    var allInput = form.querySelectorAll('input');
    var allSelect = form.querySelectorAll('select');
    for (var i = 0; i < allInput.length; i++) {
      allInput[i].setAttribute('disabled', 'disabled');
    }
    for (var j = 0; j < allSelect.length; j++) {
      allSelect[j].setAttribute('disabled', 'disabled');
    }
  };

  // Функция, которая СНИМАЕТ неактивное состояние на <input> и <select>
  var activeFormInput = function (form) {
    var allInput = form.querySelectorAll('input');
    var allSelect = form.querySelectorAll('select');
    for (var i = 0; i < allInput.length; i++) {
      allInput[i].removeAttribute('disabled');
    }
    for (var j = 0; j < allSelect.length; j++) {
      allSelect[j].removeAttribute('disabled');
    }
  };

  // Обработчик изменения priceInput
  var onPriceInputChange = function () {
    var min = parseInt(priceInput.min, 10);
    var max = parseInt(priceInput.max, 10);
    if (priceInput.value < min) {
      priceInput.setCustomValidity('Минимальное значение - ' + min);
    } else if (priceInput.value > max) {
      priceInput.setCustomValidity('Максимальное значение - ' + max);
    } else if (priceInput.validity.valueMissing) {
      priceInput.setCustomValidity('Обязательное поле');
    } else {
      priceInput.setCustomValidity('');
    }
  };

  // Обработчик изменения селекта time
  var setMinPrice = function () {
    var type = typeSelect.value;
    var minPrice = 0;
    if (type === 'bungalo') {
      minPrice = 0;
    } else if (type === 'flat') {
      minPrice = 1000;

    } else if (type === 'house') {
      minPrice = 5000;
    } else {
      minPrice = 10000;
    }
    priceInput.min = minPrice;
    priceInput.placeholder = minPrice;
  };

  var onTypeSelectChange = function () {
    setMinPrice();
    onPriceInputChange();
  };


  // Обработчик изменения селекта room
  var onRoomSelectChange = function () {
    var rooms = parseInt(roomSelect.value, 10);
    var capacity = parseInt(capacitySelect.value, 10);
    if (rooms === 1 && capacity !== 1) {
      roomSelect.setCustomValidity('для 1 гостя');
    } else if (rooms === 2 && (capacity < 1 || capacity > 2)) {
      roomSelect.setCustomValidity('для 2 гостей или для 1 гостя');
    } else if (rooms === 3 && (capacity < 1 || capacity > 3)) {
      roomSelect.setCustomValidity('для 3 гостей, для 2 гостей или для 1 гостя');
    } else if (rooms === 100 && capacity !== 0) {
      roomSelect.setCustomValidity('не для гостей');
    } else {
      roomSelect.setCustomValidity('');
    }
  };

  // Обработчик синхронизирует поля «Время заезда» и «Время выезда»
  var onTimeSelectCange = function (evt) {
    var timeinSelect = adForm.querySelector('#timein');
    var timeoutSelect = adForm.querySelector('#timeout');
    if (evt.target === timeinSelect) {
      timeoutSelect.value = timeinSelect.value;
    } else if (evt.target === timeoutSelect) {
      timeinSelect .value = timeoutSelect.value;
    }
  };

  // Функция, которая приводит формы в активное состояние и добавляющая обработчики событий
  var activeForm = function () {
    adForm.classList.remove('ad-form--disabled');
    activeFormInput(mapFilter); // Снимает неактивное состояние c формы №1
    activeFormInput(adForm); // Снимает неактивное состояние c формы №2
    setMinPrice(); // Установим минимум цены для выбраного селекта из разметки
    inputAddress.setAttribute('disabled', 'disabled'); // Заблокируем поля ввода адреса
    typeSelect.addEventListener('change', onTypeSelectChange); // Проверка изменений по типу жилья
    priceInput.addEventListener('input', onPriceInputChange); // Проверка изменений цены жилья
    adFormTime.addEventListener('change', onTimeSelectCange); // Синхронизация времени
    roomSelect.addEventListener('change', onRoomSelectChange); // Валидация значений при смене количества комнат
    capacitySelect.addEventListener('change', onRoomSelectChange); // Валидация значений при смене количества комнат
  };

  var inactiveForm = function (evt) {
    evt.preventDefault();
    adForm.reset();
    adForm.classList.add('ad-form--disabled');
    inactiveFormInput(mapFilter);
    inactiveFormInput(adForm);
    window.drag.setInactiveAdress();
    typeSelect.removeEventListener('change', onTypeSelectChange);
    priceInput.removeEventListener('input', onPriceInputChange);
    adFormTime.removeEventListener('change', onTimeSelectCange);
    roomSelect.removeEventListener('change', onRoomSelectChange);
    capacitySelect.removeEventListener('change', onRoomSelectChange);
  };


  // Приводит страницу в изначальное неактивное состояние
  inactiveFormInput(mapFilter); // Заблокирована форма №1 .map__filters
  inactiveFormInput(adForm); // Заблокирована форма №2 .ad-form
  window.drag.setInactiveAdress(); // Устанавливаем адрес = центру метки

  window.form = {
    activeForm: activeForm,
    inactiveForm: inactiveForm,
  };

})()
;

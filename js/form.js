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
  var resetButton = adForm.querySelector('.ad-form__reset'); // Элемент сбрасывающий карту до изначального неативного состояния
  var main = document.querySelector('main');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  // Функция, которая УСТАНАВЛИВАЕТ неактивное состояние на <input> и <select> <textarea> формы с помощью атрибута disabled
  var inactiveFormInput = function (form) {
    var allInput = form.querySelectorAll('input');
    var allSelect = form.querySelectorAll('select');
    var allTextArea = form.querySelectorAll('textarea');

    allInput.forEach(function (intut) {
      intut.setAttribute('disabled', 'disabled');
    });
    allSelect.forEach(function (select) {
      select.setAttribute('disabled', 'disabled');
    });
    allTextArea.forEach(function (area) {
      area.setAttribute('disabled', 'disabled');
    });
  };

  // Функция, которая СНИМАЕТ неактивное состояние на <input> и <select> <textarea>
  var activeFormInput = function (form) {
    var allInput = form.querySelectorAll('input');
    var allSelect = form.querySelectorAll('select');
    var allTextArea = form.querySelectorAll('textarea');

    allInput.forEach(function (intut) {
      intut.removeAttribute('disabled');
    });
    allSelect.forEach(function (select) {
      select.removeAttribute('disabled');
    });
    allTextArea.forEach(function (area) {
      area.removeAttribute('disabled');
    });
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

  // Обработчик определение минимальной цены c использованием словаря минимальных цен
  var setMinPrice = function () {
    priceInput.min = window.util.minPriceList[typeSelect.value];
    priceInput.placeholder = window.util.minPriceList[typeSelect.value];
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

  // Функция, которая записывает координаты в поле формы
  var setCoordsAdress = function (coords) {
    inputAddress.value = (coords.x + ', ' + coords.y); // Записывает полученные коордианты как адрес
  };

  // Функция, которая сбрасывает форму и карту
  var onButtonResetClik = function (evt) {
    evt.preventDefault();
    inactiveForm();
    window.map.close();
  };

  // УСПЕХ - ЗАГРУЗИЛИСЬ ДАННЫЕ
  var onSuccessSubmit = function () { // случай успешной отправки
    var successMessage = successTemplate.cloneNode(true); // отрисовка собщения об успешной отправки
    main.insertAdjacentElement('afterbegin', successMessage);
    document.addEventListener('keydown', onSuccessEscKeydown); // Сообщение должно исчезать по нажатию на клавишу Esc
    document.addEventListener('click', onSuccessMessageClick); // Сообщение должно исчезать по клику на произвольную область экрана
    inactiveForm(); // сбрасывает форму и возвращает страницу в неактивное состояние
    window.map.close();
  };

  // Обработчик события нажатия кнопки ESC для закрытия собщения
  var onSuccessEscKeydown = function (evt) {
    if (evt.key === window.util.ESC_KEY) {
      onSuccessMessageClick();
    }
  };

  // Функция, которая убирает собщение об УСПЕШНОЙ и удаляет все обработчики
  var onSuccessMessageClick = function () {
    var successMessage = main.querySelector('.success');
    document.removeEventListener('keydown', onSuccessEscKeydown);
    document.removeEventListener('click', onSuccessMessageClick);
    successMessage.remove();
  };

  // ОШИБКА - ДАННЫЕ НЕ ЗАГРУЗИЛИСЬ
  var onErrorSubmit = function () { // случай ошибки отправки
    var errorMessage = errorTemplate.cloneNode(true);
    main.insertAdjacentElement('afterbegin', errorMessage);
    main.querySelector('.error__button').addEventListener('click', onErrorMessageClick); // Cообщение должно исчезать после нажатия на кнопку .error__button
    document.addEventListener('click', onErrorMessageClick); // Сообщение должно исчезать по клику на произвольную область экрана
    document.addEventListener('keydown', onErrorEscKeydown); // Сообщение должно исчезать по нажатию на клавишу Esc
  };

  // Обработчик события нажатия кнопки ESC для закрытия собщения
  var onErrorEscKeydown = function (evt) {
    if (evt.key === window.util.ESC_KEY) {
      onErrorMessageClick();
    }
  };

  // Функция, которая убирает собщение об ОШИБКЕ и удаляет все обработчики
  var onErrorMessageClick = function () {
    var errorMessage = main.querySelector('.error');
    main.querySelector('.error__button').removeEventListener('click', onErrorMessageClick);
    document.removeEventListener('click', onErrorMessageClick);
    document.removeEventListener('keydown', onErrorEscKeydown);
    errorMessage.remove();
  };

  // Функция, которая обрабатывает событие Submit
  var onButtonSubmitClick = function (evt) {
    window.upload(new FormData(adForm), onSuccessSubmit, onErrorSubmit);
    evt.preventDefault();
  };


  // Функция, которая приводит формы в активное, с перварительнйо были ли форма уже активировна
  var activeForm = function () {
    if (adForm.classList.contains('ad-form--disabled')) {
      adForm.classList.remove('ad-form--disabled');
      activeFormInput(mapFilter); // Снимает неактивное состояние c формы №1
      activeFormInput(adForm); // Снимает неактивное состояние c формы №2
      setMinPrice(); // Установим минимум цены для выбраного селекта из разметки
      inputAddress.setAttribute('readonly', 'readonly'); // Заблокируем поля ввода адреса
      setCoordsAdress(window.drag.getMainPinMarkCoord()); // Показывает координаты осрого конца метки
      typeSelect.addEventListener('change', onTypeSelectChange); // Проверка изменений по типу жилья
      priceInput.addEventListener('input', onPriceInputChange); // Проверка изменений цены жилья
      adFormTime.addEventListener('change', onTimeSelectCange); // Синхронизация времени
      roomSelect.addEventListener('change', onRoomSelectChange); // Валидация значений при смене количества комнат
      capacitySelect.addEventListener('change', onRoomSelectChange); // Валидация значений при смене количества комнат
      resetButton.addEventListener('click', onButtonResetClik);
      adForm.addEventListener('submit', onButtonSubmitClick);
    }
  };

  // Функция, которая приводит формы в неактивное состояние и убирает обработчики событий
  var inactiveForm = function () {
    adForm.reset(); // сброс формы
    mapFilter.reset(); // сброс формы
    adForm.classList.add('ad-form--disabled');
    inactiveFormInput(mapFilter);
    inactiveFormInput(adForm);
    setCoordsAdress(window.drag.setMainPinDefaultPosition());
    typeSelect.removeEventListener('change', onTypeSelectChange);
    priceInput.removeEventListener('input', onPriceInputChange);
    adFormTime.removeEventListener('change', onTimeSelectCange);
    roomSelect.removeEventListener('change', onRoomSelectChange);
    capacitySelect.removeEventListener('change', onRoomSelectChange);
    resetButton.removeEventListener('click', onButtonResetClik);
    adForm.removeEventListener('submit', onButtonSubmitClick);
  };

  // Приводит страницу в изначальное неактивное состояние
  inactiveFormInput(mapFilter); // Заблокирована форма №1 .map__filters
  inactiveFormInput(adForm); // Заблокирована форма №2 .ad-form
  setCoordsAdress(window.drag.setMainPinDefaultPosition()); // Устанавливаем адрес = центру метки


  window.form = {
    active: activeForm,
    setCoordsAdress: setCoordsAdress
  };

})()
;

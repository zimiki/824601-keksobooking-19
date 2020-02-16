'use strict';

// Модуль, который управляет карточками объявлений и метками:
// добавляет на страницу нужную карточку, отрисовывает метки и осуществляет взаимодействие карточки и метки на карте

(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main'); // Элемент активирующий карту
  var resetFormButton = document.querySelector('.ad-form .ad-form__reset'); // Элемент сбрасывающий карту до изначального неативного состояния


  // Генерация случайных данных
  var offers = window.data.getMockData();

  var openMap = function () {
    map.classList.remove('map--faded'); // Снимает неактивное состояние .map содержит класс map--faded;
    var fragmentWithPins = window.util.getFragment(offers, window.pin.render); // Вызов функции создания фрагмента c pin объявлений
    map.querySelector('.map__pins').appendChild(fragmentWithPins); // Добавление фрагмента c pin в DOM
    window.form.activeForm();
    resetFormButton.addEventListener('click', closeMap); // Обработчик для перехода к начальному состоянию
  };


  var closeMap = function (evt) {
    map.classList.add('map--faded');
    window.pin.remove();
    window.form.inactiveForm(evt);
    resetFormButton.removeEventListener('click', closeMap);
  };

  var onMainPinClik = function (evt) {
    if (typeof evt === 'object') {
      switch (evt.button) { // Проверка на то что клик приходит с левой кнопки мыши
        case window.util.LEFT_MOUSE_BUTTON:
          openMap();
          window.drag.setMouseСoordsAddress(evt);
      }
    }
  };

  var onMainPinKeydown = function (evt) {
    if (evt.key === window.util.ENTER_KEY) {
      openMap();
      window.drag.setKeyСoordsAddress(evt);
    }
  };


  // Добавялет обработчик АКТИВАЦИИ на mousedown
  mainPin.addEventListener('mousedown', onMainPinClik);
  // Добавялет обработчик АКТИВАЦИИ на keydown с проверкой на то что это кнопка Enter
  mainPin.addEventListener('keydown', onMainPinKeydown);

  /*
  // 4. Отрисовка карточки предложения
  var card = window.card.render(offers[0]);
  var referenceElement = map.querySelector('.map__filters-container');
  map.insertBefore(card, referenceElement); // Вставка CARD в блок .map перед блоком.map__filters-container
*/

})()
;

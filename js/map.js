'use strict';

// Модуль, который управляет карточками объявлений и метками:
// добавляет на страницу нужную карточку, отрисовывает метки и осуществляет взаимодействие карточки и метки на карте

(function () {
  var map = document.querySelector('.map');

  // Если успешно загрузились данные
  var onSuccess = function (offers) {
    var loadErrorMessage = document.querySelector('.error-load');
    if (loadErrorMessage) {
      loadErrorMessage.remove();
    }
    var fragmentWithPins = window.util.getFragment(offers, window.pin.render); // Вызов функции создания фрагмента c pin объявлений
    map.querySelector('.map__pins').appendChild(fragmentWithPins); // Добавление фрагмента c pin в DOM
    map.classList.remove('map--faded'); // Снимает неактивное состояние .map содержит класс map--faded;
    window.pin.addAllClickListener(offers);
  };

  // Если не успешно загрузились данные
  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-load');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  // Функция открытия карты с проверкой условия, была ли она до этого открыта
  var openMap = function () {
    if (map.classList.contains('map--faded')) {
      window.load(onSuccess, onError); // Загрузка
    }
  };

  // Функция закрытия карты
  var closeMap = function () {
    map.classList.add('map--faded');
    window.pin.removeAllNew();
  };

  window.map = {
    open: openMap,
    close: closeMap
  };

})()
;

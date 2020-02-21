'use strict';

// Модуль, который управляет карточками объявлений и метками:
// добавляет на страницу нужную карточку, отрисовывает метки и осуществляет взаимодействие карточки и метки на карте

(function () {
  var map = document.querySelector('.map');


  var openMap = function () {
    map.classList.remove('map--faded'); // Снимает неактивное состояние .map содержит класс map--faded;
    var fragmentWithPins = window.util.getFragment(window.data.offers, window.pin.render); // Вызов функции создания фрагмента c pin объявлений
    map.querySelector('.map__pins').appendChild(fragmentWithPins); // Добавление фрагмента c pin в DOM
    window.pin.addAllClickListener();
  };


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

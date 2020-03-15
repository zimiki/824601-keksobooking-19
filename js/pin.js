'use strict';

// Модуль, который отвечает за создание метки на карте
(function () {
  var similarOfferTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins'); // Главная метка

  // 1. Функция создания одного DOM-элемента на основе данных для PIN
  var renderPin = function (offer) {
    var offerElement = similarOfferTemplate.cloneNode(true);
    var iconX = offer.location.x - (window.util.PIN_WIDTH / 2); // в разметку нужно верхний левый угол, то поправки  = - левее на (pin.width/2)
    var iconY = offer.location.y - window.util.PIN_HEIGHT; // Поправки = - выше на (pin.height)
    offerElement.style = 'left: ' + iconX + 'px; top: ' + iconY + 'px;';
    offerElement.querySelector('img').src = offer.author.avatar;
    offerElement.querySelector('img').alt = offer.offer.title;
    return offerElement;
  };

  // 2.Функция которая добавляет на все новые метки обработчик события клик
  var addAllPinsClickListener = function (arr) {
    var newMapPins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)'); // Найдем массив новых меток
    var addPinClickListener = function (pin, index) {
      var onPinClick = function () {
        window.card.add(arr[index]);
      };
      // Добавление обработчиков
      pin.addEventListener('click', onPinClick);
    };

    newMapPins.forEach(function (pin, index) {
      addPinClickListener(pin, index);
    });
  };

  // 3. Функция, которая удаляет все вставленные фрагметом метки объявлений
  var removeNewPins = function () {
    var newMapPins = mapPins.querySelectorAll('.map__pin');

    newMapPins.forEach(function (newPin) {
      if (!newPin.classList.contains('map__pin--main')) {
        mapPins.removeChild(newPin);
      }
    });
  };

  window.pin = {
    render: renderPin,
    addAllClickListener: addAllPinsClickListener,
    removeAllNew: removeNewPins
  };

})()
;

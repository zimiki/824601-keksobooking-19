'use strict';

// Модуль, который отвечает за создание метки на карте
(function () {
  var similarOfferTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins'); // Главная метка

  // Функция создания одного DOM-элемента на основе данных для PIN
  var renderPin = function (offer) {
    var offerElement = similarOfferTemplate.cloneNode(true);
    var iconX = offer.location.x - (window.util.PIN_WIDTH / 2); // в разметку нужно верхний левый угол, то поправки  = - левее на (pin.width/2)
    var iconY = offer.location.y - window.util.PIN_HEIGHT; // Поправки = - выше на (pin.height)
    offerElement.style = 'left: ' + iconX + 'px; top: ' + iconY + 'px;';
    offerElement.querySelector('img').src = offer.author.avatar;
    offerElement.querySelector('img').alt = offer.offer.title;
    return offerElement;
  };

  // Функция, которая удаляет все вставленные фрагметом метки объявлений
  var removeNewPins = function () {
    var newMapPins = mapPins.querySelectorAll('.map__pin');
    for (var i = 0; i < newMapPins.length; i++) {
      if (!newMapPins[i].classList.contains('map__pin--main')) {
        mapPins.removeChild(newMapPins[i]);
      }
    }
  };

  window.pin = {
    render: renderPin,
    remove: removeNewPins,
  };

})()
;

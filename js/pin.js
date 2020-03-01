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
    var newMapPins = mapPins.querySelectorAll('.map__pin'); // Найдем массив новых меток

    // Функция замыкания, чтобы создать отдельное событие для каждой метки в отдельности
    var addPinClickListener = function (pin, j) {
      var onPinClick = function () {
        var numberOffer = j - 1; // на 1 меньше потому, что массив newMapPins начинается с mainPin
        window.card.add(arr[numberOffer]);
      };
      // Добавление обработчиков
      pin.addEventListener('click', onPinClick);
    };

    // Цикл для установки обработчки на каждый пин кроме первого, потому что перый - главная метка
    for (var j = 1; j < newMapPins.length; j++) {
      var pin = newMapPins[j];
      addPinClickListener(pin, j);
    }
  };


  // 3. Функция, которая удаляет все вставленные фрагметом метки объявлений
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
    addAllClickListener: addAllPinsClickListener,
    removeAllNew: removeNewPins
  };

})()
;

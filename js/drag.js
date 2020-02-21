'use strict';

// Модуль, который отслеживает перемещение Главной Метки

(function () {
  var HALF_MAIN_PIN_WIDTH = 32; // Ширина главной метки
  var MAIN_PIN_HEIGHT = 84; // Высота главной метки
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var centerMapCoord = {
    x: 602,
    y: 407
  };


  // Функция, которая устанавливает в неактивном состоянии страницы  адрес = координаты центра метки;
  var setMainPinDefaultPosition = function () {
    mainPin.style.left = (centerMapCoord.x - HALF_MAIN_PIN_WIDTH) + 'px';
    mainPin.style.top = (centerMapCoord.y - HALF_MAIN_PIN_WIDTH) + 'px';
    return centerMapCoord;
  };

  // Функция, которая учитывает поправки на передачу координат ГЛАВНОЙ метки  (левого вехнего угла--> острого конца)
  var getMainPinMarkCoord = function (mainPinCoord) {
    var markCoord = {
      x: mainPinCoord.x + HALF_MAIN_PIN_WIDTH, // получим координаты для остного конца метки(правее +(ширины/2), ниже +высоты)
      y: mainPinCoord.y + MAIN_PIN_HEIGHT
    };
    return (markCoord);
  };

  // Функция, которыя устанавливает значения поля ввода адреса. Вариация для Enter
  var getKeyСoordsAddress = function (evt) {
    var markCoord = {
      x: evt.target.offsetLeft,
      y: evt.target.offsetTop
    };
    var pinMarkCoord = getMainPinMarkCoord(markCoord); // внесем поправки для передачи координат
    return (pinMarkCoord);
  };

  // Переменные для ограничения перемещения главной метки, чтобы она не вываливалась из карты
  var leftBorder = 100; // это для теста мимит слева
  var rightBorder = 1100; // это для теста мимит справа
  var topBorder = 130; // это для теста мимит сверху
  var bottomBorder = 500; // это для теста мимит снизу
  // Функция которая проверяет лимиты
  var checkLimits = function (coord, min, max) {
    var checkCoord = coord;
    if (coord < min) {
      checkCoord = min;
    } if (coord > max) {
      checkCoord = max;
    }
    return checkCoord;
  };


  // Функция слайдер
  var slider = function (evt) {
    evt.preventDefault();
    var mouseStartCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: mouseStartCoords.x - moveEvt.clientX,
        y: mouseStartCoords.y - moveEvt.clientY
      };
      mouseStartCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      // ???  Когда нужно проверять ограничения, потому что если движение мыши выпадает за лимиты и возвращается обратно в карту- то получается сдвик метки и мышки
      // ??? Если проверять ограничения на moveEvt.clientX - то тоже не получается - если страницу чуть проскролить то и лимиты съезжают
      var mainPinCoords = {
        x: checkLimits((mainPin.offsetLeft - shift.x), leftBorder, rightBorder),
        y: checkLimits((mainPin.offsetTop - shift.y), topBorder, bottomBorder)
      };

      mainPin.style.left = mainPinCoords.x + 'px';
      mainPin.style.top = mainPinCoords.y + 'px';

      var adress = getMainPinMarkCoord(mainPinCoords);
      window.form.setCoordsAdress(adress);

    };
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Функция при нажатии левой кнопки мыши
  var onMainPinClik = function (evt) {
    if (typeof evt === 'object') {
      switch (evt.button) { // Проверка на то что клик приходит с левой кнопки мыши
        case window.util.LEFT_MOUSE_BUTTON:
          window.map.open();
          window.form.mouseActiveForm();
          slider(evt);
      }
    }
  };

  var onMainPinKeydown = function (evt) {
    if (evt.key === window.util.ENTER_KEY) {
      window.map.open();
      window.form.keyActiveForm(evt);
    }
  };


  // Добавялет обработчик АКТИВАЦИИ на mousedown
  mainPin.addEventListener('mousedown', onMainPinClik);
  // Добавялет обработчик АКТИВАЦИИ на keydown с проверкой на то что это кнопка Enter
  mainPin.addEventListener('keydown', onMainPinKeydown);

  window.drag = {
    setMainPinDefaultPosition: setMainPinDefaultPosition,
    getKeyСoordsAddress: getKeyСoordsAddress,
    getMainPinMarkCoord: getMainPinMarkCoord
  };

})()
;

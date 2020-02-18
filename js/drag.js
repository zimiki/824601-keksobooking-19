'use strict';

// Модуль, который отслеживает перемещение Главной Метки

(function () {
  var MAIN_PIN_WIDTH = 65; // Ширина главной метки
  var MAIN_PIN_HEIGHT = 84; // Высота главной метки
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');


  // Функция, которая устанавливает в неактивном состоянии страницы  адрес = координаты центра метки;
  var getInactiveAdress = function () {
    var mainPinX = parseInt(mainPin.style.left, 10);
    var mainPinY = parseInt(mainPin.style.top, 10);
    var centerCoord = {
      x: Math.floor(mainPinX + (MAIN_PIN_WIDTH / 2)),
      y: Math.floor(mainPinY + (MAIN_PIN_WIDTH / 2)) // не использую высоту, потому что метка круглая без хвостика
    };
    return (centerCoord);
  };


  // Функция, которая учитывает поправки на передачу координат ГЛАВНОЙ метки  (левого вехнего угла--> острого конца)
  var getMainPinMarkCoord = function (pinX, pinY) {
    var markX = Math.floor(pinX + (MAIN_PIN_WIDTH / 2)); // получим координаты для остного конца метки(правее +(ширины/2), ниже +высоты)
    var markY = Math.floor(pinY + MAIN_PIN_HEIGHT);
    var markCoord = {
      x: markX,
      y: markY
    };
    return (markCoord);
  };


  // Функция, которыя устанавливает значения поля ввода адреса. Это координаты, на которые метка указывает своим острым концом.
  var getMouseСoordsAddress = function (evt) {
    var mapCoord = map.getBoundingClientRect(); // получим координаты карты. X/Y-координаты начала прямоугольника относительно окна
    var mainPinX = Math.floor(evt.clientX - mapCoord.x); // получим координаты мышки относительно окна карты (это пин)
    var mainPinY = Math.floor(evt.clientY - mapCoord.y);
    var pinMarkCoord = getMainPinMarkCoord(mainPinX, mainPinY); // внесем поправки для передачи координат
    return (pinMarkCoord);
  };

  // Функция, которыя устанавливает значения поля ввода адреса. Вариация для Enter
  var getKeyСoordsAddress = function (evt) {
    var mainPinX = evt.target.offsetLeft;
    var mainPinY = evt.target.offsetTop;
    var pinMarkCoord = getMainPinMarkCoord(mainPinX, mainPinY); // внесем поправки для передачи координат
    return (pinMarkCoord);
  };

  var onMainPinClik = function (evt) {
    if (typeof evt === 'object') {
      switch (evt.button) { // Проверка на то что клик приходит с левой кнопки мыши
        case window.util.LEFT_MOUSE_BUTTON:
          window.map.open(evt);
          window.form.mouseActiveForm(evt);
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
    getInactiveAdress: getInactiveAdress,
    getMouseСoordsAddress: getMouseСoordsAddress,
    getKeyСoordsAddress: getKeyСoordsAddress
  };

})()
;

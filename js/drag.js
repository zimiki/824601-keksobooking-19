'use strict';

// Модуль, который отслеживает перемещение Главной Метки

(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var inputAddress = document.querySelector('#address');


  // Функция, которая устанавливает в неактивном состоянии страницы  адрес = координаты центра метки;
  var setInactiveAdress = function () {
    var mainPinX = parseInt(mainPin.style.left, 10);
    var mainPinY = parseInt(mainPin.style.top, 10);
    var centerX = Math.floor(mainPinX + (window.util.MAIN_PIN_WIDTH / 2));
    var centerY = Math.floor(mainPinY + (window.util.MAIN_PIN_WIDTH / 2)); // не использую высоту, потому что метка круглая без хвостика
    inputAddress.value = (centerX + ', ' + centerY);
  };


  // Функция, которая учитывает поправки на передачу координат ГЛАВНОЙ метки  (левого вехнего угла--> острого конца)
  var getMainPinMarkCoord = function (pinX, pinY) {
    var markX = Math.floor(pinX + (window.util.MAIN_PIN_WIDTH / 2)); // получим координаты для остного конца метки(правее +(ширины/2), ниже +высоты)
    var markY = Math.floor(pinY + window.util.MAIN_PIN_HEIGHT);
    var markCoord = {
      x: markX,
      y: markY
    };
    return (markCoord);
  };


  // Функция, которыя устанавливает значения поля ввода адреса. Это координаты, на которые метка указывает своим острым концом.
  var setMouseСoordsAddress = function (evt) {
    var mapCoord = map.getBoundingClientRect(); // получим координаты карты. X/Y-координаты начала прямоугольника относительно окна
    var mainPinX = Math.floor(evt.clientX - mapCoord.x); // получим координаты мышки относительно окна карты (это пин)
    var mainPinY = Math.floor(evt.clientY - mapCoord.y);
    var pinMarkCoord = getMainPinMarkCoord(mainPinX, mainPinY); // внесем поправки для передачи координат
    inputAddress.value = pinMarkCoord.x + ', ' + pinMarkCoord.y; // в интуп для адреса, запишем координаты
  };

  // Функция, которыя устанавливает значения поля ввода адреса. Вариация для Enter
  var setKeyСoordsAddress = function (evt) {
    var mainPinX = evt.target.offsetLeft;
    var mainPinY = evt.target.offsetTop;
    var pinMarkCoord = getMainPinMarkCoord(mainPinX, mainPinY); // внесем поправки для передачи координат
    inputAddress.value = pinMarkCoord.x + ', ' + pinMarkCoord.y; // в интуп для адреса, запишем координаты
  };

  window.drag = {
    setInactiveAdress: setInactiveAdress,
    setMouseСoordsAddress: setMouseСoordsAddress,
    setKeyСoordsAddress: setKeyСoordsAddress
  };

})()
;

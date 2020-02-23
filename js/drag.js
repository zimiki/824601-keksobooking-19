'use strict';

// Модуль, который отслеживает перемещение Главной Метки

(function () {
  var HALF_MAIN_PIN_WIDTH = 32; // Ширина главной метки
  var MAIN_PIN_HEIGHT = 84; // Высота главной метки
  var Y_MIN_DRAG = 130; // Параметры по ТЗ
  var Y_MAX_DRAG = 600;
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  // Функция, которая устанавливает в неактивном состоянии страницы  адрес = координаты центра метки;
  var setMainPinDefaultPosition = function () {
    var mapParameters = map.getBoundingClientRect(); // полчим параметры карты и определим параметры центра с ориентором 602/407
    var centerMapCoord = {
      x: mapParameters.width / 2,
      y: (mapParameters.height / 2) + HALF_MAIN_PIN_WIDTH
    };
    mainPin.style.left = (centerMapCoord.x - HALF_MAIN_PIN_WIDTH) + 'px';
    mainPin.style.top = (centerMapCoord.y - HALF_MAIN_PIN_WIDTH) + 'px';
    return centerMapCoord;
  };

  // Функция, которая учитывает поправки на передачу координат ГЛАВНОЙ метки  (левого вехнего угла--> острого конца)
  var getMainPinMarkCoord = function () {
    var markCoord = {
      x: parseInt(mainPin.style.left, 10) + HALF_MAIN_PIN_WIDTH, // получим координаты для остного конца метки(правее +(ширины/2), ниже +высоты)
      y: parseInt(mainPin.style.top, 10) + MAIN_PIN_HEIGHT
    };
    return (markCoord);
  };


  // Функция которая проверяет лимиты
  var checkLimits = function (coord, min, max) {
    if (coord < min) {
      return false;
    }
    if (coord > max) {
      return false;
    }
    return true;
  };

  // Функции для определения лимитов, в пределах которых учитываются события mouseMove
  var getLimitsX = function (evt, sliderArea) {
    var limits = {
      min: sliderArea.x - HALF_MAIN_PIN_WIDTH + evt.offsetX, // минимум = положение map Сlient - учет для острого конца метки + учет где на метке был Click
      max: sliderArea.x + sliderArea.width - HALF_MAIN_PIN_WIDTH + evt.offsetX, // // максимум = конец положения map Сlient - учет для острого конца метки + учет где на метке был Click
    };
    return limits;
  };

  var getLimitsY = function (evt, sliderArea) {
    var limits = {
      min: sliderArea.y + Y_MIN_DRAG + evt.offsetY, // минимум = по ТЗ + учет где на метке был Click
      max: sliderArea.y + Y_MAX_DRAG + evt.offsetY // максимум = по ТЗ + учет где на метке был Click
    };
    return limits;
  };


  // Функция слайдер
  var slider = function (evt) {
    evt.preventDefault();
    var mapParameters = map.getBoundingClientRect(); // положение карты относительно Сlient, потому что берем положение курсора тоже относительно Сlient
    var limitsX = getLimitsX(evt, mapParameters);
    var limitsY = getLimitsY(evt, mapParameters);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      // Координаты пина определяются так:
      // 1. Вычисляется смещение координат по карте в одной системе исчисления client (значение движения - значение начала карты)
      // 2. Добавляется поправка чтобы не прыгала - эти параметры где было событие click внутри элемента
      var mainPinCoords = {
        x: Math.floor(moveEvt.clientX - mapParameters.x - evt.offsetX),
        y: Math.floor(moveEvt.clientY - mapParameters.y - evt.offsetY)
      };

      // Используем фунцию проверки лимитов с тремя параметрами: 1.координта 2. максимум 3.минимум
      if (checkLimits(moveEvt.clientX, limitsX.min, limitsX.max)) {
        mainPin.style.left = mainPinCoords.x + 'px';
      }
      if (checkLimits(moveEvt.clientY, limitsY.min, limitsY.max)) {
        mainPin.style.top = mainPinCoords.y + 'px';
      }

      // Записываем адрес
      window.form.setCoordsAdress(getMainPinMarkCoord());
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
          window.form.activeForm();
          slider(evt);
      }
    }
  };

  var onMainPinKeydown = function (evt) {
    if (evt.key === window.util.ENTER_KEY) {
      window.map.open();
      window.form.activeForm(evt);
    }
  };


  // Добавялет обработчик АКТИВАЦИИ на mousedown
  mainPin.addEventListener('mousedown', onMainPinClik);
  // Добавялет обработчик АКТИВАЦИИ на keydown с проверкой на то что это кнопка Enter
  mainPin.addEventListener('keydown', onMainPinKeydown);

  window.drag = {
    setMainPinDefaultPosition: setMainPinDefaultPosition,
    getMainPinMarkCoord: getMainPinMarkCoord
  };

})()
;

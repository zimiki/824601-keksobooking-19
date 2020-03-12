'use strict';

// Модуль, который отслеживает перемещение Главной Метки

(function () {
  var HALF_MAIN_PIN_WIDTH = 32; // Ширина главной метки
  var MAIN_PIN_HEIGHT = 84; // Высота главной метки
  var MAP_TOP_BORDER = 130; // Параметры по ТЗ
  var MAP_BOTTOM_BORDER = 120; // 630 = это высота карты 750-120
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
      x: parseInt(mainPin.style.left, 10) + HALF_MAIN_PIN_WIDTH,
      y: parseInt(mainPin.style.top, 10) + MAIN_PIN_HEIGHT
    };
    return (markCoord);
  };

  // Функция для определения лимитов на разных экранах
  var getMapLimits = function () {
    var mapParameters = map.getBoundingClientRect();
    var limits = {
      minX: 0 - HALF_MAIN_PIN_WIDTH,
      maxX: mapParameters.width - HALF_MAIN_PIN_WIDTH,
      minY: MAP_TOP_BORDER - MAIN_PIN_HEIGHT,
      maxY: mapParameters.height - MAP_BOTTOM_BORDER - MAIN_PIN_HEIGHT
    };
    return limits;
  };

  // Функция слайдер
  var slider = function (evt) {
    evt.preventDefault();
    var limitsMap = getMapLimits();
    var currentCursorCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {

      var getNewCoordX = function (min, max) {
        var shiftX = currentCursorCoords.x - moveEvt.clientX;
        var coordinateX = (mainPin.offsetLeft - shiftX);
        if (coordinateX < min) {
          coordinateX = min;
        }
        if (coordinateX > max) {
          coordinateX = max;
        }
        return coordinateX;
      };

      var getNewCoordY = function (min, max) {
        var shiftY = currentCursorCoords.y - moveEvt.clientY;
        var coordinateY = mainPin.offsetTop - shiftY;
        if (coordinateY < min) {
          coordinateY = min;
        }
        if (coordinateY > max) {
          coordinateY = max;
        }
        return coordinateY;
      };

      mainPin.style.left = getNewCoordX(limitsMap.minX, limitsMap.maxX) + 'px';
      mainPin.style.top = getNewCoordY(limitsMap.minY, limitsMap.maxY) + 'px';

      currentCursorCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

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
          window.form.active();
          slider(evt);
          break;
      }
    }
  };

  var onMainPinKeydown = function (evt) {
    if (evt.key === window.util.ENTER_KEY) {
      window.map.open();
      window.form.active(evt);
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

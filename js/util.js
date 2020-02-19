'use strict';

(function () {
  var PIN_WIDTH = 50; // Ширина иконки
  var PIN_HEIGHT = 70; // Высота иконки


  // Функция создания фрагмента, принимает массив данных и функцию отрисовки элемента
  var getFragment = function (arr, renderElement) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      fragment.appendChild(renderElement(arr[i]));
    }
    return fragment;
  };


  window.util = {
    ENTER_KEY: 'Enter',
    LEFT_MOUSE_BUTTON: 0,
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,
    getFragment: getFragment
  };

})()
;
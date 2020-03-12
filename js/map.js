'use strict';

// Модуль, который отвечает запускает отрисоку меток и карточек на карте

(function () {
  var map = document.querySelector('.map');
  var mapFilter = document.querySelector('.map__filters'); // Форма №1 .map__filters
  var offersData = [];


  var renderMapPins = function (arr) {
    var fragmentWithPins = window.util.getFragment(arr, window.pin.render);
    map.querySelector('.map__pins').appendChild(fragmentWithPins); // Добавление фрагмента c pin в DOM
    window.pin.addAllClickListener(arr);
  };

  // Функция, которая получает отсортированную дату и отрисовывает пины
  var renderSortPins = function () {
    var newSort = window.sort.get(offersData);
    renderMapPins(newSort);
  };


  // Обработчик события смены чего то в фильтрах
  var onMapFilterCange = window.debounce(function () {
    window.card.remove();
    window.pin.removeAllNew();
    renderSortPins();
  });


  // Если успешно загрузились данные
  var onSuccess = function (data) {
    var loadErrorMessage = document.querySelector('.error-load');
    if (loadErrorMessage) {
      loadErrorMessage.remove();
    }

    offersData = data;
    map.classList.remove('map--faded'); // Снимает неактивное состояние .map содержит класс map--faded;
    renderSortPins();
    mapFilter.addEventListener('change', onMapFilterCange);
  };

  // Если не успешно загрузились данные, нет шаблона для отображения этого события. Использован пример из лекции
  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-load');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  // Функция открытия карты с проверкой условия, была ли она до этого открыта
  var openMap = function () {
    if (map.classList.contains('map--faded')) {
      window.load(onSuccess, onError); // Загрузка
    }
  };

  // Функция закрытия карты
  var closeMap = function () {
    map.classList.add('map--faded');
    window.card.remove();
    window.pin.removeAllNew();
    mapFilter.removeEventListener('change', onMapFilterCange);
  };

  window.map = {
    open: openMap,
    close: closeMap
  };

})()
;

'use strict';

// Модуль, который отвечает запускает отрисоку меток и карточек на карте

(function () {
  var map = document.querySelector('.map');
  var mapFilter = document.querySelector('.map__filters'); // Форма №1 .map__filters


  var renderMapPins = function (arr) {
    var fragmentWithPins = window.util.getFragment(arr, window.pin.render);
    map.querySelector('.map__pins').appendChild(fragmentWithPins); // Добавление фрагмента c pin в DOM
    window.pin.addAllClickListener(arr);
  };


  // Если успешно загрузились данные
  var onSuccess = function (data) {
    var loadErrorMessage = document.querySelector('.error-load');
    if (loadErrorMessage) {
      loadErrorMessage.remove();
    }

    // Обработчик события смены чего то в фильтрах
    var onMapFilterCange = function () {
      window.card.remove();
      window.pin.removeAllNew();
      var newSort = window.sort.get(data);
      renderMapPins(newSort);
    };

    map.classList.remove('map--faded'); // Снимает неактивное состояние .map содержит класс map--faded;
    var offers = window.sort.get(data); // определение данных на отрисовку
    renderMapPins(offers);
    mapFilter.addEventListener('change', onMapFilterCange); // !!! ВОПРОС КАК ЕГО СНЯТЬ ПРИ ЗАКРЫТИИ КАРТЫ ???
  };

  // Если не успешно загрузились данные
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
  };

  window.map = {
    open: openMap,
    close: closeMap
  };

})()
;

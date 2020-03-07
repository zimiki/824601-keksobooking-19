'use strict';

// Модуль, который отвечает за сортировку данных для отрисовки

(function () {
  var mapFilter = document.querySelector('.map__filters'); // Форма №1 .map__filters

  var NUMBER_PINS_ON_MAP = 5; // выводить на карту не более 5 меток


  // Функция, которая не дает быть массиву длинее 5 элементов, возвращает массив
  var getArrMaxLength = function (arr) {
    var maxArrLengt = arr.slice(0, NUMBER_PINS_ON_MAP);
    return maxArrLengt;
  };

  // Проверку нужно ли применять фильтр
  var itSort = function (select) {
    if (select.value === 'any') {
      return false;
    }
    return true;
  };

  // Получение нового массива по выбраному селекту жилья, возвращает массив
  var getSortArrHousingType = function (arr) {
    var housingTypeSelect = mapFilter.querySelector('#housing-type'); // селект с типом жилья
    var sortArr = arr.slice();
    if (itSort(housingTypeSelect)) {
      sortArr = arr.filter(function (offer) {
        return offer.offer.type === housingTypeSelect.value;
      });
    }
    return sortArr;
  };

  // Функция получения новых данных при сортировке
  var getSortData = function (data) {
    var sortData = getSortArrHousingType(data); // 1. первая сортировка по типу жилья
    return getArrMaxLength(sortData);
  };

  window.sort = {
    get: getSortData
  };

})()
;


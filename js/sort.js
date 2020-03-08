'use strict';

// Модуль, который отвечает за сортировку данных для отрисовки

(function () {
  var mapFilter = document.querySelector('.map__filters'); // Форма №1 .map__filters
  var NUMBER_PINS_ON_MAP = 5; // выводить на карту не более 5 меток
  var housingTypeSelect = mapFilter.querySelector('#housing-type'); // селект с типом жилья
  var housingPriceSelect = mapFilter.querySelector('#housing-price'); // селект с цены


  // Функция, которая не дает быть массиву длинее 5 элементов, возвращает массив
  var getArrMaxLength = function (arr) {
    var maxArrLengt = arr.slice(0, NUMBER_PINS_ON_MAP);
    return maxArrLengt;
  };


  // Получение нового массива по ЦЕНЕ, возвращает массив
  var getSortPrice = function (arr) {
    var sortPrice = [];
    switch (housingPriceSelect.value) {
      case 'low':
        sortPrice = arr.filter(function (offer) {
          return offer.offer.price <= 10000;
        });
        break;
      case 'middle':
        sortPrice = arr.filter(function (offer) {
          return (offer.offer.price > 10000 && offer.offer.price < 50000);
        });
        break;
      case 'high':
        sortPrice = arr.filter(function (offer) {
          return offer.offer.price >= 50000;
        });
        break;
      default:
        sortPrice = arr.slice();
    }
    return sortPrice;
  };


  // Получение нового массива по выбраному ТИПУ жилья, возвращает массив
  var getSortType = function (arr) {
    var sortType = [];
    switch (housingTypeSelect.value) {
      case 'any':
        sortType = arr.slice();
        break;
      default:
        sortType = arr.filter(function (offer) {
          return offer.offer.type === housingTypeSelect.value;
        });
    }
    return sortType;
  };


  // Функция получения НОВОГО МАССИВА ДАННЫХ при сортировке
  var getSortData = function (data) {
    var sortData = [];
    sortData = getSortType(data); // 1. первая сортировка по типу жилья
    sortData = getSortPrice(sortData); // 2. вторая сортировка по цене
    return getArrMaxLength(sortData);
  };

  window.sort = {
    get: getSortData
  };

})()
;

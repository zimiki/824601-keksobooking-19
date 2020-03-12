'use strict';

// Модуль, который отвечает за сортировку данных для отрисовки

(function () {
  var NUMBER_PINS_ON_MAP = 5; // выводить на карту не более 5 меток
  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  var mapFilter = document.querySelector('.map__filters'); // Форма №1 .map__filters
  var housingTypeSelect = mapFilter.querySelector('#housing-type'); // селект с типом жилья
  var housingPriceSelect = mapFilter.querySelector('#housing-price'); // селект с цены
  var housingRoomsSelect = mapFilter.querySelector('#housing-rooms'); // селект с комнатами
  var housingGuestsSelect = mapFilter.querySelector('#housing-guests'); // селект с гостями

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
          return offer.offer.price <= Price.LOW;
        });
        break;
      case 'middle':
        sortPrice = arr.filter(function (offer) {
          return (offer.offer.price > Price.LOW && offer.offer.price < Price.HIGH);
        });
        break;
      case 'high':
        sortPrice = arr.filter(function (offer) {
          return offer.offer.price >= Price.HIGH;
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

  // Получение нового массива по выбраному КОЛИЧЕСТВУ КОМНАТ, возвращает массив
  var getSortRooms = function (arr) {
    var sortRooms = [];
    switch (housingRoomsSelect.value) {
      case 'any':
        sortRooms = arr.slice();
        break;
      default:
        sortRooms = arr.filter(function (offer) {
          return offer.offer.rooms === parseInt(housingRoomsSelect.value, 10);
        });
    }
    return sortRooms;
  };

  // Получение нового массива по выбраному КОЛИЧЕСТВУ КОМНАТ, возвращает массив
  var getSortGuests = function (arr) {
    var sortGuests = [];
    switch (housingGuestsSelect.value) {
      case 'any':
        sortGuests = arr.slice();
        break;
      default:
        sortGuests = arr.filter(function (offer) {
          return offer.offer.guests === parseInt(housingGuestsSelect.value, 10);
        });
    }
    return sortGuests;
  };


  // Функция которая считает, сколько в первом массиве совпадений со вторым массивом
  var countOfSameFeatures = function (offerFeatures, requiredFeatures) {
    var count = 0;
    requiredFeatures.forEach(function (requiredFeature) {
      if (offerFeatures.indexOf(requiredFeature) >= 0) {
        count++;
      }
    });
    return count;
  };

  // Сортировка по приемуществам
  var getSortFeatures = function (arr) {
    var valuesCheckbox = [];
    var checkboxArr = mapFilter.querySelectorAll('input[type="checkbox"]:checked'); // Находим колекцию зачеканных преимуществ
    checkboxArr.forEach(function (checkbox) {
      valuesCheckbox.push(checkbox.value); // Добавялем в массив все их значения
    });
    var sotrFeatures = [];

    switch (valuesCheckbox.length) {
      case 0:
        sotrFeatures = arr.slice();
        break;
      default:
        for (var j = 0; j < arr.length; j++) {
          if (sotrFeatures.length < NUMBER_PINS_ON_MAP) { // Проверка и принудительная остановка, когда набраны все возможные к отрисовке элементы
            var offerFeatures = arr[j].offer.features; // Находим сравниваемый массив предложенйи в каждом объявлении
            if (countOfSameFeatures(offerFeatures, valuesCheckbox) === valuesCheckbox.length) { // Если счетчик найденных элементов = количеству искомых
              sotrFeatures.push(arr[j]); // То добавляем в нашу выборку
            }
          } else {
            break;
          }
        }
    }
    return sotrFeatures;
  };


  // Функция получения НОВОГО МАССИВА ДАННЫХ при сортировке
  var getSortData = function (data) {
    var sortData = [];
    sortData = getSortType(data); // 1. первая сортировка по типу жилья
    sortData = getSortPrice(sortData); // 2. вторая сортировка по цене
    sortData = getSortRooms(sortData); // 3. третья сортировка по комнатам
    sortData = getSortGuests(sortData); // 4. четвертая сортировка по количеству гостей
    sortData = getSortFeatures(sortData); // 5. пятая сортировка преимуществам
    return getArrMaxLength(sortData);
  };

  window.sort = {
    get: getSortData
  };

})()
;


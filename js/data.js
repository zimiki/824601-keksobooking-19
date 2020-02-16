'use strict';

// Модуль, который создаёт данные

(function () {
  var SIMILAR_OFFER = 8; // Число  похожих объектов
  var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var avatarNumber = ['01', '02', '03', '04', '05', '06', '07', '08'];


  // Функция для получения из исходного массива, нового массива случаной длины и неповторяющегося содержания
  var getRandomArr = function (arr) {
    var newArr = [];
    while (newArr.length < getRandom(1, arr.length)) {
      var element = arr[getRandom(0, (arr.length - 1))];
      if (newArr.indexOf(element) === -1) {
        newArr.push(element);
      }
    }
    return newArr;
  };

  // Функция для перемешивания массива
  var getMixArr = function (arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var swap = arr[i];
      arr[i] = arr[j];
      arr[j] = swap;
    }
    return arr;
  };

  // Функция генерирующая случайное число в диапазоне
  var getRandom = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };

  // Функция выбирающая случайный элемент массива
  var getRandomElementArr = function (arr) {
    var rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
  };

  // Функция генерирующая случайные координаты с учетом пределов отображения метки. У вернехнего левого угла метки пределы x (0, (mapLimits.width-pin.width)) y(130,  630)
  // Значит пределы в которых должна генерироваться координата для острого конца метки: x = + правее на (pin.width/2);  y = + ниже на (pin.height)
  var getRandomLocations = function (n) {
    var map = document.querySelector('.map');
    var mapLimits = map.querySelector('.map__overlay').getBoundingClientRect();
    var locations = [];
    for (var i = 0; i < n; i++) {
      var location = {
        x: getRandom((window.util.PIN_WIDTH / 2), mapLimits.width - (window.util.PIN_WIDTH / 2)),
        y: getRandom(130 + window.util.PIN_HEIGHT, 630 + window.util.PIN_HEIGHT)
      };
      locations.push(location);
    }
    return locations;
  };

  // Функция для создания случанйых данных
  var getMockData = function () {
    var avatarRandNumber = getMixArr(avatarNumber);
    var randomLocations = getRandomLocations(SIMILAR_OFFER);

    var arr = [];
    for (var i = 0; i < SIMILAR_OFFER; i++) {
      var pin = {
        author: {
          avatar: 'img/avatars/user' + avatarRandNumber[i] + '.png' // строка, вида img/avatars/user{{xx}}.png, где {{xx}} - число от 01 до 08 не повторяются
        },
        offer: {
          title: 'Заголовок преложения # ' + (i + 1), // строка, заголовок предложения
          address: randomLocations[i].x + ', ' + randomLocations[i].y, // строка, запись вида "{{location.x}}, {{location.y}}
          price: '5500', // число, стоимость
          type: getRandomElementArr(OFFER_TYPES), // строка с одним из фиксированных значений
          rooms: getRandom(1, 3), // число, количество комнат
          guests: getRandom(1, 10), // число, количество гостей
          checkin: getRandomElementArr(TIMES), // строка с одним из фиксированных значений
          checkout: getRandomElementArr(TIMES), // строка с одним из фиксированных значений
          features: getRandomArr(FEATURES), // массив строк случайной
          description: 'какое-то описание', // строка с описанием,
          photos: getRandomArr(PHOTOS), // массив строк случайной длины
        },
        location: {
          x: randomLocations[i].x,
          y: randomLocations[i].y
        }
      };
      arr.push(pin);
    }
    return arr;
  };

  window.data = {
    getMockData: getMockData,
  };
})()
;
